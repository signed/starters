import { readFileSync } from 'fs';

type OperationExecutor = (parameterAndOpcode: ParameterAndOpcode, context: MachineContext) => void;

export const loadIntProgramAt = (day: string) => {
  const input = readFileSync(__dirname + '/' + day + '.input.csv', 'utf8');
  return input.split(',').map(character => parseInt(character, 10));
};

export const enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  INPUT = 3,
  OUTPUT = 4,
  JUMP_IF_TRUE = 5,
  JUMP_IF_FALSE = 6,
  LESS_THEN = 7,
  EQUALS = 8,
  ADJUSTS_THE_RELATIVE_BASE = 9,
  ENDED = 99,
}

function opcodeFor(number: number) {
  switch (number) {
    case 1:
      return Opcode.ADD;
    case 2:
      return Opcode.MULTIPLY;
    case 3:
      return Opcode.INPUT;
    case 4:
      return Opcode.OUTPUT;
    case 5:
      return Opcode.JUMP_IF_TRUE;
    case 6:
      return Opcode.JUMP_IF_FALSE;
    case 7:
      return Opcode.LESS_THEN;
    case 8:
      return Opcode.EQUALS;
    case 9:
      return Opcode.ADJUSTS_THE_RELATIVE_BASE;
    case 99:
      return Opcode.ENDED;
    default:
      throw Error('unknown Opcode ' + number);
  }
}

// writes will never be in immediate mode
export const enum ParameterMode {
  Position = 0,
  Immediate = 1,
  Relative = 2,
}

const operations = new Map<Opcode, OperationExecutor>();

const adjustForOpcode = (index: number) => index - 1;

class Command {
  private readonly codes: number[];

  constructor(
    private readonly parameterAndOpcode: ParameterAndOpcode,
    private readonly machineContext: MachineContext,
    private readonly length: number
  ) {
    const start = machineContext.instructionPointer.current;
    const end = start + this.length;
    this.codes = machineContext.memory.slice(start, end);
  }

  argument(index: number) {
    let addressOrValueOrOffset = this.codes[index];
    const mode = this.parameterAndOpcode.parameterMode(adjustForOpcode(index));
    if (ParameterMode.Immediate === mode) {
      return addressOrValueOrOffset;
    }
    if (ParameterMode.Relative === mode) {
      addressOrValueOrOffset =  this.machineContext.relativeBase + addressOrValueOrOffset;
    }

    const memoryElement = this.machineContext.memory[addressOrValueOrOffset];
    if (isNaN(memoryElement)) {
      return 0;
    }
    return memoryElement;
  }

  writeAt(index: number, value: number) {
    if (index >= this.codes.length) {
      throw new Error('accessing out of scope');
    }
    let memoryAddress = this.codes[index];
    if (ParameterMode.Relative === this.parameterAndOpcode.parameterMode(adjustForOpcode(index))) {
      memoryAddress = memoryAddress + this.machineContext.relativeBase
    }
    this.machineContext.memory[memoryAddress] = value;
  }

  hasInput(): boolean {
    return this.machineContext.input.length > 0;
  }

  nextInput(): number {
    const shift = this.machineContext.input.shift();
    if (shift === undefined) {
      throw new Error('no more input left');
    }
    return shift;
  }

  writeOutput(output: number) {
    this.machineContext.emitOutput(output);
  }

  jumpTo(index: number) {
    this.machineContext.instructionPointer.jumpTo(index);
  }

