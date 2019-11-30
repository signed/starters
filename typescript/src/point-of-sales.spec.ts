type Package = 'day ticket' | '4 hours' | '2 hours';
type PaymentMethod = 'cash' | 'bath card 100';

function calculatePriceFor(ticketType: Package, paymentMethod: PaymentMethod = 'cash') {
  if (ticketType === 'day ticket') {
    if (paymentMethod === 'bath card 100') {
      return 16.2
    }
    return 18;
  }
  if (ticketType === '4 hours') {
    if (paymentMethod === 'bath card 100') {
      return 14.4
    }
    return 16;
  }
  if (ticketType === '2 hours') {
    if (paymentMethod === 'bath card 100') {
      return 10.8
    }
    return 12;
  }
  throw new Error('should never be reached')
}

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