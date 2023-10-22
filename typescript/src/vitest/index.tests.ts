import { describe, expect, test } from 'vitest'
import { asyncFunction, callbackFunction, hello } from './index.js'

describe('hello world', () => {
  test('should greet the parameter', () => {
    expect(hello('you')).toEqual('Hello you')
  })
})

describe('testing async functions', () => {
  describe('inject a done', () => {
    test('and callback is invoked', () => {
      return new Promise<void>((done) => {
        callbackFunction((value: string) => {
          expect(value).toEqual('hello from the callback')
          done()
        })
      })
    })
    test.skip('and callback is never invoked', () => {
      return new Promise<void>((done) => {
        callbackFunction((value: string) => {
          expect(value).toEqual('hello from the callback')
          done()
        }, false)
      })
    })
  })

  describe('return a promise', () => {
    test('success', () => {
      return asyncFunction('123').then((data) => expect(data).toEqual('123 resolve'))
    })
    test.skip('fail', () => {
      return asyncFunction('123', false).then((data) => expect(data).toEqual('123 resolve'))
    })
    test('expect to fail', () => {
      return asyncFunction('123', false).catch((e) => expect(e).toBeInstanceOf(Error))
    })
  })

  describe('use promise support of expect', () => {
    test('success', () => {
      return expect(asyncFunction('123')).resolves.toEqual('123 resolve')
    })
    test.skip('fail', () => {
      return expect(asyncFunction('123', false)).resolves.toEqual('123 resolve')
    })
    test('expect to fail', () => {
      return expect(asyncFunction('123', false)).rejects.toBeInstanceOf(Error)
    })
  })

  describe('await with an async test function', () => {
    test('success', async () => {
      expect(await asyncFunction('123')).toEqual('123 resolve')
    })
    test.skip('fail', async () => {
      expect(await asyncFunction('123', false)).toEqual('123 resolve')
    })
  })
})

describe('matchers', () => {
  test('equality and identity ', () => {
    const actual = { one: 1, two: 2 }
    expect(actual).toBe(actual)
    let expected = { one: 1, two: 2 }
    expect(actual).not.toBe(expected)

    expect(actual).toEqual(expected)
  })

  describe('for strings', () => {
    test('contain', () => {
      expect('hello you').toContain('o y')
    })
    test('match regex', () => {
      expect('hello you').toMatch(/o y/)
    })
  })

  describe('exceptions', () => {
    const throwError = () => {
      throw new Error('as ordered')
    }

    test('vanilla throw check ', () => {
      expect(throwError).toThrow()
    })
  })
})
