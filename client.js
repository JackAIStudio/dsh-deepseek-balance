window.__ModuleLoader__.load({
  id: 'dsh-deepseek-balance',
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
    const ROUTE = '/dsh-deepseek-balance'

    const css = [
      '.dsbal{appearance:none;display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px 0 9px;border:0;border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:16px;letter-spacing:.01em;white-space:nowrap;cursor:pointer;user-select:none}',
      '.dsbal:hover,.dsbal:focus-visible{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);outline:none}',
      '.dsbal:disabled{cursor:default;opacity:.72}',
      '.dsbal-name{color:var(--dsw-alias-label-tertiary);font-size:11px}',
      '.dsbal-amount{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-feature-settings:"tnum";font-weight:500}',
      '.dsbal.is-muted .dsbal-amount{color:var(--dsw-alias-label-tertiary);font-weight:400}',
      '.dsbal.is-error .dsbal-amount{color:var(--dsw-alias-state-error-primary)}',
      '.dsbal-refresh{display:inline-flex;width:12px;height:12px;opacity:.55;flex:none}',
      '.dsbal:hover .dsbal-refresh,.dsbal:focus-visible .dsbal-refresh{opacity:.9}',
      '.dsbal.is-loading .dsbal-refresh{opacity:.9;animation:dsbal-spin .8s linear infinite}',
      '@media (prefers-reduced-motion:reduce){.dsbal.is-loading .dsbal-refresh{animation:none}}',
      '@keyframes dsbal-spin{to{transform:rotate(360deg)}}',
    ].join('')

    const tagId = 'dsh-deepseek-balance/chip.css'
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {
      const tag = document.createElement('style')
      tag.dataset.plugin = 'dsh-deepseek-balance'
      tag.dataset.pluginCss = tagId
      tag.textContent = css
      document.head.appendChild(tag)
    }

    const copy = {
      zh: {
        name: 'DeepSeek',
        loading: '查询中',
        missing: '未配置',
        empty: '无余额',
        error: '查不到',
        unavailable: '账号当前不可用',
        granted: '赠送',
        topped: '充值',
        click: '点击刷新',
        updated: '更新于',
      },
      en: {
        name: 'DeepSeek',
        loading: 'Loading',
        missing: 'No key',
        empty: 'Empty',
        error: 'Unavailable',
        unavailable: 'Account unavailable',
        granted: 'Granted',
        topped: 'Topped up',
        click: 'Click to refresh',
        updated: 'Updated',
      },
    }

    function locale() {
      const lang = String(
        (typeof document !== 'undefined' && document.documentElement.lang)
        || (typeof navigator !== 'undefined' && navigator.language)
        || 'zh',
      ).toLowerCase()
      return lang.startsWith('zh') ? copy.zh : copy.en
    }

    function formatMoney(currency, amount) {
      if (!Number.isFinite(amount)) return '—'
      const body = amount.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      if (currency === 'CNY') return '¥' + body
      if (currency === 'USD') return '$' + body
      return body + ' ' + currency
    }

    function pickPrimary(balances) {
      if (!Array.isArray(balances) || balances.length === 0) return null
      return balances.find((row) => row.currency === 'CNY')
        || balances.find((row) => row.currency === 'USD')
        || balances[0]
        || null
    }

    function clock(ms) {
      if (!Number.isFinite(ms)) return ''
      try {
        return new Date(ms).toLocaleTimeString(locale() === copy.zh ? 'zh-CN' : 'en', {
          hour: '2-digit',
          minute: '2-digit',
        })
      } catch {
        return ''
      }
    }

    let snapshot = { status: 'idle' }
    let lastReady = null
    const listeners = new Set()
    let inFlight = null

    function emit() {
      for (const listener of listeners) listener()
    }

    async function requestBalance() {
      const response = await fetch(ROUTE, {
        method: 'GET',
        headers: { accept: 'application/json' },
        cache: 'no-store',
      })
      let value
      try {
        value = await response.json()
      } catch {
        throw Object.assign(new Error('DeepSeek 余额接口返回了无法解析的响应。'), { status: response.status })
      }
      if (!response.ok) {
        const error = new Error(typeof value.error === 'string' ? value.error : 'HTTP ' + response.status)
        error.status = response.status
        error.code = typeof value.code === 'string' ? value.code : undefined
        throw error
      }
      return value
    }

    function load() {
      if (inFlight) return inFlight
      snapshot = {
        status: 'loading',
        value: lastReady,
        error: snapshot.status === 'error' ? snapshot.error : undefined,
        code: snapshot.status === 'error' ? snapshot.code : undefined,
      }
      emit()
      inFlight = requestBalance().then((value) => {
        inFlight = null
        if (value && value.ok) {
          lastReady = value
          snapshot = { status: 'ready', value }
        } else {
          snapshot = {
            status: 'error',
            value: lastReady,
            error: (value && value.error) || '查询余额失败。',
            code: value && value.code,
          }
        }
        emit()
      }, (error) => {
        inFlight = null
        snapshot = {
          status: 'error',
          value: lastReady,
          error: error && error.message ? error.message : '查询余额失败。',
          code: error && error.code,
        }
        emit()
      })
      return inFlight
    }

    function RefreshIcon() {
      return React.createElement(
        'svg',
        {
          className: 'dsbal-refresh',
          viewBox: '0 0 16 16',
          width: 12,
          height: 12,
          'aria-hidden': true,
        },
        React.createElement('path', {
          fill: 'currentColor',
          d: 'M8 2.5a5.5 5.5 0 1 1-4.66 2.58.75.75 0 1 1 1.27.8A4 4 0 1 0 8 4v1.25a.75.75 0 0 1-1.2.6L4.3 4.1a.75.75 0 0 1 0-1.2l2.5-1.75A.75.75 0 0 1 8 1.75V2.5z',
        }),
      )
    }

    function titleFor(state, t) {
      const parts = []
      const value = state.value
      if (value && Array.isArray(value.balances)) {
        for (const row of value.balances) {
          parts.push(
            row.currency + ' ' + formatMoney(row.currency, row.total)
            + ' · ' + t.topped + ' ' + formatMoney(row.currency, row.toppedUp)
            + ' · ' + t.granted + ' ' + formatMoney(row.currency, row.granted),
          )
        }
        if (value.available === false) parts.push(t.unavailable)
        const stamp = clock(value.fetchedAt)
        if (stamp) parts.push(t.updated + ' ' + stamp)
      }
      if (state.status === 'error' && state.error) parts.push(state.error)
      parts.push(t.click)
      return parts.join('\n')
    }

    function Chip() {
      const t = locale()
      const [, bump] = React.useState(0)
      React.useEffect(() => {
        const onChange = () => bump((n) => n + 1)
        listeners.add(onChange)
        if (snapshot.status === 'idle') load()
        return () => { listeners.delete(onChange) }
      }, [])

      const state = snapshot
      const primary = state.value ? pickPrimary(state.value.balances) : null
      const loading = state.status === 'loading' || state.status === 'idle'
      let amount = t.loading
      let muted = true
      let errored = false
      if (primary) {
        amount = formatMoney(primary.currency, primary.total)
        muted = false
      } else if (state.status === 'error') {
        amount = state.code === 'missing-key' ? t.missing : t.error
        errored = state.code !== 'missing-key'
      } else if (state.status === 'ready') {
        amount = t.empty
      }

      const className = [
        'dsbal',
        loading ? 'is-loading' : '',
        muted ? 'is-muted' : '',
        errored ? 'is-error' : '',
      ].filter(Boolean).join(' ')

      return React.createElement(
        'button',
        {
          type: 'button',
          className,
          title: titleFor(state, t),
          'aria-label': t.name + ' ' + amount + '，' + t.click,
          'aria-busy': loading || undefined,
          onMouseDown: (event) => { event.preventDefault() },
          onClick: (event) => {
            event.preventDefault()
            event.stopPropagation()
            load()
          },
        },
        React.createElement('span', { className: 'dsbal-name' }, t.name),
        React.createElement('span', { className: 'dsbal-amount' }, amount),
        React.createElement(RefreshIcon),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      if (snapshot.status === 'idle') load()
      slots.inject('conversation.input.right', () => slots.register(
        {
          name: 'conversation.input.right',
          id: 'dsh-deepseek-balance',
          order: 20,
          label: 'DeepSeek 余额',
        },
        () => React.createElement(Chip),
      ))
      ctx.effect(() => () => {
        listeners.clear()
      })
    }

    module.exports = { name: 'dsh-deepseek-balance', apply }
    return module.exports
  },
})
