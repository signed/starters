import BigNumber from 'bignumber.js';

type Ticket = 'day ticket' | '4 hours' | '2 hours';
type PaymentMethod = 'cash' | 'bath card 100' | 'bath card 200' | 'bath card 500';
type BathWear = 'bathrobe';

interface Order {
  ticket: Ticket;
  paymentMethod: PaymentMethod
  rent: BathWear[];
}

const entryFeeFor = (ticket: Ticket): BigNumber => {
  const prices: Map<Ticket, BigNumber> = new Map<Ticket, BigNumber>();
  prices.set('2 hours', new BigNumber(12));
  prices.set('4 hours', new BigNumber(16));
  prices.set('day ticket', new BigNumber(18));
  return prices.get(ticket) ?? new BigNumber(0);
};

const reductionPercentage = (paymentMethod: PaymentMethod): number => {
  const map: Map<PaymentMethod, number> = new Map<PaymentMethod, number>();
  map.set('cash', 0);
  map.set('bath card 100', 0.1);
  map.set('bath card 200', 0.15);
  map.set('bath card 500', 0.2);
  return map.get(paymentMethod) ?? 0;
};

const calculatePriceFor = (ticket: Ticket, paymentMethod: PaymentMethod = 'cash'): number => {
  const order: Order = {
    ticket,
    paymentMethod,
    rent: []
  };
  return calculatePriceForOrder(order);
};

function rentalFeeFor(rent: BathWear[]) {
  const rentalPrices: Map<BathWear, BigNumber> = new Map<BathWear, BigNumber>();
  rentalPrices.set('bathrobe', new BigNumber(5));
  return rent.map(bathWear => rentalPrices.get(bathWear)?? new BigNumber(0))
    .reduce((acc, curr) => acc.plus(curr), new BigNumber(0));
}

function calculatePriceForOrder(order: Order) {
  const reduction = 1 - reductionPercentage(order.paymentMethod);
  const entryFee: BigNumber = entryFeeFor(order.ticket).multipliedBy(reduction);
  const rentalFee: BigNumber = rentalFeeFor(order.rent);
  const totalFee = entryFee.plus(rentalFee);
  return totalFee.toNumber();
}

it('basic cash prices', () => {
  expect(calculatePriceFor('2 hours')).toBe(12);
  expect(calculatePriceFor('4 hours')).toBe(16);
  expect(calculatePriceFor('day ticket')).toBe(18);
});

test('visitors can rent a bathrobe', () => {
  const order: Order = {
    ticket: '2 hours',
    paymentMethod: 'cash',
    rent: ['bathrobe']
  };
  expect(calculatePriceForOrder(order)).toBe(17);
});

test('bath wear is not eligible for price reduction from bath cards', () => {
  const order: Order = {
    ticket: '2 hours',
    paymentMethod: 'bath card 100',
    rent: ['bathrobe']
  };
  expect(calculatePriceForOrder(order)).toBe(15.8);
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
