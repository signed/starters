import type { TestContext, Reporter, ReporterOnStartOptions, Test } from '@jest/reporters'
import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result'
import { Config } from '@jest/types'
// https://brunoscheufler.com/blog/2020-02-14-supercharging-jest-with-custom-reporters
// Our reporter implements only the onRunComplete lifecycle
// function, run after all tests have completed
class CustomReporter implements Reporter {
  messages: string[] = []

  constructor(private _config: Config.GlobalConfig, private _options: unknown) {
    this.add('instance created')
  }

  // called
  onRunStart(_results: AggregatedResult, _options: ReporterOnStartOptions): void | Promise<void> {
    this.add('tracer: onRunStart')
  }

  // called
  onTestFileStart(test: Test): void | Promise<void> {
    this.add(`tracer: onTestFileStart ${test.path}`)
  }

  onTestStart(_test: Test): void | Promise<void> {
    this.add('tracer: onTestStart')
  }

  // called
  onTestCaseResult(test: Test, testCaseResult: AssertionResult): void | Promise<void> {
    this.add('tracer: onTestCaseResult')
    testCaseResult.status = 'failed'
  }

  // called
  onTestFileResult(_test: Test, _testResult: TestResult, _aggregatedResult: AggregatedResult): void | Promise<void> {
    this.add('tracer: onTestFileResult')
  }

  onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): void | Promise<void> {
    this.add('tracer: onTestResult')
    aggregatedResult.success = false
  }

  //called
  async onRunComplete(_: Set<TestContext>, _results: AggregatedResult) {
    this.add('tracer: onRunComplete')
  }

  //called
  getLastError(): void | Error {
    this.add('tracer: getLastError')
    console.log(this.messages.join('\n'))
    return new Error('You should not have done this')
  }

  protected add(message: string) {
    this.messages.push(message)
    //console.log(message);
  }
}

module.exports = CustomReporter
