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
  constructor(public name:number, public position: Vector, public velocity: Vector) {
  }

  move(adjustVelocity: Vector) {
    const position = {
      x: this.position.x + adjustVelocity.x,
      y: this.position.y + adjustVelocity.y,
      z: this.position.z + adjustVelocity.z
    };
    return new Mass(this.name, position,adjustVelocity);
  }
}

interface Puh {
  pivot: Mass;
  others: Mass [];
}

type System = Mass[];

const readDataFrom = (map: string) => {
  return map.split('\n').map(line => line.slice(1, line.length - 1)).map((line, index) => {
    const strings = line.split(', ');
    const coordinates = strings.map(raw => raw.split('=')).reduce((acc: number [], cur: string []) => {
      acc.push(parseInt(cur[1]!, 10));
      return acc;
    }, []);
    const vector = { x: coordinates[0]!, y: coordinates[1]!, z: coordinates[2]! };
    return new Mass(index, vector, noVelocity());
  });
};

const toPuh = (system: System): Puh[] => {
  const result: Puh[] = [];
  for (let i = 0; i < system.length; i++) {
    const others = [...system];
    others.splice(i, 1);
    result.push({
      pivot: system[i],
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

it('should ', () => {
  //const system = readDataFrom(input);

  const sample = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

  let system = readDataFrom(sample);

  for (let step = 0; step < 2; step++) {
    system = toPuh(system).map(it => {
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
  }
  console.log(system);

});