import {skip, suite, test} from '@testdeck/jest'

class Counter {
  value = 0

  increment() {
    this.value += 1
  }
}

const asyncCode = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('sorry')), 0)
  })
}

@suite('The one and only counter')
class A {
  private readonly counter: Counter = new Counter()

  @test 'increment once'() {
    this.counter.increment()
    expect(this.counter.value).toBe(1)
  }

  @test 'increment counter twice'() {
    this.counter.increment()
    this.counter.increment()
    expect(this.counter.value).toBe(2)
  }

  @test @skip 'wait for the promise to return'() {
    return asyncCode()
  }
}
