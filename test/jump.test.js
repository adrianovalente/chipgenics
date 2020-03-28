const Chip8 = require('../src/chip-8')

test('instruction 1NNN should jump to NNN position', () => {
  const instruction = 0x1abc // jump to 0xabc
  expect(new Chip8().load([instruction]).execute().pc).toBe(0xABC)
})

test('9XY0  Skip the following instruction if the value of register VX is not equal to the value of register VY', () => {
  const instruction = 0x9340 // skip the following instruction if v4 != v5

  expect(new Chip8().load([0x6304, 0x6404, instruction]).execute(3).pc).toBe(0x203)
  expect(new Chip8().load([0x6304, 0x6405, instruction]).execute(3).pc).toBe(0x204)
})

test('3XNN  Skip the following instruction if the value of register VX equals NN', () => {
  const instruction = 0x3344 // skip the following instruction if v3 = 0x44

  expect(new Chip8().load([0x6343, instruction]).execute(2).pc).toBe(0x202)
  expect(new Chip8().load([0x6344, instruction]).execute(2).pc).toBe(0x203)
})

test('4XNN	Skip the following instruction if the value of register VX is not equal to NN', () => {
  const instruction = 0x4344 // skip the following instruction if v3 != 0x44

  expect(new Chip8().load([0x6344, instruction]).execute(2).pc).toBe(0x202)
  expect(new Chip8().load([0x6343, instruction]).execute(2).pc).toBe(0x203)
})

test('5XY0	Skip the following instruction if the value of register VX is equal to the value of register VY', () => {
  const instruction = 0x5340 // skip the following instruction if v3 == v4

  expect(new Chip8().load([0x630a, 0x640a, instruction]).execute(3).pc).toBe(0x204)
  expect(new Chip8().load([0x630a, 0x640b, instruction]).execute(3).pc).toBe(0x203)
})
