type OperationExecutor = (parameterAndOpcode: ParameterAndOpcode, context: MachineContext) => void;

export const enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  ENDED = 99,
}

// writes will never be in immediate mode
export const enum ParameterMode {
  Position = 0,
  Immediate = 1,
}

const operations = new Map<Opcode, OperationExecutor>();

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (parameterAndOpcode, { instructionPointer, memory }) => {
  const start = instructionPointer.current;
  const end = start + 3;
  const command = memory.slice(start, end);
  const fstAddress = command[0];
  const sndAddress = command[1];
  const destinationAddress = command[2];
  const fst = memory[fstAddress];
  const snd = memory[sndAddress];
  memory[destinationAddress] = fst + snd;
  instructionPointer.advance(3);
});

class Command{
  private readonly codes: number[];
  constructor(private readonly parameterAndOpcode: ParameterAndOpcode, private readonly machineContext: MachineContext, length: number) {
    const start = machineContext.instructionPointer.current;
    const end = start + length;
    this.codes =  machineContext.memory.slice(start, end);
  }

  argument(index: number) {
    const addressOrValue = this.codes[index];
    const mode = this.parameterAndOpcode.parameterMode(index);
    if (ParameterMode.Immediate === mode) {
      return addressOrValue;
    }
    return this.machineContext.memory[addressOrValue];
  }

  writeAt(number: number, value: number) {
    this.machineContext.memory[this.codes[number]] = value;
  }
}
operations.set(Opcode.MULTIPLY, (parameterAndOpcode, machineContext) => {
  const command = new Command(parameterAndOpcode, machineContext, 3);
  const fst = command.argument(0);
  const snd = command.argument(1);
  command.writeAt(2, fst * snd);
  machineContext.instructionPointer.advance(3);
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

  initialize(program: Program) {
    this.input = [];
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

  runProgram(program: Program): number[] {
    this.context.initialize(program);

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
}