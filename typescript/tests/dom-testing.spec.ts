import { fireEvent, queries } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';


// https://testing-library.com/docs/react-testing-library/cheatsheet
document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="catch"/>';

function inputElement() {
  return queries.getByPlaceholderText(document.body, 'hello-placeholder');
}

describe('text input', () => {
  it('read the initial value', () => {
    expect(inputElement()).toHaveValue('catch')
  });

  it('change the initial value', () => {
    fireEvent.change(inputElement(), { target: { value: 'updated' } });
    expect(inputElement()).toHaveValue('updated')
  });
});