  completed() {
    this.machineContext.instructionPointer.advance(this.length);
  }
}

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 4);
  const fst = command.argument(1);
  const snd = command.argument(2);
  command.writeAt(3, fst + snd);
  command.completed();
});
operations.set(Opcode.MULTIPLY, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 4);
  const fst = command.argument(1);
  const snd = command.argument(2);
  command.writeAt(3, fst * snd);
  command.completed();
});
operations.set(Opcode.INPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 2);
  if (!command.hasInput()) {
    machineContext.waitForInput();
    return;
  }
  const input = command.nextInput();
  command.writeAt(1, input);
  command.completed();
});
operations.set(Opcode.OUTPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 2);
  const output = command.argument(1);
  command.writeOutput(output);
  command.completed();
});
operations.set(Opcode.JUMP_IF_TRUE, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const argument = command.argument(1);
  if (argument !== 0) {
    command.jumpTo(command.argument(2));
  } else {
    command.completed();
  }
});
operations.set(Opcode.JUMP_IF_FALSE, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const argument = command.argument(1);
  if (argument === 0) {
    command.jumpTo(command.argument(2));
  } else {
    command.completed();
  }
});
operations.set(Opcode.LESS_THEN, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 4);
  const first = command.argument(1);
  const second = command.argument(2);
  const valueToWrite = first < second ? 1 : 0;
  command.writeAt(3, valueToWrite);
  command.completed();
});
operations.set(Opcode.EQUALS, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 4);
  const first = command.argument(1);
  const second = command.argument(2);
  const valueToWrite = first === second ? 1 : 0;
  command.writeAt(3, valueToWrite);
  command.completed();
});
operations.set(Opcode.ADJUSTS_THE_RELATIVE_BASE, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 2);
  const first = command.argument(1);
  machineContext.relativeBase = machineContext.relativeBase + first;
  command.completed();
});
operations.set(Opcode.ENDED, (parameterAndOpcode, machineContext) => {
  machineContext.endProgram();
});

class InstructionPointer {
  public current = 0;

  advance(range: number) {
    this.current += range;
  }

  reset() {
    this.current = 0;
  }

  jumpTo(pointer: number) {
    this.current = pointer;
  }
}

type Memory = number [];
export type Program = number [];
export type Input = number [];
export type Output = number [];

class MachineContext {
  input: Input = [];
  output: Output = [];
  instructionPointer = new InstructionPointer();
  relativeBase: number = 0;
  memory: Memory = [];
  waitingForInput = false;
  programEnded = false;
  outputListener: OutputListener = () => {
  };

  initialize(program: Program) {
    this.input = [];
    this.output = [];
    this.instructionPointer.reset();
    this.relativeBase = 0;
    this.memory = [...program];
  }

  waitForInput() {
    this.waitingForInput = true;
  }

  endProgram() {
    this.programEnded = true;
  }

  emitOutput(number: number) {
    this.output.push(number);
    this.outputListener(number);
  }

  canExecute() {
    return !this.programEnded && !this.waitingForInput;
  }

  handleInput(input: Input) {
    if (input.length > 0) {
      this.waitingForInput = false;
    }
    this.input.push(...input);
  }
}

export class ParameterAndOpcode {
  private readonly digits: string[];
  private readonly parameterModes: string[];

  constructor(private readonly raw: number) {
    this.digits = this.raw.toString(10).split('');
    this.parameterModes = this.digits.slice(0, -2).reverse();
  }

  opcode(): Opcode {
    return opcodeFor(parseInt(this.digits.slice(-2).join(''), 10));
  }

  parameterMode(number: number) {
    const parameterModeAsString = this.parameterModes[number] ?? '0';
    if ('0' === parameterModeAsString) {
      return ParameterMode.Position;
    }
    if ('1' === parameterModeAsString) {
      return ParameterMode.Immediate
    }
    if ('2' === parameterModeAsString) {
      return ParameterMode.Relative;
    }
    throw new Error(`unsupported parameter mode ${parameterModeAsString}`);
  }
}

export const runProgram = (program: Program, input: Input = []): IntCodeComputer => {
  const computer = new IntCodeComputer();
  computer.load(program);
  computer.addInput(input);
  computer.execute();
  return computer;
};

export type OutputListener = (number: number) => void

export class IntCodeComputer {
  private readonly context = new MachineContext();

  execute() {
    while (this.context.canExecute()) {
      const operationCode = this.context.memory[this.context.instructionPointer.current];
      const parameterAndOpcode = new ParameterAndOpcode(operationCode);
      operations.get(parameterAndOpcode.opcode())!(parameterAndOpcode, this.context);
    }
  }

  waitingForInput(): boolean {
    return this.context.waitingForInput;
  }

  terminated() {
    return this.context.programEnded;
  }

  load(program: Program) {
    this.context.initialize(program);
    return this;
  }

  addInput(input: Input) {
    this.context.handleInput(input);
    return this;
  }

  memory(): Memory {
    return [...this.context.memory];
  }

  output(): Output {
    return [...this.context.output];
  }

  onOutput(listener: OutputListener) {
    this.context.outputListener = listener;
  }

  relativeBase() {
    return this.context.relativeBase;
  }
}