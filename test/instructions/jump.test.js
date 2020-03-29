const Chip8 = require('../../src/chip-8')
const Memory = require('../../src/memory')

describe('1NNN Jump to address NNN', () => {
  const instruction = 0x1abc // jump to 0xabc
  const processor = new Chip8({
    memory: new Memory({
      program: [instruction]
    })
  }).execute()

  test('program counter is properly set', () => expect(processor.pc).toBe(0xabc))
})

describe('9XY0  Skip the following instruction if the value of register VX is not equal to the value of register VY', () => {
  const instruction = 0x9340 // skip the following instruction if v4 != v5

  test('when does not jump', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6304, 0x6404, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x203)
  })

  test('when jumps', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6304, 0x6405, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x204)
  })
})

describe('3XNN  Skip the following instruction if the value of register VX equals NN', () => {
  const instruction = 0x3344 // skip the following instruction if v3 = 0x44

  test('when does not jump', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6343, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x202)
  })

  test('when jumps', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6344, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x203)
  })
})

describe('4XNN	Skip the following instruction if the value of register VX is not equal to NN', () => {
  const instruction = 0x4344 // skip the following instruction if v3 != 0x44

  test('when does not jump', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6344, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x202)
  })

  test('when jumps', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6343, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x203)
  })
})

describe('5XY0	Skip the following instruction if the value of register VX is equal to the value of register VY', () => {
  const instruction = 0x5340 // skip the following instruction if v3 == v4

  test('when jumps', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x630a, 0x640a, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x204)
  })

  test('when does not jump', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x630a, 0x640b, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x203)
  })
})

describe('BNNN Jump to address NNN + V0', () => {
  const instruction = 0xb523 // skip to position 0x523 + v0

  test('when jumps', () => {
    const processor = new Chip8({
      memory: new Memory({
        program: [0x6002, instruction]
      })
    }).play()

    expect(processor.pc).toBe(0x525)
  })
})
