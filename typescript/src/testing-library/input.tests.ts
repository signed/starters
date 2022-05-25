// https://testing-library.com/docs/react-testing-library/cheatsheet
import { fireEvent, queries } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

const inputElement = (): HTMLInputElement =>
  queries.getByPlaceholderText(document.body, 'hello-placeholder') as HTMLInputElement

describe('text input', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="initial"/>'
  })

  it('read the initial value', () => {
    expect(inputElement()).toHaveValue('initial')
  })

  it('change the initial value', () => {
    fireEvent.change(inputElement(), { target: { value: 'updated' } })
    expect(inputElement()).toHaveValue('updated')
  })

  it('text is always appended currently there seems to be no way to position the caret or do a selection', async () => {
    inputElement().value = ''
    await userEvent.type(inputElement(), 'one')
    await userEvent.type(inputElement(), 'two')
    expect(inputElement()).toHaveValue('onetwo')
  })
})
