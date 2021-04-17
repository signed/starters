// https://jestjs.io/docs/api
// https://stackoverflow.com/questions/56174883/how-to-add-global-commands-to-jest-like-describe-and-it
// https://softwarewright.dev/blog/posts/jest-unit-testing/extending-jest.html
// https://github.com/pact-foundation/jest-pact
import { test } from '@jest/globals';
import { Circus, Global } from '@jest/types';
import { bind as bindEach } from 'jest-each';
import { ErrorWithStack } from 'jest-util';

type AddSlowTest = {
  (
    mode: 'todo',
    testName: Global.TestName
  ): void;
  (
    mode: 'only' | 'skip' | void,
    testName: Global.TestName,
    testFn: Global.TestFn,
    timeoutOverride?: number): void;
}

// https://github.com/facebook/jest/blob/master/packages/jest-circus/src/index.ts
export const slowTest: Global.It = (() => {
  const slowTest = (
    testName: Global.TestName,
    fn: Global.TestFn,
    timeout?: number
  ): void => _addSlowTest(undefined, testName, fn, timeout);
  const skip = (
    testName: Global.TestName,
    fn: Global.TestFn,
    timeout?: number
  ): void => _addSlowTest('skip', testName , fn, timeout);
  const only = (
    testName: Global.TestName,
    fn: Global.TestFn,
    timeout?: number
  ): void => _addSlowTest('only', testName, fn, timeout);

  slowTest.todo = (testName: Global.TestName, ...rest: Array<any>): void => {
    if (rest.length > 0 || typeof testName !== 'string') {
      throw new ErrorWithStack(
        'Todo must be called with only a description.',
        slowTest.todo
      );
    }
    return _addSlowTest('todo', testName);
  };

  const _addSlowTest: AddSlowTest = (mode: Circus.TestMode, testName: Global.TestName, testFn?: Global.TestFn | undefined, timeoutOverride?: number): void => {
    if (mode === 'todo') {
      return test.todo(testName);
    }
    if (testFn === undefined) {
      throw new Error('should not happen');
    }
    const timeout = timeoutOverride ?? 7000;
    if (mode === undefined) {
      return test(testName, testFn, timeout);
    }
    if (mode === 'skip') {
      return test.skip(testName, testFn, timeout);
    }
    if (mode === 'only') {
      return test.only(testName, testFn, timeout);
    }
  };

  slowTest.each = bindEach(slowTest);
  only.each = bindEach(only);
  skip.each = bindEach(skip);

  slowTest.only = only;
  slowTest.skip = skip;

  return slowTest;
})();

