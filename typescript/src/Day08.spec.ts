//25x6

import { readFileSync } from 'fs';

export const loadImageData = () => {
  return readFileSync(__dirname + '/Day08.input.csv', 'utf8');
};


const chunks = (input: number [], chunkSize: number): number[][] => {
  const result = [];
  for (let index = 0; index < input.length; index += chunkSize) {
    result.push(input.slice(index, index + chunkSize));
  }
  return result;
};

interface DigitCount {
  zero: number;
  one: number;
  two: number;
}

function imageChecksum(st: string, imageWidth: number, imageHeight: number) {
  const s = st.split('').map(it => parseInt(it, 10));
  const layers = chunks(s, imageWidth * imageHeight);
  const counted: DigitCount[] = layers.map(layer => layer.reduce((acc, cur) => {
    const zero = (cur === 0) ? acc.zero + 1 : acc.zero;
    const one = (cur === 1) ? acc.one + 1 : acc.one;
    const two = (cur === 2) ? acc.two + 1 : acc.two;
    return { zero, one, two };
  }, { zero: 0, one: 0, two: 0 }));

  counted.sort((a, b) => {
    if (a.zero < b.zero) {
      return -1;
    }
    if (a.zero > b.zero) {
      return 1;
    }
    return 0;
  });

  const crcCheckLayer = counted.shift()!;
  return crcCheckLayer.one * crcCheckLayer.two;
}

it('should ', () => {
  expect(imageChecksum(loadImageData(), 25, 6)).toBe(2562);
});

it('sample task 1 ', () => {
  expect(imageChecksum('123456789012', 3, 2)).toBe(1);
});