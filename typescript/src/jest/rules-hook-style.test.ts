import { describe } from '@jest/globals';

interface Context {
  identifier: string
  counter: number;
}

let globalCounter = 0;
const noop = () => {
  //do nothing
}

type TearDown = () => void
type Setup = () => TearDown | void

const rule = (setup:  Setup ) => {
  let tearDown: TearDown;

  beforeEach(() => {
    const up = setup();
    tearDown = up || noop
  });

  afterEach(() => {
    tearDown();
  });
}

const contextRule = (identifier: string) => {
  let context: Context = {
    identifier
  } as Context;
  rule(() => {
    context.counter = globalCounter++;
    //console.log(`setup ${identifier} as ${context.counter}`);
    return () => {
      context.counter = NaN;
      //console.log(`teardown ${identifier} ${context.counter}`);
    }
  })
  return context;
};

describe('top', () => {
  const context1 = contextRule('top');

  describe('one', () => {
    contextRule('one');

    test('1st', () => {
      console.log(`1st ${context1.counter}`);
    });
    test('2nd', () => {
      console.log(`2nd ${context1.counter}`);
    });
  });

  describe('two', () => {
    contextRule('two');
    test('A', () => {
      console.log(`A ${context1.counter}`);
    });
    test('B', () => {
      console.log(`B ${context1.counter}`);
    });
  });
});