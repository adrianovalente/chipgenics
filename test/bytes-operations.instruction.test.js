const Chip8 = require('../src/chip-8')

test('instruction 0x8XY1 should perform logic OR', () => {
  expect(
    new Chip8()
      .load([0x6305, 0x6403, 0x8341])
      .execute(3)
      .registers[3]).toBe(0x07)})

test('instruction 0x8XY2 should perform logic AND', () => {
  expect(
    new Chip8()
      .load([0x6307, 0x6402, 0x8342])
      .execute(3)
      .registers[3]).toBe(0x02)})

test('instruction 0x8XY3 should perform logic XOR', () => {
  expect(
    new Chip8()
      .load([0x630c, 0x640a, 0x8343])
      .execute(3)
      .registers[3]).toBe(0x06)})

test('instruction 0x8XY0 should the value stored in Y to X', () => {
  expect(
    new Chip8()
      .load([0x63ab, 0x8430])
      .execute(2)
      .registers[4]).toBe(0xab)})

test('instruction 0x8XY4 should add the value of register VY to register VX', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x6401, 0x8344])
    .execute(3)

  expect(processor.registers[3]).toBe(0xac)
  expect(processor.registers[4]).toBe(0x01)
  expect(processor.registers[15]).toBe(0x0)
})

test('instruction 0x8XY4 should set carry out to the VF register', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x64ac, 0x8344])
    .execute(3)

  expect(processor.registers[3]).toBe(0x57)
  expect(processor.registers[4]).toBe(0xac)
  expect(processor.registers[15]).toBe(0x1)
})
