import { readFileSync } from 'fs';

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

const print = (coordinatesForAsteroids: Map<string, Coordinate>, dimensons: Dimensions, pivot?: Coordinate) => {
  const lines: string[] = [];
  for (let y = 0; y < dimensons.y; y++) {
    const line = [];
    for (let x = 0; x < dimensons.x; x++) {
      const s = new Coordinate(x, y);
      let cell = coordinatesForAsteroids.has(s.toString()) ? '#' : '.';
      if (pivot && s.isEqual(pivot)) {
        cell = 'o';
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
    return { pivot, visible: pivotMap.size, map: print(pivotMap, dimensons, pivot) };
  };
}

it('should work for the sample', () => {
  const map = `.#..#
.....
#####
....#
...##`;

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
  expect(result.pop()!.visible).toBe(8);
});

interface Dimensions {
  x: number;
  y: number;
}

it('load and re-create map  ', () => {
  const map = loadAsteroidMap();
  const { coordinatesForAsteroids, dimensions } = mapWithCoordinatesFrom(map);
  expect(print(coordinatesForAsteroids, dimensions)).toEqual(map);
});