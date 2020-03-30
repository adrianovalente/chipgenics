const keypress = require('keypress');

module.exports.ChromeKeyboard = class ChromeKeyboard {
  constructor () {
    const self = this

    self._pressedKey = null
    self._onKeyPress = null

    window.onkeyup = k => {
      console.log(k)
      self._pressedKey = k.key
      self._onKeyPress && self._onKeyPress(k.key)
    }

    window.onkeydown = k => {
      console.log(k)
      self._pressedKey = null
    }
  }

  pressedKey () {
    return this._pressedKey
  }

  onKeyPress (fn) {
    this._onKeyPress = fn

  }
}

module.exports.Keyboard = class Keyboard {
  constructor (timeout = 200) {
    this.timeout = timeout

    this._pressedKey = null
    this._timeout = null

    keypress(process.stdin)
    const self = this

    process.stdin.on('keypress', function (key, c) {
      // we don't want to loose ctrl + c
      if (c && c.ctrl && c.name == 'c') {
        process.exit(0)
      }

      this._timeout && clearTimeout(this._timeout)

      this._timeout = setTimeout(() => {
        self._pressedKey = null
      }, self.timeout)

      self._pressedKey = key


//      global.debugLog(`Pressed key ` + key)
      self._onKeyPress && self._onKeyPress(key)
 })


    process.stdin.setRawMode(true);
    process.stdin.resume();

  }


  pressedKey () {
    return this._pressedKey
  }

  onKeyPress (fn) {
    this._onKeyPress = fn
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
