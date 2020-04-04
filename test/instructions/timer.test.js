const { buildChip8 } = require('../helpers')

describe('FX15 Set the delay timer to the value of register VX', () => {
  const instruction = 0xf315 // timer <~ v3
  const chip8 = buildChip8([0x63ab, instruction])

  const timer = chip8.timer

  test('timer is set', () => {
    expect(timer.get()).toBe(0)
    chip8.step(2)
    expect(timer.get()).toBe(0x00ab)
  })
})

describe('FX07 Store the current value of the delay timer in register VX', () => {
  const program = [
    // sets timer to 0x00ab
    0x63ab,
    0xf315,

    // stores the value of timer to v2
    0xf207,

    // stores the value of timer to v2
    0xf207
  ]

  const chip8 = buildChip8(program)
  const timer = chip8.timer

  test('delay set properly', () => {
    chip8.step(3)

    expect(timer.get()).toBe(0x00ab)
    expect(chip8.cpu.registers[2]).toBe(0x00ab)
  })

  test('after tick', () => {
    timer._tick()
    chip8.step()

    expect(chip8.cpu.registers[2]).toBe(0x00aa)
  })
})
