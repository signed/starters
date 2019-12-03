import BigNumber from 'bignumber.js';
import { readFileSync } from 'fs';

const calculateFuelRequired = (mass: BigNumber) => {
  const blup = mass.dividedBy(3).toNumber();
  return Math.floor(blup) - 2;
};

test('day 01 challenge ', () => {
  const input = readFileSync(__dirname +'/Day01.input.csv','utf8');
  const lines = input.split('\n').filter(line => line.trim());
  const totalWeight = lines
    .map(line => new BigNumber(line))
    .map(calculateFuelRequired)
    .reduce((acc, cur) => acc + cur, 0);
  expect(totalWeight).toBe(3488702);
});

test('day one samples', () => {
  expect(calculateFuelRequired(new BigNumber(12))).toBe(2);
  expect(calculateFuelRequired(new BigNumber(14))).toBe(2);
  expect(calculateFuelRequired(new BigNumber(1969))).toBe(654);
  expect(calculateFuelRequired(new BigNumber(100756))).toBe(33583);
});
