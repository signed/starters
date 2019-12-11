import { readFileSync } from 'fs';
import { getOrInsert } from './maps';

export const loadAsteroidMap = () => {
  return readFileSync(__dirname + '/Day10.input.csv', 'utf8');
};

class Coordinate {
  constructor(readonly x: number, readonly y: number) {
  }

  toString() {
    return `x: ${this.x} y: ${this.y}`;
  }

  isEqual(other: Coordinate) {
    return this.x === other.x && this.y === other.y;
  }
}

const bigExamplePivot = new Coordinate(11, 13);
const bigExample = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;


const print = (coordinatesForAsteroids: Map<string, Coordinate>, dimensions: Dimensions, renderHints?: Map<string, string>) => {
  const lines: string[] = [];
  for (let y = 0; y < dimensions.y; y++) {
    const line = [];
    for (let x = 0; x < dimensions.x; x++) {
      const s = new Coordinate(x, y);
      let cell = coordinatesForAsteroids.has(s.toString()) ? '#' : '.';
      if (renderHints && renderHints.has(s.toString())) {
        cell = renderHints.get(s.toString())!;
      }
      line.push(cell);
    }
    lines.push(line.join(''));
  }
  return lines.join('\n');
};

const mapWithCoordinatesFrom = (map: string) => {
  const coordinatesForAsteroids = new Map<string, Coordinate>();
  const lines = map.split('\n');
  lines.forEach((line, y) => line.split('').forEach((element, x) => {
    if (element == '.') {
      return;
    }
    const coordinate = new Coordinate(x, y);
    coordinatesForAsteroids.set(coordinate.toString(), coordinate);
  }));
  const dimensions: Dimensions = { x: lines[0].length, y: lines.length };
  return { coordinatesForAsteroids, dimensions };
};

type LinearEquation = (x: number) => number

const linearEquationFor = (p1: Coordinate, p2: Coordinate): LinearEquation => {
  return (x: number): number => {
    return ((p2.y - p1.y) / (p2.x - p1.x)) * (x - p1.x) + p1.y;
  };
};

interface Dimensions {
  x: number;
  y: number;
}

it('load and re-create map  ', () => {
  const map = loadAsteroidMap();
  const { coordinatesForAsteroids, dimensions } = mapWithCoordinatesFrom(map);
  expect(print(coordinatesForAsteroids, dimensions)).toEqual(map);
});

it('basic sanity check ', () => {
  const equation = linearEquationFor(new Coordinate(1, 1), new Coordinate(5, 5));
  expect(equation(3)).toBe(3);
});

function scanForVisibleAsteroids(coordinatesForAsteroids: Map<string, Coordinate>, dimensons: Dimensions) {
  return (pivot: Coordinate) => {
    const pivotMap = new Map(coordinatesForAsteroids);
    const pivotAsteroids = Array.from(pivotMap.values());
    pivotAsteroids.filter(other => !other.isEqual(pivot))
      .forEach(other => {
          if (!pivotMap.has(other.toString())) {
            // was already removed, no need to check
            return;
          }

          const leftOf: Coordinate[] = [];
          const rightOf: Coordinate[] = [];

          if (pivot.x === other.x) {
            // the two are in the same column, have a gradient of infinity
            for (let y = 0; y < dimensons.y; y++) {
              if (pivot.y === y) {
                continue;
              }
              const candidate = new Coordinate(pivot.x, y);
              if (pivotMap.has(candidate.toString())) {
                if (y < pivot.y) {
                  leftOf.push(candidate);
                } else {
                  rightOf.push(candidate);
                }
              }
            }
          } else if (pivot.y === other.y) {
            // the two are in the same row gradient is zero
            for (let x = 0; x < dimensons.x; x++) {
              if (pivot.x === x) {
                continue;
              }
              const candidate = new Coordinate(x, pivot.y);
              if (pivotMap.has(candidate.toString())) {
                if (x < pivot.x) {
                  leftOf.push(candidate);
                } else {
                  rightOf.push(candidate);
                }
              }
            }
          } else {
            const equation = linearEquationFor(pivot, other);
            for (let x = 0; x < dimensons.x; x++) {
              if (pivot.x === x) {
                continue;
              }
              const y = equation(x);
              const candidate = new Coordinate(x, y);
              if (pivotMap.has(candidate.toString())) {
                if (x < pivot.x) {
                  leftOf.push(candidate);
                } else {
                  rightOf.push(candidate);
                }
              }
            }
          }

          if (leftOf.length > 1) {
            leftOf.pop();
            leftOf.forEach(asteroid => pivotMap.delete(asteroid.toString()));
          }
          if (rightOf.length > 1) {
            rightOf.shift();
            rightOf.forEach(asteroid => pivotMap.delete(asteroid.toString()));
          }
        }
      );
    pivotMap.delete(pivot.toString());
    const renderHints = new Map<string, string>();
    renderHints.set(pivot.toString(), 'o');
    return { pivot, visible: pivotMap.size, map: print(pivotMap, dimensons, renderHints), pivotMap };
  };
}

