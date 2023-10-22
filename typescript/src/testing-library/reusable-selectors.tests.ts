/**
 * @vitest-environment jsdom
 */
import { beforeEach, expect, test } from 'vitest'
import '@testing-library/jest-dom/vitest'
// https://github.com/domasx2/testing-library-selector
import { byPlaceholderText } from 'testing-library-selector'

const inputElement = byPlaceholderText('hello-placeholder')

beforeEach(() => {
  document.body.innerHTML = '<input type="text" placeholder="hello-placeholder" value="initial"/>'
})

test('read the initial value', () => {
  expect(inputElement.get()).toHaveValue('initial')
})

test('read the initial value', async () => {
  expect(await inputElement.find()).toHaveValue('initial')
})
