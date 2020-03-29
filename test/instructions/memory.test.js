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

describe('FX1E  Add the value stored in register VX to register I', () => {
  const instruction = 0xf31e // I = I + v2

  const program = [
    0x6302, // set 0x0002 to v3
    0xa100, // set I to 0x100

    instruction
  ]

  const memory = new Memory({ program })
  const processor = new Chip8({ memory })

  test('should set register I properly', () => {
    processor.play()

    expect(processor.i).toBe(0x0102)
    expect(processor.pc).toBe(0x0203)
  })
})
