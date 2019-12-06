interface NumberToCheck {
  candidate: number;
  digits: number [];
}

type Check = (toCheck: NumberToCheck) => boolean

const twoAdjacentDigitsAreTheSame: Check = toCheck => {
  let before: number | undefined = undefined;
  for (let i = 0; i < toCheck.digits.length; i++) {
    const current = toCheck.digits[i];
    if (before == current) {
      return true;
    }
    before = current;
  }
  return false;
};

const neverDecreaseLeftToRight: Check = toCheck => {
  for (let i = 1; i < toCheck.digits.length; i++) {
    if (toCheck.digits[i - 1] > toCheck.digits[i]) {
      return false;
    }
  }
  return true;
};

const thereIsAGroupOfMatchingDigitsWithLengthTwo: Check = toCheck => {
  const digits = toCheck.digits;
  return digits.reduce((acc:number[][], cur, index, array) => {
    if (index === 0 || array[index-1] !== cur) {
      acc.push([])
    }
    acc[acc.length - 1].push(cur);
    return acc;
  }, []).map(group => group.length).includes(2);
};

function allMatches(candidate: number, checks: Check[]) {
  const digits = candidate.toString(10).split('').map(d => parseInt(d, 10));
  const toCheck = { candidate, digits };
  return checks.map(check => check(toCheck)).reduce((acc, cur) => acc && cur, true);
}

function countMatching(checks: Check[]): number[] {
  let matches = [];
  for (let candidate = 271973; candidate < 785961; candidate++) {
    const allMatch = allMatches(candidate, checks);
    if (allMatch) {
      matches.push(candidate);
    }
  }
  return matches;
}

test('day 4 challenge ', () => {
  expect(countMatching([twoAdjacentDigitsAreTheSame, neverDecreaseLeftToRight]).length).toBe(925);
});

test('day 4 challenge part two', () => {
  const checks = [thereIsAGroupOfMatchingDigitsWithLengthTwo, neverDecreaseLeftToRight];
  expect(allMatches(112233, checks)).toBe(true);
  expect(allMatches(123444, checks)).toBe(false);
  expect(allMatches(111122, checks)).toBe(true);
  expect(allMatches(277778, checks)).toBe(false);
  expect(countMatching(checks).length).toBe(607);
});