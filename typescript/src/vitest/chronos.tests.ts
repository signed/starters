import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { install, InstalledClock } from '@sinonjs/fake-timers'
import { deeplyNestedAsync } from './chronos.js'

describe('async code', () => {
  describe('in real time', () => {
    test('2nd callback should be called given a long enough timeout', { timeout: 5000 }, () => {
      return new Promise<void>((done) => {
        const one = vi.fn()
        const two = () => done()
        deeplyNestedAsync(one, two)
      })
    })
  })
  describe('jest fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })
    test('2nd callback should be called immediately because we fake time', { timeout: 100 }, () => {
      return new Promise<void>((done) => {
        const ignore = vi.fn()
        const complete = () => done()
        deeplyNestedAsync(ignore, complete)
        expect(vi.getTimerCount()).toEqual(1)
        vi.runAllTimers()
        expect(vi.getTimerCount()).toEqual(0)
      })
    })
  })

  describe('lolex fake time', () => {
    let clock: InstalledClock

    beforeEach(() => {
      clock = install()
    })

    afterEach(() => {
      clock.uninstall()
    })

    test('should', { timeout: 100 }, () => {
      return new Promise<void>((done) => {
        const ignore = vi.fn()
        const complete = () => done()
        deeplyNestedAsync(ignore, complete)
        expect(clock.countTimers()).toEqual(1)
        clock.runAll()
        expect(clock.countTimers()).toEqual(0)
      })
    })
  })
})
