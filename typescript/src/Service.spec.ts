import { call } from '../src/Client';
import { provideService } from '../src/Service';

jest.mock('../src/Client');

describe('mock', () => {
  it.skip('should work with the actual dependency', () => {
    const mockedCall = call as jest.MockedFunction<typeof call>;
    mockedCall.mockResolvedValue('mocked response');
    return expect(provideService()).resolves.toEqual('api returned mocked response');
  });
});