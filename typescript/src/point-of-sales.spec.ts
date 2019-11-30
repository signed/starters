type Package = 'day ticket' | '4 hours' | '2 hours';
type PaymentMethod = 'cash' | 'bath card 100';

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

const reductionPercentage = (paymentMethod: PaymentMethod) => {
  const map: Map<PaymentMethod, number> = new Map<PaymentMethod, number>();
  map.set('cash', 0);
  map.set('bath card 100', 0.1);
  return map.get(paymentMethod) ?? 0;
};

const calculatePriceFor = (ticketType: Package, paymentMethod: PaymentMethod = 'cash') => {
  const baseEntryFee = entryFeeFor(ticketType);
  if (paymentMethod === 'cash') {
    return baseEntryFee;
  }
  return baseEntryFee * (1 - reductionPercentage(paymentMethod));
};


test('a bath card 100 reduces entry fee by 10 %', () => {
  expect(calculatePriceFor('2 hours', 'bath card 100')).toBe(10.8);
  expect(calculatePriceFor('4 hours', 'bath card 100')).toBe(14.4);
  expect(calculatePriceFor('day ticket', 'bath card 100')).toBe(16.2);
});

it('two hours cost 12 euro ', () => {
  expect(calculatePriceFor('2 hours')).toBe(12);
});

it('four hours cost 16 euro ', () => {
  expect(calculatePriceFor('4 hours')).toBe(16);
});

it('a day ticket costs 18 euro ', () => {
  expect(calculatePriceFor('day ticket')).toBe(18);
});