const DISPLAY_WIDTH = 64
const DISPLAY_HEIGHT = 32

module.exports = class Screen {
  constructor ({ debug } = {}) {
    this.debug = typeof debug !== 'undefined' && debug
    this.reset()
  }

  reset () {
    this.pixels = new Array(DISPLAY_HEIGHT).fill(0).map(() => new Array(DISPLAY_WIDTH).fill(0))
    this._onClear && this._onClear()
    return this
  }

  get (x, y) {
    if (x > DISPLAY_WIDTH || y > DISPLAY_HEIGHT) {
      throw new Error(`Chip8 display is limited to ${DISPLAY_WIDTH} x ${DISPLAY_HEIGHT}`)
    }

    return this.pixels[x][y]
  }

  onPixel (fn) {
    this._onPixel = fn
  }

  onClear (fn) {
    this._onClear = fn
  }

  /**
   * Sets a pixel in the screen.
   * Notice that this will perform a XOR operation with the current status of the pixel.
   *
   * @param x The x position of the pixel
   * @param y The y position of the pixel
   *
   * @returns `1` if the pixel is set after the operation, `0` otherwise
   */
  set (x, y) {
    if (x > DISPLAY_WIDTH || y > DISPLAY_HEIGHT) {
      throw new Error(`Chip8 display is limited to ${DISPLAY_WIDTH} x ${DISPLAY_HEIGHT}`)
    }

    this.pixels[y][x] ^= 1

    this._onPixel && this._onPixel(x, y, this.pixels[y][x])

    if (this.debug) {
      console.info(`Pixel (${x}, ${y}) set to ${this.pixels[y][x]}`)
    }

    // returns the pixel itself
    return this.pixels[y][x]
  }

  /**
   * Draws a byte in a given position of the screen.
   *
   * @param x The x position to start drawing
   * @param y The y position to start drawing
   * @param byte The byte to be drawn
   *
   * @returns `true` if any pixel was changed to unset
   */
  drawByte (x, y, byte) {
    console.log(`Draw byte x: ${x.toString(16)}, y: ${y.toString(16)}, byte: ${byte.toString(16)}`)
    let i = 0; let anyPixelsWereUnset = false
    for (let mask = 0b10000000; mask > 0; mask = mask >> 1) {
      if (mask & byte) {
        if (!this.set(x + i, y)) {
          anyPixelsWereUnset = true
        }
      }
      i = i + 1 // I am not proud
    }
    return anyPixelsWereUnset
  }

  drawBytes (x, y, bytes) {
    let anyPixelsWereUnset = false

    for (let i = 0; i < bytes.length; i++) {
      anyPixelsWereUnset = this.drawByte(x, y + i, bytes[i]) || anyPixelsWereUnset
    }

    return anyPixelsWereUnset
  }

  snapshot () {
    return this.pixels
  }

  render () {
    let str = ''
    for (let i = 0; i < DISPLAY_HEIGHT; i++) {
      for (let j = 0; j < DISPLAY_WIDTH; j++) {
        str += this.pixels[i][j] ? 'o' : ' '
      }
      str += '\n'
    }
    return str
  }
}
