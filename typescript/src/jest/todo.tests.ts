export {}

describe('just want to keep a reminder to write a test', () => {
  test.todo('this feature needs this test')
  test('already implemented test', () => {
    expect(true).toBe(true)
  })
})

type Complex = {
  one: string
  timeLeft: number
}

type Present<T> = {
  present: true
} & T

type Absent = {
  present: false
}

type Box<T> = Present<T> | Absent

const box = (complex?: Complex): Box<Complex> => {
  if (complex === undefined) {
    return { present: false }
  }
  return { present: true, ...complex }
}

type Maybe<T> = void | T

const some = (complex?: Complex) => {
  const present = complex !== undefined
  //const derived = present ? complex.two : 45

  const complexInBox = box(complex)
  const warn = complexInBox.present ? complexInBox.timeLeft <= 3 : false
}
