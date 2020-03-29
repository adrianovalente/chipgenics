const Chip8 = require('../../src/chip-8')
const Memory = require('../../src/memory')

describe('ANNN	Store memory address NNN in register I', () => {
  const instruction = 0xa123 // sets hex value 0x123 to I
  const processor = new Chip8({
    memory: new Memory({
      program: [instruction]
    })
  }).execute()

  test('program counter is properly set', () => expect(processor.pc).toBe(0x201))
  test('the I register is properly set', () => expect(processor.i).toBe(0x123))
})
