import { describe } from '@jest/globals'

interface Context {
  identifier: string
  counter: number
}

let globalCounter = 0
const rule = (identifier: string) => {
  let context: Context = {
    identifier,
  } as Context

  beforeEach(() => {
    context.counter = globalCounter++
    //console.log(`setup ${identifier} as ${context.counter}`);
  })

  afterEach(() => {
    //console.log(`teardown ${identifier} ${context.counter}`);
  })

  return context
}

describe('top', () => {
  const context1 = rule('top')

  describe('one', () => {
    rule('one')

    test('1st', () => {
      console.log(`1st ${context1.counter}`)
    })
    test('2nd', () => {
      console.log(`2nd ${context1.counter}`)
    })
  })

  describe('two', () => {
    rule('two')
    test('A', () => {
      console.log(`A ${context1.counter}`)
    })
    test('B', () => {
      console.log(`B ${context1.counter}`)
    })
  })
})
