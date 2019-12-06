type CommandExecutor = (fst: number, snd: number) => number;

enum Opcode {
  ADD = 1,
  MULTIPLY = 2,
  ENDED = 99,
}

const operations: Map<Opcode, CommandExecutor> = new Map<number, CommandExecutor>();
operations.set(Opcode.ADD, (fst, snd) => fst + snd);
operations.set(Opcode.MULTIPLY, (fst, snd) => fst * snd);

type Program = number[];
type Memory = number [];

export class IntCodeComputer {
  runProgram(program: Program): number[] {
    // load program into memory
    const memory: Memory = [...program];
    for (let address = 0; ; address++) {
      const instructionPointer = address * 4;
      const end = instructionPointer + 4;
      const command = memory.slice(instructionPointer, end);
      const operationCode = command[0];
      if (Opcode.ENDED === operationCode) {
        return memory;
      }
      const fstAddress = command[1];
      const sndAddress = command[2];
      const destinationAddress = command[3];
      memory[destinationAddress] = operations.get(operationCode)!(memory[fstAddress], memory[sndAddress]);
    }
  };

}