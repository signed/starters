type OperationExecutor = (instructionPointer: InstructionPointer, memory: Memory) => number;


enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  ENDED = 99,
}

const operations = new Map<Opcode, OperationExecutor>();

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (instructionPointer, memory) => {
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
operations.set(Opcode.MULTIPLY, (instructionPointer, memory) => {
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
}

type Program = number [];
type Memory = number [];

export class IntCodeComputer {
  runProgram(program: Program): number[] {
    // load program into memory
    const memory: Memory = [...program];
    const instructionPointer = new InstructionPointer();
    while (true) {
      const operationCode = memory[instructionPointer.current];
      instructionPointer.advance(1);
      if (Opcode.ENDED === operationCode) {
        return memory;
      }
      operations.get(operationCode)!(instructionPointer, memory);
    }
  };
}