// http://homepage.math.uiowa.edu/~goodman/22m150.dir/2007/Permutation%20Generation%20Methods.pdf
import { IntCodeComputer, loadIntProgramAt, Program, runProgram } from './IntCodeComputer';

const permute = (input: number []): number[][] => {
  const length = input.length;
  const result = [input.slice()];
  const c = new Array(length).fill(0);
  let i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = input[i];
      input[i] = input[k];
      input[k] = p;
      ++c[i];
      i = 1;
      result.push(input.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
};


let masterProgram: number[];
beforeAll(() => {
  masterProgram = loadIntProgramAt('Day07');
});

const runThrusterConfiguration = (program: Program, thrusterConfiguration: number[]): number => {
  return thrusterConfiguration.reduce((outputFromPreviousThruster, thrusterInput) => {
    const thrusterOne = runProgram(program, [thrusterInput, outputFromPreviousThruster]);
    return thrusterOne.output()[0];
  }, 0);
};

it('sample for task one max thruster output one', () => {
  const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];
  expect(runThrusterConfiguration(program, [4, 3, 2, 1, 0])).toBe(43210);
});
it('sample for task one max thruster output two', () => {
  const program = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0];
  expect(runThrusterConfiguration(program, [0, 1, 2, 3, 4])).toBe(54321);
});
it('sample for task one max thruster output three', () => {
  const program = [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0];
  expect(runThrusterConfiguration(program, [1, 0, 4, 3, 2])).toBe(65210);
});

it('amplifier benchmark ', () => {
  const results = permute([0, 1, 2, 3, 4]).map(conf => ({ conf, output: runThrusterConfiguration(masterProgram, conf) }));
  results.sort((a, b) => {
    if (a.output < b.output) {
      return -1;
    }
    if (a.output > b.output) {
      return 1;
    }
    return 0;
  });
  const result = results[results.length - 1];
  expect(result.conf).toEqual([3, 4, 2, 1, 0]);
  expect(result.output).toEqual(929800);
});

const amplifierWithFeedbackLoop = (program: Program, thrusterConfiguration: number[]): number => {
  const ampA = new IntCodeComputer().load(program).addInput([thrusterConfiguration[0], 0]);
  const ampB = new IntCodeComputer().load(program).addInput([thrusterConfiguration[1]]);
  const ampC = new IntCodeComputer().load(program).addInput([thrusterConfiguration[2]]);
  const ampD = new IntCodeComputer().load(program).addInput([thrusterConfiguration[3]]);
  const ampE = new IntCodeComputer().load(program).addInput([thrusterConfiguration[4]]);

  ampA.onOutput(output => ampB.addInput([output]));
  ampB.onOutput(output => ampC.addInput([output]));
  ampC.onOutput(output => ampD.addInput([output]));
  ampD.onOutput(output => ampE.addInput([output]));
  ampE.onOutput(output => ampA.addInput([output]));
  const amplifiers: IntCodeComputer [] = [ampA, ampB, ampC, ampD, ampE];

  function allTerminated() {
    return amplifiers.reduce((acc: boolean, cur) => acc && cur.terminated(), true);
  }
  function allWaitingForInput() {
    return amplifiers.reduce((acc: boolean, cur) => acc && cur.waitingForInput(), true);
  }

  while (!allTerminated()) {
    if (allWaitingForInput()) {
      throw new Error('deadlock');
    }
    ampA.execute();
    ampB.execute();
    ampC.execute();
    ampD.execute();
    ampE.execute();
  }
  return ampE.output().pop()!;
};

it('amplifier benchmark with feedback loop', () => {
  const results = permute([5, 6, 7, 8, 9]).map(conf => {
    return { conf, output: amplifierWithFeedbackLoop(masterProgram, conf) };
  });
  results.sort((a, b) => {
    if (a.output < b.output) {
      return -1;
    }
    if (a.output > b.output) {
      return 1;
    }
    return 0;
  });
  const result = results[results.length - 1];
  expect(result.conf).toEqual([7, 6, 8, 9, 5]);
  expect(result.output).toEqual(15432220);
});

it('sample one ', () => {
  const program = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
  expect(amplifierWithFeedbackLoop(program, [9, 8, 7, 6, 5])).toBe(139629729);
});

