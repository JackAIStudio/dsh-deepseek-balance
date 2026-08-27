/** Parse and format DeepSeek official `/user/balance` payloads. */

/**
 * @param {unknown} value
 * @returns {number | null}
 */
export function parseMoney(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value !== 'string') return null
  const n = Number(value.trim())
  return Number.isFinite(n) ? n : null
}

/**
 * @param {unknown} body
 * @returns {{ ok: true, available: boolean, balances: Array<{ currency: string, total: number, granted: number, toppedUp: number }> } | { ok: false, code: string, error: string }}
 */
export function parseBalancePayload(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, code: 'malformed', error: 'DeepSeek 余额响应格式不正确。' }
  }
  const infos = body.balance_infos
  if (!Array.isArray(infos)) {
    return { ok: false, code: 'malformed', error: 'DeepSeek 余额响应缺少 balance_infos。' }
  }
  const balances = []
  for (const item of infos) {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) continue
    const currency = typeof item.currency === 'string' ? item.currency.trim().toUpperCase() : ''
    if (!currency) continue
    const total = parseMoney(item.total_balance)
    if (total === null) continue
    const granted = parseMoney(item.granted_balance)
    const toppedUp = parseMoney(item.topped_up_balance)
    balances.push({
      currency,
      total,
      granted: granted === null ? 0 : granted,
      toppedUp: toppedUp === null ? 0 : toppedUp,
    })
  }
  return {
    ok: true,
    available: body.is_available !== false,
    balances,
  }
}

/**
 * Prefer CNY, then USD, then the first remaining row.
 * @param {Array<{ currency: string }>} balances
 */
export function pickPrimary(balances) {
  return balances.find((row) => row.currency === 'CNY')
    ?? balances.find((row) => row.currency === 'USD')
    ?? balances[0]
    ?? null
}

/**
 * @param {string} currency
 * @param {number} amount
 */
export function formatMoney(currency, amount) {
  if (!Number.isFinite(amount)) return '—'
  const body = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (currency === 'CNY') return `¥${body}`
  if (currency === 'USD') return `$${body}`
  return `${body} ${currency}`
}

export function isLoopbackAddress(address) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}

/**
 * @param {{ currency?: string, total?: number } | null | undefined} row
 */
export function isLowBalance(row) {
  if (!row || !Number.isFinite(row.total)) return false
  if (row.currency === 'USD') return row.total < 1
  return row.total < 5
}

export const DEFAULT_PREFS = Object.freeze({
  placement: 'dock',
  refresh: 'turn',
  icon: 'whale',
})

export const INTERVAL_MS = 5 * 60 * 1000

/**
 * @param {unknown} raw
 * @returns {{ placement: 'dock' | 'hidden', refresh: 'off' | 'turn' | 'interval', icon: 'whale' | 'amount' }}
 */
export function parsePrefs(raw) {
  const src = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  return {
    placement: src.placement === 'hidden' ? 'hidden' : 'dock',
    refresh: src.refresh === 'off' || src.refresh === 'interval' ? src.refresh : 'turn',
    icon: src.icon === 'amount' ? 'amount' : 'whale',
  }
}

export const DEFAULT_BASE_URL = 'https://api.deepseek.com'
export const DEFAULT_API_KEY_ENV = 'DEEPSEEK_API_KEY'
export const BALANCE_PATH = '/user/balance'
export const ROUTE = '/dsh-deepseek-balance'
export const PREFS_ROUTE = '/dsh-deepseek-balance/prefs'