function maxVisibleAsteroidsFor(map: string) {
  const { dimensions, coordinatesForAsteroids } = mapWithCoordinatesFrom(map);

  const asteroids = Array.from(coordinatesForAsteroids.values());
  const result = asteroids.map(scanForVisibleAsteroids(coordinatesForAsteroids, dimensions));
  result.sort((s1, s2) => {
    if (s1.visible < s2.visible) {
      return -1;
    }
    if (s1.visible > s2.visible) {
      return 1;
    }
    return 0;
  });
  return result.pop()!;
}

it('should work for the sample', () => {
  const map = `.#..#
.....
#####
....#
...##`;
  expect(maxVisibleAsteroidsFor(map).visible).toBe(8);
});

it('should work for the big sample', () => {
  const { dimensions } = mapWithCoordinatesFrom(bigExample);
  const result = maxVisibleAsteroidsFor(bigExample);
  expect(result.visible).toBe(210);
  expect(result.pivot).toEqual(bigExamplePivot);
  //console.log(result.map);

  const renderHints = new Map<string, string>();
  renderHints.set(bigExamplePivot.toString(), 'o');
  const fst = new Coordinate(11,12);
  const snd = new Coordinate(12,1);
  const thrd = new Coordinate(12,2);

  const mySnd = new Coordinate(10,1);

  renderHints.set(fst.toString(), '1');
  renderHints.set(snd.toString(), '2');
  renderHints.set(thrd.toString(), '3');

  renderHints.set(mySnd.toString(), 'E');
  renderHints.set(mySnd.toString(), 'E');

  console.log(print(result.pivotMap, dimensions, renderHints));

  const destroyOrder = shootOrder(bigExample, bigExamplePivot);
  expect(get200thMagicNumber(destroyOrder)).toEqual(802);
});

it('day 10 task 1', () => {
  const result = maxVisibleAsteroidsFor(loadAsteroidMap());
  console.log(result.map);
  expect(result.visible).toBe(299);
  expect(result.pivot).toEqual({ 'x': 26, 'y': 29 });
});

const calcAngleDegrees = (x: number, y: number) => {
  const number = Math.atan2(y, x) * 180 / Math.PI;
  if (number < 0) {
    return 360 + number;
  }

  return number;
};

it('should ', () => {
  expect(calcAngleDegrees(3, 1)).toBe(18.43494882292201);

  expect(calcAngleDegrees(1, 0)).toBe(0);
  expect(calcAngleDegrees(1, 1)).toBe(45);
  expect(calcAngleDegrees(0, 1)).toBe(90);
  expect(calcAngleDegrees(-1, 1)).toBe(135);
  expect(calcAngleDegrees(-1, 0)).toBe(180);

  expect(calcAngleDegrees(-1, -1)).toBe(225);
  expect(calcAngleDegrees(0, -1)).toBe(270);
  expect(calcAngleDegrees(1, -1)).toBe(315);
});

interface Details {
  coordinate: Coordinate;
  distance: number;
}

function shootOrder(map: string, pivot: Coordinate) {
  const { coordinatesForAsteroids } = mapWithCoordinatesFrom(map);
  coordinatesForAsteroids.delete(pivot.toString());
  const angleMap = new Map<number, Details[]>();

  const angles = new Set<number>();
  const asteroids = Array.from(coordinatesForAsteroids.values());
  asteroids.forEach(asteroid => {
    const x = asteroid.x - pivot.x;
    const y = pivot.y - asteroid.y; //adjust for the y axis growing into the wrong direction
    let degrees = calcAngleDegrees(x, y); // to adjust that we start at the top
    angles.add(degrees);
    const distance = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    const coordinatesAtSameAngle = getOrInsert(angleMap, degrees, () => []);
    coordinatesAtSameAngle.push({ coordinate: asteroid, distance });
  });
  const uniqueAngles = Array.from(angles.values());
  uniqueAngles.sort((s1, s2) => {
    if (s1 < s2) {
      return -1;
    }
    if (s1 > s2) {
      return 1;
    }
    return 0;
  });
  uniqueAngles.reverse(); // this is because we go clockwise and the angles growing counter clock wise.
  const number = uniqueAngles.indexOf(90);
  const end = uniqueAngles.slice(0, number);
  const start = uniqueAngles.slice(number, uniqueAngles.length);
  const processOrder = [...start, ...end];

  return processOrder.map(angle => angleMap.get(angle)!);
}

function get200thMagicNumber(destroyOrder: Details[][]) {
  const asteroid200ToBeDestroyed = destroyOrder[199][0].coordinate;
  return asteroid200ToBeDestroyed.x * 100 + asteroid200ToBeDestroyed.y;
}

it('day 10 task 2', () => {
  const destroyOrder = shootOrder(loadAsteroidMap(), new Coordinate(26, 29));
  expect(get200thMagicNumber(destroyOrder)).toBe(1419);
});
