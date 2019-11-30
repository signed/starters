import BigNumber from 'bignumber.js';

type Package = 'day ticket' | '4 hours' | '2 hours';
type PaymentMethod = 'cash' | 'bath card 100' | 'bath card 200'| 'bath card 500';

const entryFeeFor = (ticketType: Package) => {
  if (ticketType === 'day ticket') {
    return 18;
  }
  if (ticketType === '4 hours') {
    return 16;
  }
  if (ticketType === '2 hours') {
    return 12;
  }
  throw new Error('should never be reached')
};

const reductionPercentage = (paymentMethod: PaymentMethod): number => {
  const map: Map<PaymentMethod, number> = new Map<PaymentMethod, number>();
  map.set('cash', 0);
  map.set('bath card 100', 0.1);
  map.set('bath card 200', 0.15);
  map.set('bath card 500', 0.2);
  return map.get(paymentMethod) ?? 0;
};

const calculatePriceFor = (ticketType: Package, paymentMethod: PaymentMethod = 'cash'): number => {
  const baseEntryFee: BigNumber = new BigNumber(entryFeeFor(ticketType));
  if (paymentMethod === 'cash') {
    return baseEntryFee.toNumber();
  }
  return baseEntryFee.multipliedBy(1 - reductionPercentage(paymentMethod)).toNumber()
};

it('basic cash prices', () => {
  expect(calculatePriceFor('2 hours')).toBe(12);
  expect(calculatePriceFor('4 hours')).toBe(16);
  expect(calculatePriceFor('day ticket')).toBe(18);
});

test('a bath card 100 reduces entry fee by 10 %', () => {
  expect(calculatePriceFor('2 hours', 'bath card 100')).toBe(10.8);
  expect(calculatePriceFor('4 hours', 'bath card 100')).toBe(14.4);
  expect(calculatePriceFor('day ticket', 'bath card 100')).toBe(16.2);
});

test('a bath card 200 reduces entry fee by 15 %', () => {
  expect(calculatePriceFor('2 hours', 'bath card 200')).toBe(10.2);
  expect(calculatePriceFor('4 hours', 'bath card 200')).toBe(13.6);
  expect(calculatePriceFor('day ticket', 'bath card 200')).toBe(15.3);
});

test('a bath card 500 reduces entry fee by 20 %', () => {
  expect(calculatePriceFor('2 hours', 'bath card 500')).toBe(9.6);
  expect(calculatePriceFor('4 hours', 'bath card 500')).toBe(12.8);
  expect(calculatePriceFor('day ticket', 'bath card 500')).toBe(14.4);
});
