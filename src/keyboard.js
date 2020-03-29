module.exports.Keyboard = class Keyboard {
  pressedKey () {
    console.warn('Unimplemented method')
  }

  onKeyPress () {
    console.warn('Unimplemented method')
  }
}

module.exports.MockKeyboard = class MockKeyboard {
  constructor () {
    this._pressedKey = null
    this._onKeyPress = null
  }

  pressedKey () {
    return this._pressedKey
  }

  onKeyPress (fn) {
    this._onKeyPress = fn
  }

  /* Mock */
  pressKey (k, timeout = 200) {
    const self = this

    self._pressedKey = k
    if (self._onKeyPress) {
      self._onKeyPress(k)
      self._onKeyPress = null
    }

    if (timeout !== 0) {
      setTimeout(timeout, () => self.release())
    }
  }

  release () {
    this._pressedKey = null
  }
}
