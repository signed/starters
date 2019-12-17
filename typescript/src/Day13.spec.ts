import { partition } from './arrays';
import { loadIntProgramAt, runProgram } from './IntCodeComputer';

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

enum Tile {
  Empty = 0,
  Wall = 1,
  Block = 2,
  HorizontalPaddle = 3,
  Ball = 4,
}

type Banana = [Coordinate, Tile];

class Screen {
  readonly pixels = new Map<String, Tile>();

  display(banana: Banana) {
    const [coordinate, tile] = banana;
    this.pixels.set(coordinate.toString(), tile);
  }

  numberOfBlocks() {
    return Array.from(this.pixels.values()).reduce((acc, tile) => {
      if (tile === Tile.Block) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }
}

const loadBreakout = () => runProgram(loadIntProgramAt('Day13'));

it('day 13 part 1 ', () => {
  const intCodeComputer = loadBreakout();
  const screen = new Screen();
  const numbers = intCodeComputer.output();
  partition(numbers, 3).map<Banana>(group => [new Coordinate(group[0], group[1]), group[2] as Tile])
    .forEach(it => screen.display(it));

  expect(screen.numberOfBlocks()).toEqual(369);
});