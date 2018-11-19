import { hello, asyncFunction, callbackFunction } from '../src/index'

describe('hello world', () => {
  it('should greet the parameter', () => {
    expect(hello('you')).toEqual('Hello you');
  });
});

describe('testing async functions', () => {
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

  describe('return a promise', () => {
    it('success', () => {
      return asyncFunction('123').then(data => expect(data).toEqual('123 resolve'))
    });
    it.skip('fail', () => {
      return asyncFunction('123', false).then(data => expect(data).toEqual('123 resolve'))
    });
    it('expect to fail', () => {
      return asyncFunction('123', false).catch(e => expect(e).toBeInstanceOf(Error))
    });
  });

  describe('use promise support of expect', () => {
    it('success', () => {
      return expect(asyncFunction('123')).resolves.toEqual('123 resolve')
    });
    it.skip('fail', () => {
      return expect(asyncFunction('123', false)).resolves.toEqual('123 resolve')
    });
    it('expect to fail', () => {
      return expect(asyncFunction('123', false)).rejects.toBeInstanceOf(Error)
    });
  });

  describe('await with an async test function', () => {
    it('success', async () => {
      expect(await asyncFunction('123')).toEqual('123 resolve')
    });
    it.skip('fail', async () => {
      expect(await asyncFunction('123', false)).toEqual('123 resolve')
    });
  });
});