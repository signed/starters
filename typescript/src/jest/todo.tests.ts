import { describe, expect, test } from '@jest/globals'

describe('just want to keep a reminder to write a test', () => {
  test.todo('this feature needs this test')
  test('already implemented test', () => {
    expect(true).toBe(true)
  })
})
