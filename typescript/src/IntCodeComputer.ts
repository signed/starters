type OperationExecutor = (parameterAndOpcode: ParameterAndOpcode, context: MachineContext) => void;

export const enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  INPUT = 3,
  OUTPUT = 4,
  ENDED = 99,
}

// writes will never be in immediate mode
export const enum ParameterMode {
  Position = 0,
  Immediate = 1,
}

const operations = new Map<Opcode, OperationExecutor>();

class Command {
  private readonly codes: number[];

  constructor(private readonly parameterAndOpcode: ParameterAndOpcode, private readonly machineContext: MachineContext, length: number) {
    const start = machineContext.instructionPointer.current;
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
      throw new Error('accessing out of scope')
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
}

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const fst = command.argument(0);
  const snd = command.argument(1);
  command.writeAt(2, fst + snd);
  machineContext.instructionPointer.advance(3);
});
operations.set(Opcode.MULTIPLY, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const fst = command.argument(0);
  const snd = command.argument(1);
  command.writeAt(2, fst * snd);
  machineContext.instructionPointer.advance(3);
});
operations.set(Opcode.INPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 1);
  const input = command.nextInput();
  command.writeAt(0, input);
  machineContext.instructionPointer.advance(1);
  console.log(machineContext.memory);
});
operations.set(Opcode.OUTPUT, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 1);
  const output = command.argument(0);
  command.writeOutput(output);
  machineContext.instructionPointer.advance(1);
});


class InstructionPointer {
  public current = 0;

  advance(range: number) {
    this.current += range;
  }

  reset() {
    this.current = 0;
  }
}

type Program = number [];
type Memory = number [];
type Input = number [];
type Output = number [];

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
    const opcode = parseInt(this.digits.slice(-2).join(''), 10);
    switch (opcode) {
      case 1:
        return Opcode.ADD;
      case 2:
        return Opcode.MULTIPLY;
      case 3:
        return Opcode.INPUT;
      case 4:
        return Opcode.OUTPUT;
      case 99:
        return Opcode.ENDED;
      default:
        throw Error('unknown Opcode ' + opcode);
    }
  }

  parameterMode(number: number) {
    const parameterModeAsString = this.parameterModes[number] ?? '0';
    return parameterModeAsString === '0' ? ParameterMode.Position : ParameterMode.Immediate;
  }
}

export class IntCodeComputer {
  private readonly context = new MachineContext();

  runProgram(program: Program, input: Input = []): number[] {
    this.context.initialize(program, input);

    while (true) {
      const operationCode = this.context.memory[this.context.instructionPointer.current];
      const parameterAndOpcode = new ParameterAndOpcode(operationCode);
      this.context.instructionPointer.advance(1);
      if (Opcode.ENDED === parameterAndOpcode.opcode()) {
        return this.context.memory;
      }
      operations.get(operationCode)!(parameterAndOpcode, this.context);
    }
  };

  output(): Output {
    return [...this.context.output];
  }
}