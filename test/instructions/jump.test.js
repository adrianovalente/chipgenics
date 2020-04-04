const { buildChip8AndPlay } = require('../helpers')

describe('1NNN Jump to address NNN', () => {
  const instruction = 0x1abc // jump to 0xabc
  test('program counter is properly set', () => expect(buildChip8AndPlay([instruction]).cpu.pc).toBe(0x0abc))
})

describe('9XY0  Skip the following instruction if the value of register VX is not equal to the value of register VY', () => {
  const instruction = 0x9340 // skip the following instruction if v4 != v5

  test('when does not jump', () => expect(buildChip8AndPlay([0x6304, 0x6404, instruction]).cpu.pc).toBe(0x0206))
  test('when jumps', () => expect(buildChip8AndPlay([0x6304, 0x6405, instruction]).cpu.pc).toBe(0x0208))
})

describe('3XNN  Skip the following instruction if the value of register VX equals NN', () => {
  const instruction = 0x3344 // skip the following instruction if v3 = 0x44

  test('when does not jump', () => expect(buildChip8AndPlay([0x6343, instruction]).cpu.pc).toBe(0x0204))
  test('when jumps', () => expect(buildChip8AndPlay([0x6344, instruction]).cpu.pc).toBe(0x0206))
})

describe('4XNN Skip the following instruction if the value of register VX is not equal to NN', () => {
  const instruction = 0x4344 // skip the following instruction if v3 != 0x44

  test('when does not jump', () => expect(buildChip8AndPlay([0x6344, instruction]).cpu.pc).toBe(0x0204))
  test('when jumps', () => expect(buildChip8AndPlay([0x6343, instruction]).cpu.pc).toBe(0x0206))
})

describe('5XY0 Skip the following instruction if the value of register VX is equal to the value of register VY', () => {
  const instruction = 0x5340 // skip the following instruction if v3 == v4

  test('when does not jump', () => expect(buildChip8AndPlay([0x630a, 0x640b, instruction]).cpu.pc).toBe(0x0206))
  test('when jumps', () => expect(buildChip8AndPlay([0x630a, 0x640a, instruction]).cpu.pc).toBe(0x0208))
})

describe('BNNN Jump to address NNN + V0', () => {
  const instruction = 0xb523 // skip to position 0x523 + v0

  test('when jumps', () => expect(buildChip8AndPlay([0x6002, instruction]).cpu.pc).toBe(0x0525))
})
