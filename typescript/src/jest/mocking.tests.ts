import { expect, jest, test } from '@jest/globals'

const passErrorToCallback = (callback: (error: Error) => void) => callback(new Error('Secret Sauce'))

test('message of error passed to the callback ', () => {
  const callback = jest.fn()
  passErrorToCallback(callback)
  const passedError: any = callback.mock.calls[0][0]
  expect(passedError.message).toEqual('Secret Sauce')
})
