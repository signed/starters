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
}

const operations = new Map<Opcode, OperationExecutor>();

class Command {
  private readonly codes: number[];
  private readonly length: number;

  constructor(
    private readonly parameterAndOpcode: ParameterAndOpcode,
    private readonly machineContext: MachineContext,
    length:number
  ) {
    this.length = length;
    const start = machineContext.instructionPointer.current+1;
    const end = start + length;
    this.codes = machineContext.memory.slice(start, end);
  }

  argument(index: number) {
    const addressOrValue = this.codes[index];
    const mode = this.parameterAndOpcode.parameterMode(index);
    if (ParameterMode.Immediate === mode) {
      return addressOrValue;
    }
    return this.machineContext.memory[addressOrValue];
  }

  writeAt(index: number, value: number) {
    if (index >= this.codes.length) {
      throw new Error('accessing out of scope');
    }
    const memoryAddress = this.codes[index];
    this.machineContext.memory[memoryAddress] = value;
  }

  nextInput(): number {
    const shift = this.machineContext.input.shift();
    if (shift === undefined) {
      throw new Error('no more input left');
    }
    return shift;
  }

  writeOutput(output: number) {
    this.machineContext.output.push(output);
  }

  jumpTo(index: number) {
    this.machineContext.instructionPointer.jumpTo(index);
  }

  completed() {
    this.machineContext.instructionPointer.advance(this.length+1);
  }
}

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const fst = command.argument(0);
  const snd = command.argument(1);
  command.writeAt(2, fst + snd);
  command.completed();
});
operations.set(Opcode.MULTIPLY, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const fst = command.argument(0);
  const snd = command.argument(1);
  command.writeAt(2, fst * snd);
  command.completed();
});
operations.set(Opcode.INPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 1);
  const input = command.nextInput();
  command.writeAt(0, input);
  command.completed();
});
operations.set(Opcode.OUTPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 1);
  const output = command.argument(0);
  command.writeOutput(output);
  command.completed();
});
operations.set(Opcode.JUMP_IF_TRUE, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 2);
  const argument = command.argument(0);
  if (argument !== 0) {
    command.jumpTo(command.argument(1));
  } else {
    command.completed();
  }
});
operations.set(Opcode.JUMP_IF_FALSE, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 2);
  const argument = command.argument(0);
  if (argument === 0) {
    command.jumpTo(command.argument(1));
  } else {
    command.completed();
  }
});
operations.set(Opcode.LESS_THEN, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const first = command.argument(0);
  const second = command.argument(1);
  const valueToWrite = first < second ? 1 : 0;
  command.writeAt(2, valueToWrite);
  command.completed();
});
operations.set(Opcode.EQUALS, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const first = command.argument(0);
  const second = command.argument(1);
  const valueToWrite = first === second ? 1 : 0;
  command.writeAt(2, valueToWrite);
  command.completed();
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
  memory: Memory = [];

  initialize(program: Program, input: Input) {
    this.input = [...input];
    this.output = [];
    this.instructionPointer.reset();
    this.memory = [...program];
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
    return parameterModeAsString === '0' ? ParameterMode.Position : ParameterMode.Immediate;
  }
}

export class IntCodeComputer {
  private readonly context = new MachineContext();

  runProgram(program: Program, input: Input = []):void{
    this.context.initialize(program, input);

    while (true) {
      const operationCode = this.context.memory[this.context.instructionPointer.current];
      const parameterAndOpcode = new ParameterAndOpcode(operationCode);
      if (Opcode.ENDED === parameterAndOpcode.opcode()) {
        return;
      }
      operations.get(parameterAndOpcode.opcode())!(parameterAndOpcode, this.context);
    }
  };

  memory(): Memory {
    return [...this.context.memory];
  }

  output(): Output {
    return [...this.context.output];
  }
}