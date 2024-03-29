import { describe, expect, test, vi, type MockedFunction } from 'vitest'
import { call } from './client.js'
import { provideService } from './service.js'
vi.mock('./client.js')

describe('mock', () => {
  test('should work with the actual dependency', () => {
    const mockedCall = call as MockedFunction<typeof call>
    mockedCall.mockResolvedValue('mocked response')
    return expect(provideService()).resolves.toEqual('api returned mocked response')
  })
})
