import { hello, asyncFunction } from '../src/index'

describe('hello world', () => {
  it('should greet the parameter', () => {
    expect(hello('you')).toEqual('Hello you');
  });
});


describe('testing async functions', () => {
  it('await with an async test function', async () => {
    expect(await asyncFunction('123')).toEqual('123 resolve')
  });
});