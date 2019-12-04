import { readFileSync } from 'fs';

type CommandExecutor = (fst: number, snd: number) => number;
const operations: Map<number, CommandExecutor> = new Map<number, CommandExecutor>();
operations.set(1, (fst, snd) => fst + snd);
operations.set(2, (fst, snd) => fst * snd);

const runProgram = (numbers: number[]): number[] => {
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

let masterProgram: number[];

beforeAll(()=> {
  const input = readFileSync(__dirname + '/Day02.input.csv', 'utf8');
  masterProgram = input.split(',').map(character => parseInt(character, 10));
});

function calculate(verb: number, noun: number) {
  const program = [...masterProgram];
  program[1] = verb;
  program[noun] = noun;
  const finalState = runProgram(program);
  return finalState[0];
}

test('day 01 challenge', () => {
  expect(calculate(12, 2)).toEqual(6327510);
});

test('should ', () => {
  expect(runProgram([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
  expect(runProgram([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
  expect(runProgram([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
  expect(runProgram([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
});