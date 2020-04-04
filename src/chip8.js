const Cpu = require('./components/cpu')
const Clock = require('./components/clock')
const Display = require('./components/display')
const { BrowserKeyboard, MockKeyboard } = require('./components/keyboard')
const Memory = require('./components/memory')
const Timer = require('./components/timer')

module.exports = class {
  constructor ({ cpu, clock, display, keyboard, memory, timer } = {}) {
    const self = this
    const Keyboard = keyboard && keyboard.type === 'browser' ? BrowserKeyboard : MockKeyboard

    self.clock = new Clock(clock)
    self.display = new Display(display)
    self.keyboard = new Keyboard(keyboard)
    self.memory = new Memory(memory)
    self.timer = new Timer(timer).connect(self.clock)

    self.cpu = new Cpu({
      clock: self.clock,
      display: self.display,
      keyboard: self.keyboard,
      memory: self.memory,
      timer: self.timer
    })
  }

  step (n) {
    return ({
      ...this,
      cpu: this.cpu.step(n)
    })
  }

  write (position, bytes) {
    return ({
      ...this,
      memory: bytes.reduce((mem, byte, i) => mem.set(position + i, byte), this.memory)
    })
  }

  connectToDisplay (connector) {
    connector.connect(this.display)
    return this
  }

  reset () {
    return ({
      ...this,
      cpu: this.cpu.reset(),
      memory: this.memory.reset()

      // what else should be reset?
    })
  }

  play () {
    return ({
      ...this,
      cpu: this.cpu.play()
    })
  }
}
