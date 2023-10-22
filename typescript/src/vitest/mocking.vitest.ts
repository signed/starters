import { expect, vi, test } from 'vitest'

const passErrorToCallback = (callback: (error: Error) => void) => callback(new Error('Secret Sauce'))

test('message of error passed to the callback ', () => {
  const callback = vi.fn()
  passErrorToCallback(callback)
  const passedError: any = callback.mock.calls[0]?.[0]
  expect(passedError.message).toEqual('Secret Sauce')
})
