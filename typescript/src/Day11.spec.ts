import { loadIntProgramAt, runProgram } from './IntCodeComputer';

const enum Color {
  Black = 0,
  White = 1,
}

class HullCoordinate {
  constructor(readonly  x: number, readonly y: number) {
  }

  toString() {
    return `x: ${this.x} y: ${this.y}`;
  }
}

enum Orientation {
  Up,
  Right,
  Down,
  Left
}

enum Turn {
  Left = 0,
  Right = 1
}

class PaintingRobot {
  private readonly hullMap = new HullMap();
  location: HullCoordinate = new HullCoordinate(0, 0);
  private allVisitedCoordinates = [this.location];
  orientation: Orientation = Orientation.Up;

  constructor() {
  }

  currentColor() {
    return this.hullMap.colorAt(this.location);
  }

  paint(color: Color) {
    this.hullMap.paint(this.location, color);
  }

  turn(turn: Turn) {
    let newOrientation;
    switch (turn) {
      case Turn.Left:
        switch (this.orientation) {
          case Orientation.Up:
            newOrientation = Orientation.Left;
            break;
          case Orientation.Right:
            newOrientation = Orientation.Up;
            break;
          case Orientation.Down:
            newOrientation = Orientation.Right;
            break;
          case Orientation.Left:
            newOrientation = Orientation.Down;
            break;
        }
        break;
      case Turn.Right:
        switch (this.orientation) {
          case Orientation.Up:
            newOrientation = Orientation.Right;
            break;
          case Orientation.Right:
            newOrientation = Orientation.Down;
            break;
          case Orientation.Down:
            newOrientation = Orientation.Left;
            break;
          case Orientation.Left:
            newOrientation = Orientation.Up;
            break;
        }
        break;
    }
    this.orientation = newOrientation;
  }

  moveOnePanel() {
    let newLocation;
    switch (this.orientation) {
      case Orientation.Up:
        newLocation = new HullCoordinate(this.location.x, this.location.y + 1);
        break;
      case Orientation.Right:
        newLocation = new HullCoordinate(this.location.x + 1, this.location.y);
        break;
      case Orientation.Down:
        newLocation = new HullCoordinate(this.location.x, this.location.y - 1);
        break;
      case Orientation.Left:
        newLocation = new HullCoordinate(this.location.x - 1, this.location.y);
        break;
    }
    this.location = newLocation;
    this.allVisitedCoordinates.push(newLocation);
  }

  numberOfPaintedPanels() {
    return this.hullMap.size();
  }

  drawPicture(): string {
    const initialMinMax: MinMax = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
    const minMax = this.allVisitedCoordinates.reduce((acc, cur) => {
      acc.x.min = Math.min(acc.x.min, cur.x);
      acc.x.max = Math.max(acc.x.max, cur.x);
      acc.y.min = Math.min(acc.y.min, cur.y);
      acc.y.max = Math.max(acc.y.max, cur.y);
      return acc;
    }, initialMinMax);

    const lines = [];
    for (let y = minMax.y.min; y <= minMax.y.max; y++) {
      const line = [];
      for (let x = minMax.x.min; x <= minMax.x.max; x++) {
        const color = this.hullMap.colorAt(new HullCoordinate(x, y));
        const toDraw = color === Color.White? '░': ' ';
        line.push(toDraw);
      }
      lines.push(line.join(''));
    }
    return lines.reverse().join('\n');
  }
}

interface MinMax{
  x: {
    min: number;
    max: number;
  }
  y: {
    min: number;
    max: number;
  }
}

class HullMap {
  private readonly hullMap = new Map<string, Color>();

  colorAt(location: HullCoordinate): Color {
    return this.hullMap.get(location.toString()) ?? Color.Black;
  }

  paint(location: HullCoordinate, color: Color) {
    if (this.hullMap.has(location.toString())) {
      if (this.hullMap.get(location.toString()) !== color) {
        //throw new Error('think about this');
      }
    }
    this.hullMap.set(location.toString(), color);
  }

  size(): number {
    return this.hullMap.size;
  }
}

const paint = (robot: PaintingRobot): void => {
  const program = loadIntProgramAt('Day11');
  const computer = runProgram(program);
  do {
    const color = robot.currentColor();
    computer.addInput([color]);
    computer.execute();
    const output = computer.output();

    if (output.length === 2) {
      computer.clearOutput();
      const colorToPaint = output[0] === 0 ? Color.Black : Color.White;
      const turn = output[1] === 0 ? Turn.Left : Turn.Right;
      robot.paint(colorToPaint);
      robot.turn(turn);
      robot.moveOnePanel();
    } else if (!computer.terminated()) {
      throw new Error('think about this');
    }
  } while (!computer.terminated());
};

it('day 11 task 1 number of painted panels ', () => {
  const robot = new PaintingRobot();
  paint(robot);
  expect(robot.numberOfPaintedPanels()).toEqual(2211);
});

it('day 11 task 2 number of painted panels ', () => {
  const robot = new PaintingRobot();
  robot.paint(Color.White);
  paint(robot);
  expect(robot.numberOfPaintedPanels()).toEqual(249);
  console.log(robot.drawPicture());
});