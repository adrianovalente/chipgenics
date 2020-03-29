module.exports = class Timer {
  constructor (frequency = 60) {
    this.frequency = frequency
    this._reset()
  }

  get () {
    return this._value
  }

  set (value) {
    this._value = value
    return this
  }

  // ---------- Exposed for testing/mocking only ---------- //
  _tick () {
    if (this._value > 0) {
      this._value--
    }
  }

  _reset () {
    const self = this

    if (self.interval) {
      clearInterval(self.interval)
    }

    self._value = 0
    self.interval = setInterval(() => {
      self._tick()
    }, Math.floor(1000 / self.frequency))

    return this
  }
}
