import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatMoney, parseBalancePayload, parseMoney, pickPrimary } from '../parse.js'

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
