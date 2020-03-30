module.exports = class Clock {
  constructor (frequency = 60) {
    this.frequency = frequency
    this.reset()
  }

  tick (fn) {
    this.__tick = fn
  }

  _tick () {
    this.__tick && this.__tick()
  }

  reset () {
    const self = this

    if (self._interval) {
      clearInterval(self._interval)
    }

    self._interval = setInterval(() => self._tick(), Math.floor(1000 / self.frequency))
  }
}
