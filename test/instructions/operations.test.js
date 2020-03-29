const Chip8 = require('../../src/chip-8')
const Memory = require('../../src/memory')

describe('8XY1	Set VX to VX OR VY', () => {
  const instruction = 0x8341 // v3 = v3 || v4
  const processor = new Chip8({
    memory: new Memory({
      program: [0x6305, 0x6403, 0x8341]
    })
  }).play()

  test('registers are properly set', () => {
    expect(processor.registers[3]).toBe(0x07)
    expect(processor.registers[4]).toBe(0x03)
  })
})

describe('8XY2	Set VX to VX AND VY', () => {
  const instruction = 0x8342 // v3 = v3 && v4
  const processor = new Chip8({
    memory: new Memory({
      program: [0x6307, 0x6402, instruction]
    })
  }).play()

  test('registers are properly set', () => {
    expect(processor.registers[3]).toBe(0x02)
    expect(processor.registers[4]).toBe(0x02)
  })
})

describe('8XY3	Set VX to VX XOR VY', () => {
  const instruction = 0x8343 // v3 = v3 XOR v4
  const processor = new Chip8({
    memory: new Memory({
      program: [0x630c, 0x640a, instruction]
    })
  }).play()

  test('resgisters are properly set', () => {
    expect(processor.registers[3]).toBe(0x06)
    expect(processor.registers[4]).toBe(0x0a)
  })
})

describe('8XY0	Store the value of register VY in register VX', () => {
  const instruction = 0x8430 // v4 <~ v3
  const processor = new Chip8({
    memory: new Memory({
      program: [0x63ab, instruction]
    })
  }).play()

  test('registers are properly set', () => {
    expect(processor.registers[4]).toBe(0xab)
    expect(processor.registers[3]).toBe(0xab)
  })
})

describe('8XY4	Add the value of register VY to register VX', () => {
  const instruction = 0x8344 // v3 = v3 + v4

  test('without carry out', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, 0x6401
                  , instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0xac)
    expect(processor.registers[4]).toBe(0x01)
    expect(processor.registers[15]).toBe(0x0)
  })

  test('with carry out', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, 0x64ac, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0x57)
    expect(processor.registers[4]).toBe(0xac)
    expect(processor.registers[15]).toBe(0x1)
  })
})

describe('8XY5	Subtract the value of register VY from register VX', () => {
  const instruction = 0x8365 // v3 = v3 - v6

  test('without borrow', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, 0x06601, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0x00aa)
    expect(processor.registers[6]).toBe(0x0001)
    expect(processor.registers[15]).toBe(1)
  })

  test('with borrow', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, 0x066cd, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0x00de)
    expect(processor.registers[6]).toBe(0x00cd)
    expect(processor.registers[15]).toBe(0)
  })
})

describe('8XY6	Store the value of register VY shifted right one bit in register VX', () => {
  const instruction = 0x8346

  test('when LSB is set', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6403, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(1)
    expect(processor.registers[4]).toBe(3)
    expect(processor.registers[15]).toBe(1)
  })

  test('when LSB is not set', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6404, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(2)
    expect(processor.registers[4]).toBe(4)
    expect(processor.registers[15]).toBe(0)
  })
})

describe('8XY7	Set register VX to the value of VY minus VX', () => {
  const instruction = 0x8437 // v4 = v3 - v4

  test('when there is no borrow', () => {
    const processor = new Chip8({
      memory: new Memory({ program: [0x6310, 0x6402, instruction] })
    }).play()

    expect(processor.registers[4]).toBe(14)
    expect(processor.registers[3]).toBe(16)
    expect(processor.registers[15]).toBe(1)
  })

  test('when there is borrow', () => {
    const processor = new Chip8({
      memory: new Memory({ program: [0x6310, 0x641a, instruction]})
    }).play()

    expect(processor.registers[4]).toBe(0x00f6)
    expect(processor.registers[3]).toBe(0x0010)
    expect(processor.registers[15]).toBe(0)
  })
})

describe('8XYE	Store the value of register VY shifted left one bit in register VX', () => {
  const instruction = 0x834E // v3 = v4 << 1

  test('when MSB is not set', () => {
    const processor = new Chip8({
      memory: new Memory({ program: [0x6403, instruction] })
    }).play()

    expect(processor.registers[3]).toBe(6)
    expect(processor.registers[4]).toBe(3)
    expect(processor.registers[15]).toBe(0)
  })

  test('when MSM is set', () => {
    const processor = new Chip8({
      memory: new Memory({ program: [0x64fa, instruction] })
    }).play()

    expect(processor.registers[3]).toBe(0x00f4)
    expect(processor.registers[4]).toBe(0x00fa)
    expect(processor.registers[15]).toBe(1)
  })
})

describe('7XNN	Add the value NN to register VX', () => {
  test('without overflow', () => {
    const instruction = 0x7311 // adds 0x0011 to register v3

    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0xbc)
    expect(processor.registers[15]).toBe(0x00)
  })

  test('with overflow', () => {
    const instruction = 0x73ab // adds 0x00ab to register x3
    const processor = new Chip8({
      memory: new Memory({
        program: [0x63ab, instruction]
      })
    }).play()

    expect(processor.registers[3]).toBe(0x56)
    expect(processor.registers[15]).toBe(0x00)
  })
})
