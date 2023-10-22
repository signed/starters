/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, test } from 'vitest'
import { fireEvent, getByLabelText } from '@testing-library/dom'

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
// https://www.polvara.me/posts/testing-a-custom-select-with-react-testing-library/
describe('select', () => {
  const petSelect = () => getByLabelText(document.body, 'Choose a pet:') as HTMLSelectElement

  beforeEach(() => {
    document.body.innerHTML = `
<label for="pet-select" multiple>Choose a pet:</label>
<select id="pet-select" name="pets" multiple>
    <option value="" disabled selected>Select your option</option>
    <option value="dog">Dog</option>
    <option value="cat">Cat</option>
    <option value="hamster">Hamster</option>
    <option value="parrot">Parrot</option>
    <option value="spider">Spider</option>
    <option value="goldfish">Goldfish</option>
</select>`
  })

  test('check initial selection', () => {
    expect(petSelect().selectedOptions).toHaveLength(1)
    expect(petSelect().selectedOptions[0]?.text).toBe('Select your option')
  })
  test('single select', () => {
    fireEvent.click(petSelect(), { target: { value: 'goldfish' } })
    expect(petSelect().selectedOptions[0]?.text).toBe('Goldfish')
  })
})
