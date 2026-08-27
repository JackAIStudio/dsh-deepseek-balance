window.__ModuleLoader__.load({
  id: 'dsh-deepseek-balance',
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')
    const h = React.createElement
    const ROUTE = '/dsh-deepseek-balance'
    const PREFS_ROUTE = '/dsh-deepseek-balance/prefs'
    const INTERVAL_MS = 5 * 60 * 1000
    const FOCUS_DEBOUNCE_MS = 15 * 1000
    const LOW_CNY = 5
    const LOW_USD = 1
    const DEFAULT_PREFS = { placement: 'dock', refresh: 'turn', icon: 'whale' }
    const SETTINGS_ID = 'deepseek-balance'
    const SETTINGS_LOCALE = 'settings.deepseek-balance'

    const css = [
      // Slot outlet is `display:contents` (inline), so each dock entry becomes its own
      // InputBar column child. Force one shared stats band, matching the slot contract.
      '[data-slot="conversation.composer.dock"]:has(> .dsbal-dock){display:flex!important;flex-flow:row nowrap;justify-content:center;align-items:center;box-sizing:border-box;width:100%;max-width:var(--dsh-chat-content-width);min-width:0;padding:4px calc(var(--dsh-composer-side-clearance) + 16px) 0;overflow:hidden}',
      '[data-slot="conversation.composer.dock"]:has(> .dsbal-dock)>*{box-sizing:border-box;flex:0 1 auto;min-width:0;width:auto!important;max-width:none!important;margin:0!important;padding:0!important}',
      '.dsbal-dock{display:inline-flex;align-items:center;flex:none;line-height:20px}',
      '[data-slot="conversation.composer.dock"]:has(> .dsbal-dock)>.dsbal-dock{flex:none;overflow:visible}',
      '.dsbal-dock:not(:last-child):after{content:"|";color:var(--dsw-alias-separator-primary);margin:0 10px;font-size:12px;line-height:20px}',
      '.dsbal{appearance:none;display:inline-flex;align-items:center;gap:6px;height:20px;padding:0 2px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-tertiary);font:inherit;font-size:12px;line-height:20px;letter-spacing:.01em;white-space:nowrap;cursor:pointer;user-select:none}',
      '.dsbal:hover,.dsbal:focus-visible{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);outline:none}',
      '.dsbal-amount{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}',
      '.dsbal.is-low .dsbal-amount{color:var(--dsw-alias-state-warn-primary)}',
      '.dsbal.is-error .dsbal-amount{color:var(--dsw-alias-state-error-primary)}',
      '.dsbal-whale{display:block;width:19px;height:14px;opacity:.78;flex:none}',
      '.dsbal:hover .dsbal-whale,.dsbal:focus-visible .dsbal-whale{opacity:.95}',
      '.dsbal.is-loading .dsbal-whale{opacity:.95;animation:dsbal-spin .8s linear infinite}',
      '@media (prefers-reduced-motion:reduce){.dsbal.is-loading .dsbal-whale{animation:none}}',
      '@keyframes dsbal-spin{to{transform:rotate(360deg)}}',
      '.dsbal-page{display:flex;flex-direction:column;gap:16px;width:100%}',
      '.dsbal-page h2{margin:0;color:var(--dsw-alias-label-primary);font-size:16px;font-weight:500;line-height:24px}',
      '.dsbal-page .dsbal-sub{margin:4px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}',
      '.dsbal-card{overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-module-platform)}',
      '.dsbal-card-body{display:flex;flex-direction:column;gap:16px;padding:16px 14px 18px}',
      '.dsbal-usage-head{display:flex;align-items:center;justify-content:space-between;gap:10px}',
      '.dsbal-usage-head h3{margin:0;font-size:13px;font-weight:600;line-height:18px;color:var(--dsw-alias-label-primary)}',
      '.dsbal-hero{margin:0;color:var(--dsw-alias-label-primary);font-size:28px;font-weight:600;line-height:36px;font-variant-numeric:tabular-nums}',
      '.dsbal-hero.is-warn{color:var(--dsw-alias-state-warn-primary)}',
      '.dsbal-hero.is-error{color:var(--dsw-alias-state-error-primary)}',
      '.dsbal-meta{margin:0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:20px}',
      '.dsbal-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}',
      '.dsbal-error{margin:0;color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}',
      '.dsbal-field{display:flex;flex-direction:column;gap:8px}',
      '.dsbal-field-label{font-size:13px;font-weight:500;line-height:20px;color:var(--dsw-alias-label-primary)}',
      '.dsbal-seg{display:flex;flex-wrap:wrap;gap:8px}',
      '.dsbal-seg-btn{appearance:none;min-height:32px;padding:4px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:20px;cursor:pointer}',
      '.dsbal-seg-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsbal-seg-btn.is-on{border-color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsbal-icon-btn{box-sizing:border-box;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;flex:none;border:0;border-radius:6px;padding:0;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}',
      '.dsbal-icon-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsbal-icon-btn:disabled{opacity:.55;cursor:default}',
      '.dsbal-icon-btn.is-loading svg{animation:dsbal-spin .8s linear infinite}',
      '@media (prefers-reduced-motion:reduce){.dsbal-icon-btn.is-loading svg{animation:none}}',
      '@media (max-width:640px){[data-slot="conversation.composer.dock"]:has(> .dsbal-dock){padding-left:12px;padding-right:12px}.dsbal-hero{font-size:24px;line-height:32px}}',
    ].join('')

    const tagId = 'dsh-deepseek-balance/ui.css'
    if (typeof document !== 'undefined') {
      let tag = document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']')
      if (tag === null) {
        tag = document.createElement('style')
        tag.dataset.plugin = 'dsh-deepseek-balance'
        tag.dataset.pluginCss = tagId
        document.head.appendChild(tag)
      }
      tag.textContent = css
    }

    const copy = {
      zh: {
        nav: 'DeepSeek 余额',
        title: 'DeepSeek 余额',
        subtitle: '官方账户剩余额度。API Key 在「设置 → 模型」里配置，不会进浏览器。',
        usage: '余额',
        loading: '查询中',
        missing: '未配置',
        empty: '无余额',
        error: '查不到',
        unavailable: '账号当前不可用',
        granted: '赠送',
        topped: '充值',
        click: '点击刷新',
        updated: '更新于',
        missingHint: '未配置 DEEPSEEK_API_KEY。请打开「设置 → 模型」写入 DeepSeek 密钥。',
        placement: '显示位置',
        placementDock: '输入框下方',
        placementHidden: '隐藏',
        refresh: '自动刷新',
        refreshOff: '关闭，仅手动',
        refreshTurn: '跟随对话',
        refreshInterval: '每 5 分钟',
        icon: '图标',
        iconWhale: '鲸标 + 金额',
        iconAmount: '仅金额',
        refreshAria: '刷新余额',
        busyAria: '正在查询余额',
      },
      en: {
        nav: 'DeepSeek balance',
        title: 'DeepSeek balance',
        subtitle: 'Official account balance. The API key lives in Settings → Models and never enters the browser.',
        usage: 'Balance',
        loading: 'Loading',
        missing: 'No key',
        empty: 'Empty',
        error: 'Unavailable',
        unavailable: 'Account unavailable',
        granted: 'Granted',
        topped: 'Topped up',
        click: 'Click to refresh',
        updated: 'Updated',
        missingHint: 'DEEPSEEK_API_KEY is not configured. Open Settings → Models and add a DeepSeek key.',
        placement: 'Placement',
        placementDock: 'Under the composer',
        placementHidden: 'Hidden',
        refresh: 'Auto-refresh',
        refreshOff: 'Off, manual only',
        refreshTurn: 'After each turn',
        refreshInterval: 'Every 5 minutes',
        icon: 'Icon',
        iconWhale: 'Logo + amount',
        iconAmount: 'Amount only',
        refreshAria: 'Refresh balance',
        busyAria: 'Reading balance',
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

    function isLowBalance(row) {
      if (!row || !Number.isFinite(row.total)) return false
      if (row.currency === 'USD') return row.total < LOW_USD
      return row.total < LOW_CNY
    }

    function parsePrefs(raw) {
      const src = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
      return {
        placement: src.placement === 'hidden' ? 'hidden' : 'dock',
        refresh: src.refresh === 'off' || src.refresh === 'interval' ? src.refresh : 'turn',
        icon: src.icon === 'amount' ? 'amount' : 'whale',
      }
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
    let lastFetchAt = 0
    let prefs = { ...DEFAULT_PREFS }
    let inFlight = null
    let intervalId = null
    const listeners = new Set()

    function emit() {
      for (const listener of listeners) listener()
    }

    function useStore() {
      const [, bump] = React.useState(0)
      React.useEffect(() => {
        const onChange = () => bump((n) => n + 1)
        listeners.add(onChange)
        return () => { listeners.delete(onChange) }
      }, [])
      return { snapshot, prefs }
    }

    async function requestJson(url, init) {
      const response = await fetch(url, {
        cache: 'no-store',
        ...init,
        headers: { accept: 'application/json', ...(init && init.headers) },
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

    function load(force) {
      if (inFlight) return inFlight
      if (!force && lastFetchAt > 0 && Date.now() - lastFetchAt < FOCUS_DEBOUNCE_MS && snapshot.status === 'ready') {
        return Promise.resolve(snapshot)
      }
      snapshot = {
        status: 'loading',
        value: lastReady,
        error: snapshot.status === 'error' ? snapshot.error : undefined,
        code: snapshot.status === 'error' ? snapshot.code : undefined,
      }
      emit()
      inFlight = requestJson(ROUTE, { method: 'GET' }).then((value) => {
        inFlight = null
        lastFetchAt = Date.now()
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
        lastFetchAt = Date.now()
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

    async function loadPrefs() {
      try {
        const value = await requestJson(PREFS_ROUTE, { method: 'GET' })
        if (value && value.ok) prefs = parsePrefs(value.prefs)
      } catch {
        prefs = { ...DEFAULT_PREFS }
      }
      emit()
      syncWatchers()
    }

    async function savePrefs(next) {
      const previous = prefs
      prefs = parsePrefs(next)
      emit()
      syncWatchers()
      try {
        const value = await requestJson(PREFS_ROUTE, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(prefs),
        })
        if (value && value.ok) prefs = parsePrefs(value.prefs)
        emit()
      } catch {
        prefs = previous
        emit()
        syncWatchers()
      }
    }

    function visible() {
      return typeof document === 'undefined' || document.visibilityState !== 'hidden'
    }

    function syncWatchers() {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
      if (prefs.refresh === 'interval' && visible()) {
        intervalId = setInterval(() => {
          if (visible()) load(false)
        }, INTERVAL_MS)
      }
    }

    function onVisibility() {
      if (!visible()) {
        if (intervalId !== null) {
          clearInterval(intervalId)
          intervalId = null
        }
        return
      }
      if (prefs.refresh !== 'off') load(false)
      syncWatchers()
    }

    function onFocus() {
      if (prefs.refresh !== 'off') load(false)
    }

    function amountState(t) {
      const state = snapshot
      const primary = state.value ? pickPrimary(state.value.balances) : null
      const loading = state.status === 'loading' || state.status === 'idle'
      let amount = t.loading
      let kind = 'muted'
      if (primary) {
        amount = formatMoney(primary.currency, primary.total)
        kind = isLowBalance(primary) ? 'low' : 'ready'
      } else if (state.status === 'error') {
        amount = state.code === 'missing-key' ? t.missing : t.error
        kind = state.code === 'missing-key' ? 'muted' : 'error'
      } else if (state.status === 'ready') {
        amount = t.empty
      }
      return { state, primary, loading, amount, kind }
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

    const WHALE_MARK = 'M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z'

    function WhaleIcon() {
      return h(
        'svg',
        {
          className: 'dsbal-whale',
          viewBox: '0 0 23.16 17.04',
          width: 19,
          height: 14,
          fill: 'none',
          'aria-hidden': true,
        },
        h('path', { d: WHALE_MARK, fill: 'currentColor' }),
      )
    }

    function RefreshGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 16 16', 'aria-hidden': true },
        h('path', {
          fill: 'currentColor',
          d: 'M8 2.5a5.5 5.5 0 1 1-4.66 2.58.75.75 0 1 1 1.27.8A4 4 0 1 0 8 4v1.25a.75.75 0 0 1-1.2.6L4.3 4.1a.75.75 0 0 1 0-1.2l2.5-1.75A.75.75 0 0 1 8 1.75V2.5z',
        }),
      )
    }

    function Chip(props) {
      const t = locale()
      useStore()
      const running = typeof props.useSession === 'function'
        ? props.useSession((s) => s.running)
        : false
      const prevRunning = React.useRef(running)
      React.useEffect(() => {
        if (prevRunning.current === true && running === false && prefs.refresh !== 'off') load(true)
        prevRunning.current = running
      }, [running])

      if (prefs.placement === 'hidden') return null

      const view = amountState(t)
      const className = [
        'dsbal',
        view.loading ? 'is-loading' : '',
        view.kind === 'low' ? 'is-low' : '',
        view.kind === 'error' ? 'is-error' : '',
      ].filter(Boolean).join(' ')

      return h(
        'div',
        { className: 'dsbal-dock' },
        h(
          'button',
          {
            type: 'button',
            className,
            title: titleFor(view.state, t),
            'aria-label': t.usage + ' ' + view.amount + '，' + t.click,
            'aria-busy': view.loading || undefined,
            onMouseDown: (event) => { event.preventDefault() },
            onClick: (event) => {
              event.preventDefault()
              event.stopPropagation()
              load(true)
            },
          },
          prefs.icon === 'whale' ? h(WhaleIcon) : null,
          h('span', { className: 'dsbal-amount' }, view.amount),
        ),
      )
    }

    function Segmented(props) {
      return h(
        'div',
        { className: 'dsbal-seg', role: 'radiogroup', 'aria-label': props.label },
        props.options.map((opt) => h(
          'button',
          {
            key: opt.id,
            type: 'button',
            role: 'radio',
            'aria-checked': props.value === opt.id,
            className: 'dsbal-seg-btn' + (props.value === opt.id ? ' is-on' : ''),
            onClick: () => {
              if (opt.id !== props.value) props.onChange(opt.id)
            },
          },
          opt.label,
        )),
      )
    }

    function SettingsPage() {
      const t = locale()
      useStore()
      const view = amountState(t)
      const stamp = view.state.value ? clock(view.state.value.fetchedAt) : ''
      const breakdown = view.primary
        ? t.topped + ' ' + formatMoney(view.primary.currency, view.primary.toppedUp)
          + ' · ' + t.granted + ' ' + formatMoney(view.primary.currency, view.primary.granted)
        : ''
      const heroClass = 'dsbal-hero'
        + (view.kind === 'low' ? ' is-warn' : '')
        + (view.kind === 'error' ? ' is-error' : '')

      return h(
        'div',
        { className: 'dsbal-page', 'data-dsbal-section': SETTINGS_LOCALE },
        h('header', null,
          h('h2', null, t.title),
          h('p', { className: 'dsbal-sub' }, t.subtitle),
        ),
        h('div', { className: 'dsbal-card' },
          h('div', { className: 'dsbal-card-body' },
            h('div', { className: 'dsbal-usage-head' },
              h('h3', null, t.usage),
              h('button', {
                type: 'button',
                className: 'dsbal-icon-btn' + (view.loading ? ' is-loading' : ''),
                'aria-label': view.loading ? t.busyAria : t.refreshAria,
                disabled: view.loading,
                onClick: () => load(true),
              }, h(RefreshGlyph)),
            ),
            h('p', { className: heroClass }, view.amount),
            breakdown ? h('p', { className: 'dsbal-meta' }, breakdown) : null,
            stamp ? h('p', { className: 'dsbal-hint' }, t.updated + ' ' + stamp) : null,
            view.state.status === 'error' && view.state.code === 'missing-key'
              ? h('p', { className: 'dsbal-error' }, t.missingHint)
              : view.state.status === 'error' && view.state.error
                ? h('p', { className: 'dsbal-error' }, view.state.error)
                : null,
            view.state.value && view.state.value.available === false
              ? h('p', { className: 'dsbal-error' }, t.unavailable)
              : null,
            h('div', { className: 'dsbal-field' },
              h('div', { className: 'dsbal-field-label' }, t.placement),
              h(Segmented, {
                label: t.placement,
                value: prefs.placement,
                onChange: (placement) => savePrefs({ ...prefs, placement }),
                options: [
                  { id: 'dock', label: t.placementDock },
                  { id: 'hidden', label: t.placementHidden },
                ],
              }),
            ),
            h('div', { className: 'dsbal-field' },
              h('div', { className: 'dsbal-field-label' }, t.refresh),
              h(Segmented, {
                label: t.refresh,
                value: prefs.refresh,
                onChange: (refresh) => savePrefs({ ...prefs, refresh }),
                options: [
                  { id: 'off', label: t.refreshOff },
                  { id: 'turn', label: t.refreshTurn },
                  { id: 'interval', label: t.refreshInterval },
                ],
              }),
            ),
            h('div', { className: 'dsbal-field' },
              h('div', { className: 'dsbal-field-label' }, t.icon),
              h(Segmented, {
                label: t.icon,
                value: prefs.icon,
                onChange: (icon) => savePrefs({ ...prefs, icon }),
                options: [
                  { id: 'whale', label: t.iconWhale },
                  { id: 'amount', label: t.iconAmount },
                ],
              }),
            ),
          ),
        ),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      const loc = ctx.get('locale')
      if (loc !== undefined) {
        ctx.effect(() => loc.register(SETTINGS_LOCALE, copy), 'dsh-deepseek-balance locale')
      }
      if (snapshot.status === 'idle') {
        loadPrefs().then(() => load(true))
      }
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibility)
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', onFocus)
      }
      slots.inject('conversation.composer.dock', () => slots.register(
        {
          name: 'conversation.composer.dock',
          id: 'dsh-deepseek-balance',
          order: -10,
          label: 'DeepSeek 余额',
        },
        (props) => h(Chip, props),
      ))
      slots.inject('settings.section', () => slots.register(
        {
          name: 'settings.section',
          id: SETTINGS_ID,
          order: 10,
          label: () => locale().nav,
          locale: SETTINGS_LOCALE,
        },
        () => h(SettingsPage),
      ))
      ctx.effect(() => () => {
        listeners.clear()
        if (intervalId !== null) {
          clearInterval(intervalId)
          intervalId = null
        }
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', onVisibility)
        }
        if (typeof window !== 'undefined') {
          window.removeEventListener('focus', onFocus)
        }
      })
    }

    module.exports = { name: 'dsh-deepseek-balance', apply }
    return module.exports
  },
})
