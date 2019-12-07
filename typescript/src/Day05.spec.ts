import { IntCodeComputer, loadIntProgramAt, Opcode, ParameterAndOpcode, ParameterMode } from './IntCodeComputer';

const opcodeFor = (input: number) => new ParameterAndOpcode(input).opcode();

let masterProgram: number[];
beforeAll(() => {
  masterProgram = loadIntProgramAt('Day05');
});

describe('opcode', () => {
  it('fill up one digit opcode to two digit op code', () => {
    expect(opcodeFor(1)).toBe(Opcode.ADD);
    expect(opcodeFor(2)).toBe(Opcode.MULTIPLY);
    expect(opcodeFor(101)).toBe(Opcode.ADD);
  });
  it('sample from the task description', () => {
    const a = new ParameterAndOpcode(1002);
    expect(a.opcode()).toBe(Opcode.MULTIPLY);
    expect(a.parameterMode(0)).toBe(ParameterMode.Position);
    expect(a.parameterMode(1)).toBe(ParameterMode.Immediate);
    expect(a.parameterMode(2)).toBe(ParameterMode.Position);
  });
});

it('day05 challenge part 1', () => {
  const computer = new IntCodeComputer();
  computer.runProgram(masterProgram, [1]);
  expect(computer.output()).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 9961446]);
});
it('day05 challenge part 2', () => {
  const computer = new IntCodeComputer();
  computer.runProgram(masterProgram, [5]);
  expect(computer.output()).toEqual([742621]);
});

describe('new opcodes', () => {
  it('basic input output program ', () => {
    const computer = new IntCodeComputer();
    computer.runProgram([3, 0, 4, 0, 99], [27]);
    expect(computer.output()).toEqual([27]);
  });
});