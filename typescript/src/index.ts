export const hello = (name: string): string => `Hello ${name}`;


export const asyncFunction = async (input: string) => {
  return new Promise<string>((resolve, reject) => {
    resolve(`${input} resolve`);
  });
};