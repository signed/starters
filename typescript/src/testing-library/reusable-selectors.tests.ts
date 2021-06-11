import { beforeEach, expect, it } from '@jest/globals'
// https://github.com/domasx2/testing-library-selector
import '@testing-library/jest-dom/extend-expect'
import { byPlaceholderText } from 'testing-library-selector'

const inputElement = byPlaceholderText('hello-placeholder')

beforeEach(() => {
  document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="initial"/>'
})

it('read the initial value', () => {
  expect(inputElement.get()).toHaveValue('initial')
})

it('read the initial value', async () => {
  expect(await inputElement.find()).toHaveValue('initial')
})