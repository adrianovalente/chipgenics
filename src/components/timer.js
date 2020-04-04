const DEFAULT_FREQUENCY = 2

class Timer {
  constructor (frequency = DEFAULT_FREQUENCY) {
    this.i = 0
    this._value = 0
    this.frequency = frequency
  }

  get () {
    return this._value
  }

  set (value) {
    this._value = value
    return this
  }

  connect (clock) {
    const self = this
    clock.on('tick', () => self._tick())

    return this
  }

  // ---------- Exposed for testing/mocking only ---------- //
  _tick () {
    if (this._value > 0 && this.i++ % this.frequency === 0) {
      this._value--
    }
  }

  _reset () {
    this._value = 0
    return this
  }
}

module.exports = Timer
