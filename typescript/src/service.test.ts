import { call } from 'client';
import { provideService } from 'service';

jest.mock('client');

describe('mock', () => {
  it('should work with the actual dependency', () => {
    const mockedCall = call as jest.MockedFunction<typeof call>;
    mockedCall.mockResolvedValue('mocked response');
    return expect(provideService()).resolves.toEqual('api returned mocked response');
  });
});