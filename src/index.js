const Cpu = require('./chip-8')
const Clock = require('./clock')
const Display = require('./display')
const keyboards = require('./keyboard')
const Memory = require('./memory')
const Timer = require('./timer')
const Canvas = require('./connectors/canvas.connector')

module.exports = class {
  constructor ({ cpu, clock, display, keyboard, memory, timer }) {
    const self = this

    self.clock = new Clock(clock)
    self.display = new Display(display)
    self.keyboard = new keyboards.MockKeyboard(keyboard)
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
    this.cpu.step(n)
    return this
  }


}
