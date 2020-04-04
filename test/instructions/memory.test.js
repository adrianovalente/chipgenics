const { buildChip8, buildChip8AndPlay, memorySnapshot, writeToMemory } = require('../helpers')

describe('ANNN	Store memory address NNN in register I', () => {
  const instruction = 0xa123 // sets hex value 0x123 to I
  const chip8 = buildChip8AndPlay([instruction])

  test('program counter is properly set', () => expect(chip8.cpu.pc).toBe(0x202))
  test('the I register is properly set', () => expect(chip8.cpu.i).toBe(0x123))
})

describe('FX1E  Add the value stored in register VX to register I', () => {
  const instruction = 0xf31e // I = I + v2

  const program = [
    0x6302, // set 0x0002 to v3
    0xa100, // set I to 0x100

    instruction
  ]

 const chip8 = buildChip8AndPlay(program)

  test('should set register I properly', () => {
    expect(chip8.cpu.i).toBe(0x0102)
    expect(chip8.cpu.pc).toBe(0x0206)
  })
})

describe('FX33	Store the binary-coded decimal equivalent of the value stored in register VX at addresses I, I+1, and I+2', () => {
  const instruction = 0xf333 // I <~ BCD(v3)

  const program = [
    0xa100, // set I to 0x0100
    0x63fb, // set v3 to 0x00fb

    instruction]

  const chip8 = buildChip8AndPlay(program)

  test('i is not changed', () => {
    expect(chip8.cpu.i).toBe(0x100)
  })


  test('memory is set', () => {
    expect(memorySnapshot(chip8, 0x0100, 0x0102)).toEqual([2, 5, 1])
  })
})

describe('FX55 Store the values of registers V0 to VX inclusive in memory starting at address I', () => {
  const instruction = 0xf355 // stores v0, v1, v2 and v3 to memory

  const program = [
    0x6010,
    0x6111,
    0x620a,
    0x631b,
    0xa100,
    instruction
  ]

  const chip8 = buildChip8AndPlay(program)

  test('memory is set', () => {
    expect(memorySnapshot(chip8, 0x0100, 0x0105)).toEqual([0x0010, 0x0011, 0x00a, 0x001b, 0x0000, 0x0000])
  })

  test('I is set to I + X + 1 after operation', () => {
    expect(chip8.cpu.i).toBe(0x104)
  })
})

describe('Fill registers V0 to VX inclusive with the values stored in memory starting at address I', () => {
  const instruction = 0xf365 // copies memory to v0 ~ v3

  const program = [
    0xa100,
    instruction
  ]

  const chip8 = writeToMemory(buildChip8(program), 0x0100, [0x00fa, 0x00fb, 0x00fc, 0x00fd, 0x00fe])
  chip8.cpu.step(2)


  test('registers are set', () => {
    expect(chip8.cpu.registers).toEqual([
      0x00fa, 0x00fb, 0x00fc, 0x00fd,
      0x0000, 0x0000, 0x0000, 0x0000,
      0x0000, 0x0000, 0x0000, 0x0000,
      0x0000, 0x0000, 0x0000, 0x0000
    ])

  })
  test('I is set to I + X + 1 after', () => {
    expect(chip8.cpu.i).toBe(0x104)
  })
})
