//import path from 'path';
// const PATH_NODE_MODULES = `${path.sep}node_modules${path.sep}`;
export {}

const thisIsAFunction = function () {
  console.log('wohooo');
};

test('one ', () => {
  thisIsAFunction();
});

test('two ', () => {
  thisIsAFunction();
});

test('three ', () => {
  thisIsAFunction();
});

