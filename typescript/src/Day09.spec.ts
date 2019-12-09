import { loadIntProgramAt, runProgram } from './IntCodeComputer';

it('day 9 task 1', () => {
  const program = loadIntProgramAt('Day09');
  const computer = runProgram(program, [1]);
  expect(computer.output()).toEqual([4234906522]);
});

it('sample that returns it self ', () => {
  const computer = runProgram([109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99], []);
  expect(computer.output()).toEqual([109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99]);
});

it('output 16 digit number ', () => {
  const computer = runProgram([1102, 34915192, 34915192, 7, 4, 7, 99, 0], []);
  expect(computer.output()).toEqual([1219070632396864]);
});

it('output the large number in the middle ', () => {
  const computer = runProgram([104, 1125899906842624, 99]);
  expect(computer.output()).toEqual([1125899906842624]);
});

it('only the new op code ', () => {
  const computer = runProgram([109, 1, 99], []);
  expect(computer.relativeBase()).toEqual(1);
});

it('only the new op code ', () => {
  const computer = runProgram([109, 27, 99], []);
  expect(computer.relativeBase()).toEqual(27);
});
