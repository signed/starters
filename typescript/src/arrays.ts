export const partition = <Element>(array: Element[], size: number): Element[][] => {
  if (size < 1) {
    throw new Error('size has to be positive')
  }
  const result: Element[][] = [];
  for (let i = 0; i < array.length; i = i + size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};