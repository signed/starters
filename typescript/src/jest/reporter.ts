import type { Reporter, ReporterOnStartOptions, Test, TestContext } from '@jest/reporters'
import type { AggregatedResult, AssertionResult, TestResult } from '@jest/test-result'
import type { Config } from '@jest/types'

// https://brunoscheufler.com/blog/2020-02-14-supercharging-jest-with-custom-reporters
// Our reporter implements only the onRunComplete lifecycle
// function, run after all tests have completed
class CustomReporter implements Reporter {
  private _globalConfig: Config.GlobalConfig
  private _options: unknown
  private messages: string[] = []

  constructor(globalConfig: Config.GlobalConfig, options: unknown) {
    this._globalConfig = globalConfig
    this._options = options
    this.add('instance created')
  }

  // called
  onRunStart(_results: AggregatedResult, _options: ReporterOnStartOptions): void | Promise<void> {
    this.add('tracer: onRunStart')
    return undefined
  }

  // called
  onTestFileStart(test: Test): void | Promise<void> {
    this.add(`tracer: onTestFileStart ${test.path}`)
    return undefined
  }

  // deprecated and will not be called if onTestFileStart exists
  onTestStart(_test: Test): void | Promise<void> {
    this.add('tracer: onTestStart')
    return undefined
  }

  // called
  onTestCaseResult(_test: Test, _testCaseResult: AssertionResult): void | Promise<void> {
    this.add('tracer: onTestCaseResult')
    return undefined
  }

  //called
  onTestFileResult(_test: Test, _testResult: TestResult, _aggregatedResult: AggregatedResult): Promise<void> | void {
    this.add('tracer: onTestFileResult')
    return undefined
  }

  // deprecated and will not be called if onTestFileResult exists
  onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): void | Promise<void> {
    this.add('tracer: onTestResult')
    aggregatedResult.success = false
    return undefined
  }

  //called
  onRunComplete(_: Set<TestContext>, _results: AggregatedResult): Promise<void> | void {
    this.add('tracer: onRunComplete')
    return undefined
  }

  //was not called :(
  getLastError(): void | Error {
    this.add('tracer: getLastError')
    console.log(this.messages.join('\n'))
    return new Error('You should not have done this')
    //return undefined
  }

  protected add(message: string) {
    this.messages.push(message)
    console.log(message)
  }
}

module.exports = CustomReporter
