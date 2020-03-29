const Memory = require('../../src/memory')
const Chip8 = require('../../src/chip-8')
const Timer = require('../../src/timer')

describe('FX15	Set the delay timer to the value of register VX', () => {
  const instruction = 0xf315 // timer <~ v3
  const timer = new Timer()

  const processor = new Chip8({
    memory: new Memory().loadProgram([0x63ab, instruction]),
    timer
  })

  test('timer is set', () => {
    expect(timer.get()).toBe(0)
    processor.execute(2)
    expect(timer.get()).toBe(0x00ab)
  })

})

describe('FX07	Store the current value of the delay timer in register VX', () => {
  const program = [
    // sets timer to 0x00ab
    0x63ab,
    0xf315,

    // stores the value of timer to v2
    0xf207,

    // stores the value of timer to v2
    0xf207
  ]

  const timer = new Timer()
  const memory = new Memory({ program })

  const processor = new Chip8({ timer, memory })

  test('delay set properly', () => {
    processor.execute(3)

    expect(timer.get()).toBe(0x00ab)
    expect(processor.registers[2]).toBe(0x00ab)
  })

  test('after tick', () => {
    timer._tick()
    processor.execute()

    expect(processor.registers[2]).toBe(0x00aa)
  })
})
