import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { fireEvent, queries } from '@testing-library/dom'

const inputElement = (): HTMLInputElement =>
  queries.getByPlaceholderText(document.body, 'hello-placeholder') as HTMLInputElement

describe('key events', () => {
  const listener = jest.fn()

  beforeEach(() => {
    document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="initial"/>'
  })

  test('keydown', () => {
    inputElement().addEventListener('keydown', (e) => listener(e.key))
    fireEvent.keyDown(inputElement(), { key: 'Enter' })
    expect(listener).toHaveBeenCalledWith('Enter')
  })

  test('keyup', () => {
    inputElement().addEventListener('keyup', (e) => listener(e.key))
    fireEvent.keyUp(inputElement(), { key: 'Enter' })
    expect(listener).toHaveBeenCalledWith('Enter')
  })

  test('keypress', () => {
    inputElement().addEventListener('keypress', (e) => listener(e.key))
    fireEvent.keyPress(inputElement(), { key: 'Enter' })
    expect(listener).toHaveBeenCalledWith('Enter')
  })
})
