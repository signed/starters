import { readFileSync } from 'fs';

export const loadAsteroidMap = () => {
  return readFileSync(__dirname + '/Day10.input.csv', 'utf8');
};


class Coordinate {
  constructor(private readonly x: number, private readonly y: number) {
  }

  toString() {
    return `x: ${this.x} y: ${this.y}`;
  }
}

const print = (coordinatesForAsteroids: Map<string, Coordinate>, lengthY: number, lengthX: number) => {
  const lines: string[] = [];
  for (let y = 0; y < lengthY; y++) {
    const line = [];
    for (let x = 0; x < lengthX; x++) {
      const s = new Coordinate(x, y).toString();
      const cell = coordinatesForAsteroids.has(s.toString()) ? '#' : '.';
      line.push(cell);
    }
    lines.push(line.join(''))
  }
  return lines.join('\n');
};

it('load and re-create map  ', () => {
  const coordinatesForAsteroids = new Map<string, Coordinate>();
  const loadedMapAsString = loadAsteroidMap();
  const lines = loadedMapAsString.split('\n');
  lines.forEach((line, y) => line.split('').forEach((element, x) => {
    if (element == '.') {
      return;
    }
    const coordinate = new Coordinate(x, y);
    coordinatesForAsteroids.set(coordinate.toString(), coordinate);
  }));
  expect(print(coordinatesForAsteroids, lines.length, lines[0].length)).toEqual(loadedMapAsString);
});