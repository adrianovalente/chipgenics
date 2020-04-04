const { buildChip8AndPlay } = require('../helpers')

describe('6XNN Store number NN in register VX', () => {
  const instruction = 0x63ab // sets value 0xab to register v3

  const chip8 = buildChip8AndPlay([instruction])

  test('sets value to register 3', () => expect(chip8.cpu.registers[3]).toBe(0xab))
  test('increments program counter', () => expect(chip8.cpu.pc).toBe(0x0202))
})
