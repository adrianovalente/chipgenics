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

describe('FX33	Store the binary-coded decimal equivalent of the value stored in register VX at addresses I, I+1, and I+2', () => {
  const instruction = 0xf333 // I <~ BCD(v3)

  const memory = new Memory({
    program: [
      0xa100, // set I to 0x0100
      0x63fb, // set v3 to 0x00fb

      instruction
    ]
  })

  const processor = new Chip8({ memory }).play()

  test('i is not changed', () => {
    expect(processor.i).toBe(0x100)
  })

  test('memory is set', () => {
    expect([
      memory.get(0x100),
      memory.get(0x101),
      memory.get(0x102)
    ]).toEqual([2, 5, 1])
  })
})
