import {test} from '@jest/globals'
import {slowTest} from './slow-test'

let delayBy = (milliSeconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, milliSeconds)
  })

slowTest('will pass, timeout is 7000', async () => {
  await delayBy(6000)
})

test.skip('will fail, default timeout is 5000 ', async () => {
  await delayBy(6000)
})
