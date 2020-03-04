const Chip8 = require('../src/chip-8')

test('instruction 0x6XNN should set value NN to register X', () => {
  expect(
    new Chip8()
      .load([0x63ab])
      .execute()
      .registers[3])
    .toBe(0xab)})

test('instruction 0x6XNN should increment program counter', () => {
  expect(
    new Chip8()
      .load([0x63ab])
      .execute()
      .pc)
    .toBe(0x201)})

test('instruction 0x7XNN should add NN to register X', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x7311])
    .execute(2)

  expect(processor.registers[3]).toBe(0xbc)
  expect(processor.registers[15]).toBe(0x00)
})

test('instruction 0x7XNN should wraparound values higher than 256', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x73ab])
    .execute(2)

  expect(processor.registers[3]).toBe(0x56)
  expect(processor.registers[15]).toBe(0x00)
})

test('instruction 0x7XNN should increment program counter', () => {
  expect(
    new Chip8()
      .load([0x63ab, 0x7311])
      .execute(2)
      .pc).toBe(0x202)})

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

test('instruction 0x8XY4 should add value stored in X to Y', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x6401, 0x8344])
    .execute(3)

  expect(processor.registers[3]).toBe(0xac)
  expect(processor.registers[15]).toBe(0x0)
})

test('instruction 0x8XY4 should set carry out to the VF register', () => {
  const processor = new Chip8()
    .load([0x63ab, 0x64ac, 0x8344])
    .execute(3)

  expect(processor.registers[3]).toBe(0x57)
  expect(processor.registers[15]).toBe(0x1)
})
