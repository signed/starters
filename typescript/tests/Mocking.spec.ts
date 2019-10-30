const passErrorToCallback = (callback: (error: Error) => void) => callback(new Error('Secret Sauce'));

test('should ', () => {
  const callback = jest.fn();
  passErrorToCallback(callback);
  const passedError = callback.mock.calls[0][0];
  expect(passedError.message).toEqual('Secret Sauce')
});