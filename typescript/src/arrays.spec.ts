import { partition } from './arrays';

it('partition splits up an array ', () => {
  expect(() => partition([1,2,3], 0)).toThrow();
  expect(partition([], 5)).toEqual([]);
  expect(partition([1], 5)).toEqual([[1]]);
  expect(partition([1,2,3], 2)).toEqual([[1,2], [3]]);
});