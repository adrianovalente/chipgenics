const EventEmitter = require('events')

const CPU_CYCLES_PER_TICK = 10
const requestAnimationFrame = global.requestAnimationFrame || (cb => global.setTimeout(cb, 0))

module.exports = class Clock extends EventEmitter {
  constructor (cyclesPerTick = CPU_CYCLES_PER_TICK) {
    console.log({
      cyclesPerTick,
      requestAnimationFrame
    })

    super()

    this.willAnimate = null
    this._cpuCycle = null
    this.cyclesPerTick = cyclesPerTick
  }

  setCyclesPerTick (cyclesPerTick) {
    this.cyclesPerTick = cyclesPerTick
    return this
  }

  setCpuCycle (fn) {
    this._cpuCycle = fn
    return this
  }

  pause () {
    console.warn('Clock paused')
    this.willAnimate = false

    return this
  }

  start () {
    console.warn('Clock started')

    const self = this
    self.willAnimate = true

    requestAnimationFrame(function cb () {
      for (let i = 0; i < CPU_CYCLES_PER_TICK; i++) {
        self._cpuCycle && self._cpuCycle()
      }

      self.emit('tick')

      if (!self.willAnimate) {
        return console.warn('Skipped animation frame because cpu is stopped.')
      }

      requestAnimationFrame(cb)
    })

    return self
  }
}
