type OperationExecutor = (context: MachineContext) => number;


enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  ENDED = 99,
}

const operations = new Map<Opcode, OperationExecutor>();

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, ({instructionPointer, memory}) => {
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
  return fst + snd;
});
operations.set(Opcode.MULTIPLY, ({instructionPointer, memory}) => {
  const start = instructionPointer.current;
  const end = start + 3;
  const command = memory.slice(start, end);
  const fstAddress = command[0];
  const sndAddress = command[1];
  const destinationAddress = command[2];
  const fst = memory[fstAddress];
  const snd = memory[sndAddress];
  memory[destinationAddress] = fst * snd;
  instructionPointer.advance(3);
  return fst * snd;
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

class MachineContext{
  input: Input = [];
  output: Output = [];
  instructionPointer = new InstructionPointer();
  memory: Memory = [];

  initialize(program: Program){
    this.input = [];
    this.output = [];
    this.instructionPointer.reset();
    this.memory = [...program];
  }
}

export class IntCodeComputer {
  private readonly context = new MachineContext();

  runProgram(program: Program): number[] {
    this.context.initialize(program);

    while (true) {
      const operationCode = this.context.memory[this.context.instructionPointer.current];
      this.context.instructionPointer.advance(1);
      if (Opcode.ENDED === operationCode) {
        return this.context.memory;
      }
      operations.get(operationCode)!(this.context);
    }
  };
}