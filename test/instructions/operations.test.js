const { buildChip8AndPlay } = require('../helpers')

describe('8XY1 Set VX to VX OR VY', () => {
  const instruction = 0x8341 // v3 = v3 || v4
  const chip8 = buildChip8AndPlay([0x6305, 0x6403, instruction])

  test('registers are properly set', () => {
    expect(chip8.cpu.registers[3]).toBe(0x07)
    expect(chip8.cpu.registers[4]).toBe(0x03)
  })
})

describe('8XY2 Set VX to VX AND VY', () => {
  const instruction = 0x8342 // v3 = v3 && v4
  const chip8 = buildChip8AndPlay([0x6307, 0x6402, instruction])

  test('registers are properly set', () => {
    expect(chip8.cpu.registers[3]).toBe(0x02)
    expect(chip8.cpu.registers[4]).toBe(0x02)
  })
})

describe('8XY3 Set VX to VX XOR VY', () => {
  const instruction = 0x8343 // v3 = v3 XOR v4
  const chip8 = buildChip8AndPlay([0x630c, 0x640a, instruction])

  test('resgisters are properly set', () => {
    expect(chip8.cpu.registers[3]).toBe(0x06)
    expect(chip8.cpu.registers[4]).toBe(0x0a)
  })
})

describe('8XY0 Store the value of register VY in register VX', () => {
  const instruction = 0x8430 // v4 <~ v3
  const chip8 = buildChip8AndPlay([0x63ab, instruction])

  test('registers are properly set', () => {
    expect(chip8.cpu.registers[4]).toBe(0xab)
    expect(chip8.cpu.registers[3]).toBe(0xab)
  })
})

describe('8XY4 Add the value of register VY to register VX', () => {
  const instruction = 0x8344 // v3 = v3 + v4

  test('without carry out', () => {
    const chip8 = buildChip8AndPlay([0x63ab, 0x6401, instruction])

    expect(chip8.cpu.registers[3]).toBe(0xac)
    expect(chip8.cpu.registers[4]).toBe(0x01)
    expect(chip8.cpu.registers[15]).toBe(0x0)
  })

  test('with carry out', () => {
    const chip8 = buildChip8AndPlay([0x63ab, 0x64ac, instruction])

    expect(chip8.cpu.registers[3]).toBe(0x57)
    expect(chip8.cpu.registers[4]).toBe(0xac)
    expect(chip8.cpu.registers[15]).toBe(0x1)
  })
})

describe('8XY5 Subtract the value of register VY from register VX', () => {
  const instruction = 0x8365 // v3 = v3 - v6

  test('without borrow', () => {
    const chip8 = buildChip8AndPlay([0x63ab, 0x06601, instruction])

    expect(chip8.cpu.registers[3]).toBe(0x00aa)
    expect(chip8.cpu.registers[6]).toBe(0x0001)
    expect(chip8.cpu.registers[15]).toBe(1)
  })

  test('with borrow', () => {
    const chip8 = buildChip8AndPlay([0x63ab, 0x066cd, instruction])

    expect(chip8.cpu.registers[3]).toBe(0x00de)
    expect(chip8.cpu.registers[6]).toBe(0x00cd)
    expect(chip8.cpu.registers[15]).toBe(0)
  })
})

describe('8XY6 Store the value of register VY shifted right one bit in register VX', () => {
  const instruction = 0x8346

  test('when LSB is set', () => {
    const chip8 = buildChip8AndPlay([0x6403, instruction])

    expect(chip8.cpu.registers[3]).toBe(1)
    expect(chip8.cpu.registers[4]).toBe(3)
    expect(chip8.cpu.registers[15]).toBe(1)
  })

  test('when LSB is not set', () => {
    const chip8 = buildChip8AndPlay([0x6404, instruction])

    expect(chip8.cpu.registers[3]).toBe(2)
    expect(chip8.cpu.registers[4]).toBe(4)
    expect(chip8.cpu.registers[15]).toBe(0)
  })
})

describe('8XY7 Set register VX to the value of VY minus VX', () => {
  const instruction = 0x8437 // v4 = v3 - v4

  test('when there is no borrow', () => {
    const chip8 = buildChip8AndPlay([0x6310, 0x6402, instruction])

    expect(chip8.cpu.registers[4]).toBe(14)
    expect(chip8.cpu.registers[3]).toBe(16)
    expect(chip8.cpu.registers[15]).toBe(1)
  })

  test('when there is borrow', () => {
    const chip8 = buildChip8AndPlay([0x6310, 0x641a, instruction])

    expect(chip8.cpu.registers[4]).toBe(0x00f6)
    expect(chip8.cpu.registers[3]).toBe(0x0010)
    expect(chip8.cpu.registers[15]).toBe(0)
  })
})

describe('8XYE Store the value of register VY shifted left one bit in register VX', () => {
  const instruction = 0x834E // v3 = v4 << 1

  test('when MSB is not set', () => {
    const chip8 = buildChip8AndPlay([0x6403, instruction])

    expect(chip8.cpu.registers[3]).toBe(6)
    expect(chip8.cpu.registers[4]).toBe(3)
    expect(chip8.cpu.registers[15]).toBe(0)
  })

  test('when MSM is set', () => {
    const chip8 = buildChip8AndPlay([0x64fa, instruction])

    expect(chip8.cpu.registers[3]).toBe(0x00f4)
    expect(chip8.cpu.registers[4]).toBe(0x00fa)
    expect(chip8.cpu.registers[15]).toBe(1)
  })
})

describe('7XNN Add the value NN to register VX', () => {
  test('without overflow', () => {
    const instruction = 0x7311 // adds 0x0011 to register v3
    const chip8 = buildChip8AndPlay([0x63ab, instruction])

    expect(chip8.cpu.registers[3]).toBe(0xbc)
    expect(chip8.cpu.registers[15]).toBe(0x00)
  })

  test('with overflow', () => {
    const instruction = 0x73ab // adds 0x00ab to register x3
    const chip8 = buildChip8AndPlay([0x63ab, instruction])

    expect(chip8.cpu.registers[3]).toBe(0x56)
    expect(chip8.cpu.registers[15]).toBe(0x00)
  })
})
