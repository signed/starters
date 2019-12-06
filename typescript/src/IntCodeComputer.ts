type CommandExecutor = (fst: number, snd: number) => number;
const operations: Map<number, CommandExecutor> = new Map<number, CommandExecutor>();
operations.set(1, (fst, snd) => fst + snd);
operations.set(2, (fst, snd) => fst * snd);

type Program = number[];

export class IntCodeComputer {
  constructor() {
  }

  runProgram(numbers: Program): number[] {
    for (let i = 0; ; i++) {
      const instructionPointer = i * 4;
      const end = instructionPointer + 4;
      const command = numbers.slice(instructionPointer, end);
      const operationCode = command[0];
      if (operationCode === 99) {
        return numbers;
      }
      const fstAddress = command[1];
      const sndAddress = command[2];
      const destinationAddress = command[3];
      numbers[destinationAddress] = operations.get(operationCode)!(numbers[fstAddress], numbers[sndAddress]);
    }
  };

}