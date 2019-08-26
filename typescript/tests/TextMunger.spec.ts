// http://rubyquiz.com/quiz76.html
/*
Your task for this quiz, then, is to take a text as input and output the text in this fashion.
Scramble each word's center (leaving the first and last letters of each word intact).
Whitespace, punctuation, numbers -- anything that isn't a word -- should also remain unchanged.
TDD it :)
 */

function munge(_text: string) {
  return '';
}

describe('text munger', () => {
  it('should not change the empty string', () => {
    expect(munge('')).toBe('');
  });
});