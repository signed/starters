import { readFileSync } from 'fs';

class Mass {
  _orbits: Mass | undefined;
  readonly inOrbit: Mass[] = [];

  constructor(readonly name: string) {
  }

  orbits(mass: Mass) {
    if (this._orbits !== undefined) {
      throw new Error('interesting')
    }
    this._orbits = mass;
  }

  pathToCom():string [] {
    if (this._orbits === undefined) {
      return [];
    }
    const flup = this._orbits.pathToCom();
    return [...flup, this._orbits.name];
  }

  doesOrbit(){
    return this._orbits !== undefined
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
  map.split('\n').map(line => line.split(')')).forEach(([massName, inOrbitName]) => {
    const mass = getOrInsert(nameToMass, massName, name => new Mass(name));
    const inOrbit = getOrInsert(nameToMass, inOrbitName, name => new Mass(name));
    inOrbit.orbits(mass);
    mass.inOrbit.push(inOrbit);
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


const orbitJumpsFrom = (map: string, from: string, key: string): number => {
  const linkedMap = buildMap(map);
  const you = linkedMap.get(from)!.pathToCom();
  const santa = linkedMap.get(key)!.pathToCom();
  const limit = Math.min(you.length, santa.length);

  for (let i = 0; i < limit; i++) {
    if (santa[i] !== you[i]) {
      const stepsFromYouToSharedNode = you.splice(i, you.length - 1).length;
      const stepsFromSharedNodeToSanta = santa.splice(i, santa.length - 1).length;
      return stepsFromYouToSharedNode + stepsFromSharedNodeToSanta;
    }
  }
};

it('day 6 task 2 orbit jumps to santa', () => {
  expect(orbitJumpsFrom(loadOrbitMap(), 'YOU', 'SAN')).toBe(484);
});

it('provided sample for orbit jumps', () => {
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
K)L
K)YOU
I)SAN`;
  expect(orbitJumpsFrom(map, 'YOU', 'SAN')).toBe(4);
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