function calculatePriceFor(ticketType: number | 'dayticket') {
  if (ticketType === 'dayticket') {
    return 18;
  }
  if (ticketType === 4) {
    return 16;
  }
  return 12;
}

it('two hours cost 12 euro ', () => {
  expect(calculatePriceFor(2)).toBe(12);
});

it('four hours cost 16 euro ', () => {
  expect(calculatePriceFor(4)).toBe(16);
});

it('a day ticket costs 18 euro ', () => {
  expect(calculatePriceFor('dayticket')).toBe(18);
});