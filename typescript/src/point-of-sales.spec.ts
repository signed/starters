type Package = 'day ticket' | '4 hours' | '2 hours';

function calculatePriceFor(ticketType: Package) {
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
}

it('two hours cost 12 euro ', () => {
  expect(calculatePriceFor('2 hours')).toBe(12);
});

it('four hours cost 16 euro ', () => {
  expect(calculatePriceFor('4 hours')).toBe(16);
});

it('a day ticket costs 18 euro ', () => {
  expect(calculatePriceFor('day ticket')).toBe(18);
});