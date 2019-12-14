const input = `<x=1, y=3, z=-11>
<x=17, y=-10, z=-8>
<x=-1, y=-15, z=2>
<x=12, y=-4, z=-4>`;

interface Vector {
  x: number;
  y: number;
  z: number;
}

const noVelocity = () => ({ x: 0, y: 0, z: 0 });

class Mass {
  constructor(public name: number, public position: Vector, public velocity: Vector) {
  }

  move(increase: Vector) {
    const newVelocity = {
      x: this.velocity.x + increase.x,
      y: this.velocity.y + increase.y,
      z: this.velocity.z + increase.z
    };

    const position = {
      x: this.position.x + newVelocity.x,
      y: this.position.y + newVelocity.y,
      z: this.position.z + newVelocity.z
    };
    return new Mass(this.name, position, newVelocity);
  }

  totalEnergy() {
    const potential = Math.abs(this.position.x) + Math.abs(this.position.y) + Math.abs(this.position.z);
    const kinetic = Math.abs(this.velocity.x) + Math.abs(this.velocity.y) + Math.abs(this.velocity.z);
    return potential * kinetic;
  }
}

interface Puh {
  pivot: Mass;
  others: Mass [];
}

type AxisSelect = (vector: Vector) => number

class System {
  constructor(public readonly masses: Mass[]) {
  }

  axisCoordinateFor(selector: AxisSelect): number[] {
    return this.masses.reduce((acc: number[], mass) => {
      acc.push(selector(mass.position));
      return acc;
    }, []);
  }

  axisVelocityFor(selector: AxisSelect): number[] {
    return this.masses.reduce((acc: number[], mass) => {
      acc.push(selector(mass.velocity));
      return acc;
    }, []);
  }

}

const readDataFrom = (map: string): System => {
  const masses = map.split('\n').map(line => line.slice(1, line.length - 1)).map((line, index) => {
    const strings = line.split(', ');
    const coordinates = strings.map(raw => raw.split('=')).reduce((acc: number [], cur: string []) => {
      acc.push(parseInt(cur[1]!, 10));
      return acc;
    }, []);
    const vector = { x: coordinates[0]!, y: coordinates[1]!, z: coordinates[2]! };
    return new Mass(index, vector, noVelocity());
  });
  return new System(masses);
};

const toPuh = (system: System): Puh[] => {
  const result: Puh[] = [];
  for (let i = 0; i < system.masses.length; i++) {
    const others = [...system.masses];
    others.splice(i, 1);
    result.push({
      pivot: system.masses[i],
      others
    });
  }
  return result;
};

const velocity = (p: number, o: number) => {
  if (p < o) {
    return 1;
  }
  if (p > o) {
    return -1;
  }
  return 0;
};

const stepFor = (system: System) => {
  const masses = toPuh(system).map(it => {
    const adjustVelocity = it.others.reduce((acc, cur) => {
      const x = velocity(it.pivot.position.x, cur.position.x) + acc.x;
      const y = velocity(it.pivot.position.y, cur.position.y) + acc.y;
      const z = velocity(it.pivot.position.z, cur.position.z) + acc.z;
      return {
        x,
        y,
        z
      };
    }, noVelocity());
    return it.pivot.move(adjustVelocity);
  });
  system = new System(masses);
  return system;
};

const runSystemFor = (steps: number, sample: string) => {
  let system = readDataFrom(sample);
  for (let step = 0; step < steps; step++) {
    system = stepFor(system);
  }
  return system;
};

function totalEnergyIn(system: System) {
  return system.masses.reduce((acc, cur) => acc + cur.totalEnergy(), 0);
}

it('sample one ', () => {
  //const system = readDataFrom(input);

  const sample = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;
  expect(totalEnergyIn(runSystemFor(10, sample))).toBe(179);
});

it('day 12 part 1', () => {
  expect(totalEnergyIn(runSystemFor(1000, input))).toBe(8310);
});


const cycleAfter = (selector: (vector: Vector) => number) => {
  let system = readDataFrom(input);
  const initialXCoordinates = system.axisCoordinateFor(selector);
  const initialVelocity = system.axisVelocityFor(selector);
  let step = 0;

  while (true) {
    system = stepFor(system);
    ++step;
    if (initialXCoordinates.toString() === system.axisCoordinateFor(selector).toString() && initialVelocity.toString() === system.axisVelocityFor(selector).toString()) {
      break;
    }
  }
  return step;
};

const greatestCommonDivisor = (a: number, b: number): number => a === 0 ? b : greatestCommonDivisor(b % a, a);
const leastCommonMultiple = (a: number, b: number): number => a * b / greatestCommonDivisor(a, b);

it('should ', () => {
  expect(greatestCommonDivisor(144, 256)).toBe(16);
  expect(greatestCommonDivisor(256, 144)).toBe(16);
});

it('day 12 part 2', () => {
  const cycleInX = cycleAfter((vector: Vector) => vector.x);
  const cycleInY = cycleAfter((vector: Vector) => vector.y);
  const cycleInZ = cycleAfter((vector: Vector) => vector.z);
  expect(cycleInX).toBe(186028);
  expect(cycleInY).toBe(268296);
  expect(cycleInZ).toBe(102356);

  const systemCycle = [cycleInX, cycleInY, cycleInZ].reduce(leastCommonMultiple, 1);
  expect(systemCycle).toBe(319290382980408);
});