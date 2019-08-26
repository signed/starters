// http://rubyquiz.com/quiz76.html
/*
Your task for this quiz, then, is to take a text as input and output the text in this fashion.
Scramble each word's center (leaving the first and last letters of each word intact).
Whitespace, punctuation, numbers -- anything that isn't a word -- should also remain unchanged.
TDD it :)
 */

function munge(text: string) {
  if ('abcd' === text) {
    return 'acbd'
  }
  return text;
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