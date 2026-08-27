import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatMoney, isLowBalance, parseBalancePayload, parseMoney, parsePrefs, pickPrimary } from '../parse.js'

test('parseMoney accepts official string amounts', () => {
  assert.equal(parseMoney('9.00'), 9)
  assert.equal(parseMoney(' 12.34 '), 12.34)
  assert.equal(parseMoney(0), 0)
  assert.equal(parseMoney('nope'), null)
  assert.equal(parseMoney(undefined), null)
})

test('parseBalancePayload keeps CNY and USD rows', () => {
  const parsed = parseBalancePayload({
    is_available: true,
    balance_infos: [
      { currency: 'CNY', total_balance: '12.50', granted_balance: '2.50', topped_up_balance: '10.00' },
      { currency: 'USD', total_balance: '1.00', granted_balance: '0.00', topped_up_balance: '1.00' },
    ],
  })
  assert.equal(parsed.ok, true)
  assert.equal(parsed.available, true)
  assert.equal(parsed.balances.length, 2)
  assert.deepEqual(pickPrimary(parsed.balances), {
    currency: 'CNY',
    total: 12.5,
    granted: 2.5,
    toppedUp: 10,
  })
})

test('parseBalancePayload prefers USD when CNY is absent', () => {
  const parsed = parseBalancePayload({
    is_available: false,
    balance_infos: [
      { currency: 'USD', total_balance: '3.20', granted_balance: '0', topped_up_balance: '3.20' },
    ],
  })
  assert.equal(parsed.ok, true)
  assert.equal(parsed.available, false)
  assert.equal(pickPrimary(parsed.balances).currency, 'USD')
})

test('parseBalancePayload rejects a missing infos array', () => {
  const parsed = parseBalancePayload({ is_available: true })
  assert.equal(parsed.ok, false)
  assert.equal(parsed.code, 'malformed')
})

test('formatMoney uses a currency prefix and two decimals', () => {
  assert.equal(formatMoney('CNY', 9), '¥9.00')
  assert.equal(formatMoney('USD', 12.3), '$12.30')
})

test('isLowBalance uses ¥5 / $1 as the quiet warning line', () => {
  assert.equal(isLowBalance({ currency: 'CNY', total: 5 }), false)
  assert.equal(isLowBalance({ currency: 'CNY', total: 4.99 }), true)
  assert.equal(isLowBalance({ currency: 'USD', total: 1 }), false)
  assert.equal(isLowBalance({ currency: 'USD', total: 0.5 }), true)
  assert.equal(isLowBalance(null), false)
})

test('parsePrefs fills defaults and ignores unknown fields', () => {
  assert.deepEqual(parsePrefs(undefined), {
    placement: 'dock',
    refresh: 'turn',
    icon: 'whale',
  })
  assert.deepEqual(parsePrefs({ placement: 'hidden', refresh: 'interval', icon: 'amount', extra: 1 }), {
    placement: 'hidden',
    refresh: 'interval',
    icon: 'amount',
  })
  assert.deepEqual(parsePrefs({ placement: 'floating', refresh: 'always' }), {
    placement: 'dock',
    refresh: 'turn',
    icon: 'whale',
  })
})
