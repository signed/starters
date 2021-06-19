import fetchMock from 'fetch-mock-jest';

test('should ', async () => {
  fetchMock.get('https://localhost', {});
  try {
    window.fetch('https://localhost/banana');
  } catch (error) {
    //do nothing
  }


  await window.fetch('https://localhost');
});