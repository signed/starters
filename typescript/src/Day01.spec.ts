import BigNumber from 'bignumber.js';
import { readFileSync } from 'fs';

const naiveFullCalculator = (mass: BigNumber) => {
  const fullRequired = Math.floor(mass.dividedBy(3).toNumber()) - 2;
  if (fullRequired < 0) {
    return 0;
  }
  return fullRequired;
};

const considerWeightOfAddedFuel = (mass: BigNumber) => {
  let currentMass = naiveFullCalculator(mass);
  const masses = [];
  while (currentMass != 0) {
    masses.push(currentMass);
    currentMass = naiveFullCalculator(new BigNumber(currentMass));
  }
  return masses.reduce((acc, cur) => acc + cur, 0);
};

type FuelCalculator = (mass: BigNumber) => number

function fuelForVoyage(fuelCalculator: FuelCalculator) {
  const input = readFileSync(__dirname + '/Day01.input.csv', 'utf8');
  const lines = input.split('\n').filter(line => line.trim());
  return lines
    .map(line => new BigNumber(line))
    .map(fuelCalculator)
    .reduce((acc, cur) => acc + cur, 0);
}


test('day 01 challenge ', () => {
  expect(fuelForVoyage(naiveFullCalculator)).toBe(3488702);
});

test('day 01 challenge fuel has weight too ', () => {
  expect(fuelForVoyage(considerWeightOfAddedFuel)).toBe(5230169);
});

test('day one samples', () => {
  expect(naiveFullCalculator(new BigNumber(12))).toBe(2);
  expect(naiveFullCalculator(new BigNumber(14))).toBe(2);
  expect(naiveFullCalculator(new BigNumber(1969))).toBe(654);
  expect(naiveFullCalculator(new BigNumber(100756))).toBe(33583);
});

test('day one fuel has mass too', () => {
  expect(considerWeightOfAddedFuel(new BigNumber(14))).toBe(2);
  expect(considerWeightOfAddedFuel(new BigNumber(1969))).toBe(966);
  expect(considerWeightOfAddedFuel(new BigNumber(100756))).toBe(50346);
});
