import { Buffer } from 'node:buffer'
import {
  BALANCE_PATH,
  DEFAULT_API_KEY_ENV,
  DEFAULT_BASE_URL,
  ROUTE,
  isLoopbackAddress,
  parseBalancePayload,
} from './parse.js'

export const name = 'dsh-deepseek-balance'
export const inject = []

const FETCH_TIMEOUT_MS = 8000
const SECRET_FRAGMENT = /sk-[A-Za-z0-9]{8,}/g

function sendJson(res, statusCode, value) {
  const body = JSON.stringify(value)
  res.statusCode = statusCode
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('content-length', String(Buffer.byteLength(body)))
  res.end(body)
}

function redact(text) {
  return String(text || '').replace(SECRET_FRAGMENT, 'sk-[redacted]')
}

function errorMessage(error) {
  return redact(error instanceof Error ? error.message : String(error))
}

function resolveBaseUrl() {
  const raw = typeof process.env.DEEPSEEK_BASE_URL === 'string' ? process.env.DEEPSEEK_BASE_URL.trim() : ''
  return (raw || DEFAULT_BASE_URL).replace(/\/+$/, '')
}

async function resolveApiKey(ctx) {
  const credentials = ctx.get('credentials')
  if (credentials !== undefined) {
    try {
      const hit = await credentials.resolve(DEFAULT_API_KEY_ENV)
      if (hit !== undefined && typeof hit.value === 'string' && hit.value.trim() !== '') {
        return hit.value.trim()
      }
    } catch {
      // String refs are what the local store uses; keep going if the seam rejects.
    }
  }
  const ambient = process.env[DEFAULT_API_KEY_ENV]
  if (typeof ambient === 'string' && ambient.trim() !== '') return ambient.trim()
  return null
}

function classifyHttpStatus(status) {
  if (status === 401 || status === 403) return 'auth'
  if (status === 402) return 'quota'
  if (status === 429) return 'rate-limit'
  if (status >= 500) return 'server'
  return 'http'
}

async function readOfficialBalance(ctx, signal) {
  const apiKey = await resolveApiKey(ctx)
  if (apiKey === null) {
    return {
      ok: false,
      code: 'missing-key',
      error: '未配置 DEEPSEEK_API_KEY。请在设置 → 模型里写入 DeepSeek 密钥。',
    }
  }

  const url = `${resolveBaseUrl()}${BALANCE_PATH}`
  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${apiKey}`,
        accept: 'application/json',
        'user-agent': 'dsh-deepseek-balance/0.1.0',
      },
      signal,
    })
  } catch (error) {
    if (signal?.aborted) {
      return { ok: false, code: 'timeout', error: '查询 DeepSeek 余额超时。' }
    }
    return { ok: false, code: 'network', error: `无法连接 DeepSeek 余额接口：${errorMessage(error)}` }
  }

  const raw = await response.text()
  if (!response.ok) {
    const code = classifyHttpStatus(response.status)
    const message = code === 'auth'
      ? 'DeepSeek API Key 无效或已过期。'
      : `DeepSeek 余额接口返回 HTTP ${response.status}。`
    return { ok: false, code, error: message }
  }

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return { ok: false, code: 'malformed', error: 'DeepSeek 余额响应不是 JSON。' }
  }

  const parsed = parseBalancePayload(payload)
  if (!parsed.ok) return parsed
  return {
    ok: true,
    available: parsed.available,
    fetchedAt: Date.now(),
    balances: parsed.balances,
  }
}

function rejectUnlessLocal(req, res) {
  if (!isLoopbackAddress(req.socket.remoteAddress)) {
    sendJson(res, 403, {
      ok: false,
      code: 'remote-not-supported',
      error: '余额查询只在运行 `dsh web` 的这台机器上可用。',
    })
    return true
  }
  return false
}

export function apply(ctx) {
  ctx.inject(['webServer'], (web) => {
    const webServer = web.get('webServer')
    web.effect(() => webServer.register({
      kind: 'exact',
      path: ROUTE,
      async handler(req, res) {
        if (rejectUnlessLocal(req, res)) return
        if (req.method !== 'GET') {
          res.setHeader('allow', 'GET')
          sendJson(res, 405, { ok: false, code: 'method', error: 'Method not allowed.' })
          return
        }
        const ac = new AbortController()
        const timer = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)
        try {
          const result = await readOfficialBalance(ctx, ac.signal)
          sendJson(res, 200, result)
        } catch (error) {
          sendJson(res, 500, {
            ok: false,
            code: 'internal',
            error: errorMessage(error) || '查询余额失败。',
          })
        } finally {
          clearTimeout(timer)
        }
      },
    }), 'dsh-deepseek-balance')
  })
}
