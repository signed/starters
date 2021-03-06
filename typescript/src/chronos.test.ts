import { Clock, install } from '@sinonjs/fake-timers';
import { deeplyNestedAsync } from 'chronos';

describe('async code', () => {
  describe('in real time', () => {
    it('2nd callback should be called given a long enough timeout', (done) => {
      const one = jest.fn();
      const two = () => done();
      deeplyNestedAsync(one, two);
    }, 5000);
  });
  describe('jest fake timers', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('2nd callback should be called immediately because we fake time', (done) => {
      const ignore = jest.fn();
      const complete = () => done();
      deeplyNestedAsync(ignore, complete);
      expect(jest.getTimerCount()).toEqual(1);
      jest.runAllTimers();
      expect(jest.getTimerCount()).toEqual(0);
    }, 100)
  });

  describe('lolex fake time', () => {
    let clock: Clock;

    beforeEach(() => {
      clock = install();
    });

    afterEach(() => {
      clock.uninstall();
    });

    it('should ', (done) => {
      const ignore = jest.fn();
      const complete = () => done();
      deeplyNestedAsync(ignore, complete);
      expect(clock.countTimers()).toEqual(1);
      clock.runAll();
      expect(clock.countTimers()).toEqual(0);
    });
  });
});

