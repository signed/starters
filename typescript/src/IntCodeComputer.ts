type CommandExecutor = (fst: number, snd: number, instructionPointer:InstructionPointer, memory:Memory) => number;


enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  ENDED = 99,
}

const operations: Map<Opcode, CommandExecutor> = new Map<number, CommandExecutor>();

// 1 reg1 reg2 dest-reg
operations.set(Opcode.ADD, (fst, snd, instructionPointer, memory) => {
  instructionPointer.advance(4);
  return fst + snd;
});
operations.set(Opcode.MULTIPLY, (fst, snd, instructionPointer, memory) => {
  instructionPointer.advance(4);
  return fst * snd;
});

class InstructionPointer {
  public current = 0;

  advance(range: number) {
    this.current += range;
  }
}

type Program = number[];
type Memory = number [];

export class IntCodeComputer {
  runProgram(program: Program): number[] {
    // load program into memory
    const memory: Memory = [...program];
    const instructionPointer = new InstructionPointer();
    while (true) {
      const operationCode = memory[instructionPointer.current];
      if (Opcode.ENDED === operationCode) {
        return memory;
      }

      const start = instructionPointer.current;
      const end = start + 4;
      const command = memory.slice(start, end);
      const fstAddress = command[1];
      const sndAddress = command[2];
      const destinationAddress = command[3];
      memory[destinationAddress] = operations.get(operationCode)!(memory[fstAddress], memory[sndAddress], instructionPointer, memory);
    }
  };

}