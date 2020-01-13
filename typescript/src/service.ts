import { call } from 'client';

export const provideService = async () => {
  const result = await call('wupdidu');
  return 'api returned ' + result;
};
