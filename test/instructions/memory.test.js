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

describe('FX55 Store the values of registers V0 to VX inclusive in memory starting at address I', () => {
  const instruction = 0xf355 // stores v0, v1, v2 and v3 to memory

  const memory = new Memory({
    program: [
      0x6010,
      0x6111,
      0x620a,
      0x631b,
      0xa100,
      instruction
    ]
  })

  const processor = new Chip8({ memory }).play()

  test('memory is set', () => {
    expect([
      memory.get(0x100),
      memory.get(0x101),
      memory.get(0x102),
      memory.get(0x103),
      memory.get(0x104),
      memory.get(0x105),
    ]).toEqual([0x0010, 0x0011, 0x00a, 0x001b, 0x0000, 0x0000])
  })

  test('I is set to I + X + 1 after operation', () => {
    expect(processor.i).toBe(0x104)
  })

})

describe('Fill registers V0 to VX inclusive with the values stored in memory starting at address I', () => {
  const instruction = 0xf365 // copies memory to v0 ~ v3

  const memory = new Memory({
    program: [0xa100, instruction]
  })
        .set(0x100, 0x00fa)
        .set(0x101, 0x00fb)
        .set(0x102, 0x00fc)
        .set(0x103, 0x00fd)
        .set(0x104, 0x00fe)

  const processor = new Chip8({ memory }).play()

  test('registers are set', () => {
    expect(processor.registers).toEqual([
      0x00fa, 0x00fb, 0x00fc, 0x00fd,
      0x0000, 0x0000, 0x0000, 0x0000,
      0x0000, 0x0000, 0x0000, 0x0000,
      0x0000, 0x0000, 0x0000, 0x0000
    ])

  })
  test('I is set to I + X + 1 after', () => {
    expect(processor.i).toBe(0x104)
  })
})
