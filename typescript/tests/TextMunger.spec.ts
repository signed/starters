// http://rubyquiz.com/quiz76.html
/*
Your task for this quiz, then, is to take a text as input and output the text in this fashion.
Scramble each word's center (leaving the first and last letters of each word intact).
Whitespace, punctuation, numbers -- anything that isn't a word -- should also remain unchanged.
TDD it :)
 */

/*
Drivers for changing the production code
- failing tests
- duplication
- refactoring
 */

/*
https://stanislaw.github.io/2016/01/25/notes-on-test-driven-development-by-example-by-kent-beck.html
strategies to get a test green as quick as possible
1. Fake it
1. Obvious implementation
1.
 */

/*
The cycle http://www.growing-object-oriented-software.com/figures.html
 */

/*
Refactoring techniques
1. Parallel Change
 */

function reverse(string: string) {
  return string.split('').reverse().join('');
}

function munge(text: string) {
  if (text.length < 4) {
    return text;
  }
  let first = text[0];
  let last = text[text.length - 1];
  let center = text.slice(1, text.length - 1);
  let reversedCenter = reverse(center);
  return first + reversedCenter + last
}

describe('text munger', () => {
  it('should not change the empty string', () => {
    expect(munge('')).toBe('');
  });
  it('should not change words that have only two letters', () => {
    expect(munge('it')).toBe('it');
  });
  it('should flip center of a four letter word', () => {
    expect(munge('abcd')).toBe('acbd')
  });
});