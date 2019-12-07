import { IntCodeComputer, Opcode, ParameterAndOpcode, ParameterMode } from './IntCodeComputer';

const opcodeFor = (input: number) => new ParameterAndOpcode(input).opcode();

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

describe('new opcode', () => {
  it('should ', () => {
    const computer = new IntCodeComputer();
    computer.runProgram([3, 0, 4, 0, 99], [27]);
    expect(computer.output()).toEqual([27]);
  });
});