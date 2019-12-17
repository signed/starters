import { partition } from './arrays';
import { IntCodeComputer, loadIntProgramAt, runProgram } from './IntCodeComputer';

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

function tileToString(tile: Tile | undefined) {
  if (tile === undefined) {
    return 'v';
  }
  switch (tile) {
    case Tile.Ball:
      return 'o';
    case Tile.HorizontalPaddle:
      return '_';
    case Tile.Block:
      return '#';
    case Tile.Empty:
      return ' ';
    case Tile.Wall:
      return '■';
  }
  throw new Error();
}

class Screen {

  private bottomRight = new Coordinate(0, 0);
  readonly pixels = new Map<String, Tile>();
  score = 0;

  display(banana: Banana) {
    const [coordinate, tile] = banana;
    this.pixels.set(coordinate.toString(), tile);
    const newBottomX = Math.max(this.bottomRight.x, coordinate.x);
    const newBottomY = Math.max(this.bottomRight.y, coordinate.y);
    this.bottomRight = new Coordinate(newBottomX, newBottomY);
  }

  numberOfBlocks() {
    return Array.from(this.pixels.values()).reduce((acc, tile) => {
      if (tile === Tile.Block) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  toString(): string {
    const lines: string[] = [];
    for (let y = 0; y <= this.bottomRight.y; y++) {
      const line: string[] = [];
      for (let x = 0; x <= this.bottomRight.x; x++) {
        const tile = this.pixels.get(new Coordinate(x, y).toString());
        line.push(tileToString(tile));
      }
      lines.push(line.join(''));
    }
    return lines.join('\n');
  }
}

const loadBreakout = () => loadIntProgramAt('Day13');

const buildBanana = (group: number[]): Banana => [new Coordinate(group[0], group[1]), group[2] as Tile];

it('day 13 part 1 ', () => {
  const intCodeComputer = runProgram(loadBreakout());
  const screen = new Screen();
  const numbers = intCodeComputer.output();
  partition(numbers, 3).map<Banana>(group => buildBanana(group))
    .forEach(it => screen.display(it));

  expect(screen.numberOfBlocks()).toEqual(369);
  console.log(screen.toString());
});

enum JoystickPosition {
  Neutral = 0,
  Left = -1,
  Right = 1,
}

it('day 13 part 2', () => {
  const screen = new Screen();
  const program = loadBreakout();
  program[0] = 2; // fake coin insert
  const output: number [] = [];
  const intCodeComputer = new IntCodeComputer();

  let positionBall: Coordinate | undefined = undefined;
  let positionPaddle: Coordinate | undefined = undefined;
  let started = false;

  intCodeComputer.load(program);
  intCodeComputer.onOutput((out) => {
    output.push(out);
    if (output.length !== 3) {
      return;
    }
    const banana = buildBanana(output);
    screen.display(banana);
    output.length = 0;

    console.log(screen.toString());

    const [coordinate, tile] = banana;
    if (coordinate.x === -1) {
      console.log('score: ' + tile);
      started = true;
      screen.score = tile;
    }

    if (tile === Tile.Ball) {
      positionBall = coordinate;
    }
    if (tile === Tile.HorizontalPaddle) {
      positionPaddle = coordinate;
    }
    if (positionBall === undefined || positionPaddle === undefined || !started) {
      return;
    }
    const paddleX = positionPaddle.x;
    const ballX = positionBall.x;
    if (paddleX === ballX) {
      console.log('_');
      intCodeComputer.addInput([JoystickPosition.Neutral]);
    } else if (paddleX < ballX) {
      console.log('>');
      intCodeComputer.addInput([JoystickPosition.Right]);
    } else if (paddleX > ballX) {
      console.log('<');
      intCodeComputer.addInput([JoystickPosition.Left]);
    }
  });

  while (!intCodeComputer.terminated()) {
    intCodeComputer.execute();
  }

  expect(screen.score).toBe(34);
});