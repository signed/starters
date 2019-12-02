import { DateTime } from 'luxon';

test('build in date', () => {
  const enter = new Date(2010, 2, 4, 17, 35, 42);
  const exit = new Date(2010, 2, 4, 19, 35, 42);
  const millies = exit.getTime() - enter.getTime();
  console.log(millies);
});

test('luxon', () => {
  const enter = DateTime.utc(2010, 2, 4, 17, 35, 42);
  const exit = DateTime.utc(2010, 2, 4, 19, 35, 12);
  const duration = exit.diff(enter,[ 'hours', 'minutes', 'seconds']);
  console.log(duration.toObject());
});

test('zones', () => {
  const utc = DateTime.utc(2010, 2, 4, 17, 35, 42);
  expect(utc.zoneName).toBe('UTC');
  const local = DateTime.local(2010, 2, 4, 17, 35, 42);
  expect(local.zoneName).toBe('Europe/Berlin');

  console.log(utc.diff(local, ['hours']).toObject());
});