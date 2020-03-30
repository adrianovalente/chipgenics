module.exports = class Timer {
  constructor ({ frequency, passive } = {}) {
    this.frequency = typeof frequency !== 'undefined' ? frequency : 60
    this.passive = (typeof passive !== 'undefined') && passive
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

    if (!self.passive) {
      self.interval = setInterval(() => {
        self._tick()
      }, Math.floor(1000 / self.frequency))
    }

    return this
  }
}
