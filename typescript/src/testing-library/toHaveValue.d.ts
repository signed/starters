export {}
// workaround to avoid importing @types/jest and use @jest/globals instead
// https://jestjs.io/blog/2022/04/25/jest-28#expect
// https://github.com/facebook/jest/tree/main/examples/expect-extend
// https://unpkg.com/browse/@types/testing-library__jest-dom@5.14.3/matchers.d.ts
declare module 'expect' {
  interface Matchers<R> {
    toHaveValue(value?: string | string[] | number | null): R
  }
}
