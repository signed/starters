type Callback = () => void
const OneSecond = 1000
export const deeplyNestedAsync = (one: Callback, two: Callback) => {
  setTimeout(() => {
    one()
    setTimeout(() => {
      two()
    }, OneSecond)
  }, OneSecond)
}
