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

const getOrInsert = <Key, Value>(map: Map<Key, Value>, key: Key, creator: (key: Key) => Value): Value => {
  if (!map.has(key)) {
    const value = creator(key);
    map.set(key, value);
    return value;
  }
  return map.get(key)!;
};

function buildMap(map: string) {
  const nameToMass = new Map<string, Mass>();
  map.split('\n').map(line => line.split(')')).forEach(([name, inOrbit]) => {
    const maybeMass = getOrInsert(nameToMass, name, name => new Mass(name));
    const maybeInOrbit = getOrInsert(nameToMass, inOrbit, name => new Mass(name));
    maybeMass.inOrbit.push(maybeInOrbit);
  });
  return nameToMass;
}

function centerOfMass(map: string) {
  return buildMap(map).get('COM')!;
}

const orbitsOn = (map: string) => {
  return countOrbits(1, centerOfMass(map));
};

export const loadOrbitMap = () => {
  return readFileSync(__dirname + '/Day06.input.csv', 'utf8');
};

it('day 6 task 1 orbits', () => {
  expect(orbitsOn(loadOrbitMap())).toBe(402879);
});

it('day 6 task 2 orbit jumps to santa', () => {
  const map = buildMap(loadOrbitMap());

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