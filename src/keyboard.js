module.exports.ChromeKeyboard = class ChromeKeyboard {
  constructor () {
    const self = this

    self._pressedKey = null
    self._onKeyPress = []

    window.onkeydown = k => {
      self._pressedKey = k.key
      self._onKeyPress.forEach(fn => fn(k.key))

      self._onKeyPress = [] // hate this bug
    }

    window.onkeyup = k => {
      self._pressedKey = null
    }
  }

  pressedKey () {
    return this._pressedKey
  }

  onKeyPress (fn) {
    this._onKeyPress.push(fn)
  }
}

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
