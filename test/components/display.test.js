const Display = require('../../src/display')

test('display instantiation', () => expect(new Display().snapshot()).toMatchSnapshot())

describe('drawing a simple line (byte) on the screen', () => {
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
