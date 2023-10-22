import { describe, expect, it, vi, type MockedFunction } from 'vitest'
vi.mock('../client.js')

import { call } from '../client.js'
import { provideService } from '../service.js'

describe('mock', () => {
  it('should work with the actual dependency', () => {
    const mockedCall = call as MockedFunction<typeof call>
    mockedCall.mockResolvedValue('mocked response')
    return expect(provideService()).resolves.toEqual('api returned mocked response')
  })
})