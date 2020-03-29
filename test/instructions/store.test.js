const Memory = require('../../src/memory')
const Chip8 = require('../../src/chip-8')

describe('6XNN	Store number NN in register VX', () => {
  const instruction = 0x63ab // sets value 0xab to register v3

  const processor = new Chip8({
    memory: new Memory().loadProgram([0x63ab])
  }).execute()

  test('sets value to register 3', () => expect(processor.registers[3]).toBe(0xab))
  test('increments program counter', () => expect(processor.pc).toBe(0x0201))
})
