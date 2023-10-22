import { call } from './client.js'

export const provideService = async () => {
  const result = await call('wupdidu')
  return 'api returned ' + result
}
