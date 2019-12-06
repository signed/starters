import { readFileSync } from 'fs';
import { IntCodeComputer } from './IntCodeComputer';

let masterProgram: number[];

beforeAll(()=> {
  const input = readFileSync(__dirname + '/Day02.input.csv', 'utf8');
  masterProgram = input.split(',').map(character => parseInt(character, 10));
});

const computer = new IntCodeComputer();

function calculate(verb: number, noun: number) {
  const program = [...masterProgram];
  program[1] = verb;
  program[2] = noun;
  const finalState = computer.runProgram(program);
  return finalState[0];
}

test('day 02 challenge', () => {
  expect(calculate(12, 2)).toEqual(6327510);
});

test('day 02 challenge part 2', () => {
  expect(calculate(41, 12)).toEqual(19690720)
});

test.skip('brute force ', () => {
  for (let verb = 0; verb < 100; verb++) {
    console.log('verb ' + verb);
    for (let noun = 0; noun < 100; noun++) {
      const result = calculate(verb, noun);
      if (result === 19690720) {
        console.log(`${verb} ${noun}`);
        return;
      }
    }
  }
});

test('example programs ', () => {
  expect(computer.runProgram([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
  expect(computer.runProgram([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
  expect(computer.runProgram([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
  expect(computer.runProgram([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
});