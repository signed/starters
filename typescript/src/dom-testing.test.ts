// https://testing-library.com/docs/react-testing-library/cheatsheet
import { fireEvent, queries } from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const inputElement = (): HTMLInputElement => (queries.getByPlaceholderText(document.body, 'hello-placeholder') as HTMLInputElement);

describe('text input', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="initial"/>';
  });

  it('read the initial value', () => {
    expect(inputElement()).toHaveValue('initial');
  });

  it('change the initial value', () => {
    fireEvent.change(inputElement(), { target: { value: 'updated' } });
    expect(inputElement()).toHaveValue('updated');
  });

  it('replaces instead of continue writing at the end', () => {
    inputElement().addEventListener('keydown', (event: KeyboardEvent) => {
      console.log(event.key);
    });
    userEvent.type(inputElement(), 'one');
    userEvent.type(inputElement(), 'two');
    expect(inputElement()).toHaveValue('two');
  });
});
