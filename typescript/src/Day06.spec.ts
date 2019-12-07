import { readFileSync } from 'fs';

class Mass {
  readonly inOrbit: Mass[] = [];

  constructor(readonly name: string) {

  }
}

const countOrbits = (distanceToCenterMass: number, mass: Mass): number => {
  const directOrbits = mass.inOrbit.length * distanceToCenterMass;
  return directOrbits + mass.inOrbit.map(inOrbit => countOrbits(distanceToCenterMass + 1, inOrbit)).reduce((acc, cur) => acc + cur, 0);
};

const orbitsOn = (map: string) => {
  const nameToMass = new Map<String, Mass>();
  map.split('\n').map(line => line.split(')')).forEach(([name, inOrbit]) => {
    let maybeMass = nameToMass.get(name);
    if (maybeMass === undefined) {
      maybeMass = new Mass(name);
      nameToMass.set(name, maybeMass);
    }
    let maybeInOrbit = nameToMass.get(inOrbit);
    if (maybeInOrbit === undefined) {
      maybeInOrbit = new Mass(inOrbit);
      nameToMass.set(inOrbit, maybeInOrbit);
    }
    maybeMass.inOrbit.push(maybeInOrbit);

  });
  const com = nameToMass.get('COM')!;
  return countOrbits(1, com);
};

export const loadOrbitMap = () => {
  return  readFileSync(__dirname + '/Day06.input.csv', 'utf8');
};

it('day 6 task 1', () => {
  expect(orbitsOn(loadOrbitMap())).toBe(402879);
});

it('provided sample', () => {
  const map = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;
  expect(orbitsOn(map)).toBe(42);
});