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


it('day 13 part 1 ', () => {
  const intCodeComputer = runProgram(loadIntProgramAt('Day13'));
  const numbers = intCodeComputer.output();
  const screen = new Map<String, Tile>();
  partition(numbers, 3).map<[Coordinate, Tile]>( group => [new Coordinate(group[0], group[1]), group[2] as Tile])
    .forEach( ([coordinate, tile]) => screen.set(coordinate.toString(), tile));
  const numberOfBlocks = Array.from(screen.values()).reduce((acc, tile) => {
    if (tile === Tile.Block) {
      return acc + 1;
    }
    return acc
  }, 0);

  expect(numberOfBlocks).toEqual(369);
});