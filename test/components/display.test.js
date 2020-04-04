const Display = require('../../src/components/display')

describe('Drawing a simple line (byte) on the screen', () => {
  const display = new Display()
  const bytesToDraw = 0b01101101
  let pixelsErased = false

  test('first write', () => {
    pixelsErased = display.drawByte(0, 0, bytesToDraw)
    expect(display.pixels[0].slice(0, 8)).toEqual([0, 1, 1, 0, 1, 1, 0, 1])
    expect(pixelsErased).toBe(false)
  })

  test('second write erases everything', () => {
    pixelsErased = display.drawByte(0, 0, bytesToDraw)
    expect(display.pixels[0].slice(0, 8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
    expect(pixelsErased).toBe(true)
  })
})

describe('Sprite rendering snapshot', () => {
  const display = new Display()

  const two = [0xf0, 0x10, 0xf0, 0x80, 0xf0]
  const one = [0x20, 0x60, 0x20, 0x20, 0x70]
  const three = [0xf0, 0x10, 0xf0, 0x10, 0xf0]

  display.drawBytes(0, 0, one)
  display.drawBytes(6, 0, two)
  display.drawBytes(6, 7, three)

  test('rendered display matches snapshot 📸', () => expect(display.render()).toMatchSnapshot())
})
