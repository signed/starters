import { hello, asyncFunction, callbackFunction } from '../src/index'

describe('hello world', () => {
  it('should greet the parameter', () => {
    expect(hello('you')).toEqual('Hello you');
  });
});


describe('testing async functions', () => {
  it('await with an async test function', async () => {
    expect(await asyncFunction('123')).toEqual('123 resolve')
  });
  describe('inject a done', () => {
    it('and callback is invoked', async (done) => {
      callbackFunction((value: string) => {
        expect(value).toEqual('hello from the callback');
        done();
      });
    });
    it.skip('and callback is never invoked', (done) => {
      callbackFunction((value: string) => {
        expect(value).toEqual('hello from the callback');
        done();
      }, false);

    });
  });
});