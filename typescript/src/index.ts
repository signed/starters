export const hello = (name: string): string => `Hello ${name}`;


export const asyncFunction = async (input: string) => {
  return new Promise<string>((resolve, reject) => {
    resolve(`${input} resolve`);
  });
};

export const callbackFunction = (callback: (value: string) => void, invoke: boolean = true): void => {
  if (invoke) {
    callback('hello from the callback');
  }
};