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

test('8XY5	Subtract the value of register VY from register VX', () => {
  const processor = new Chip8()
        .load([0x63ab, 0x06601, 0x8365]) // X = 3, Y = 6
        .execute(3)

  expect(processor.registers[3]).toBe(0xaa)
  expect(processor.registers[6]).toBe(0x01)
  expect(processor.registers[15]).toBe(1)
})

test('8XY5	Subtract the value of register VY from register VX [when borrow occurs]', () => {
  const processor = new Chip8()
        .load([0x63ab, 0x066cd, 0x8365])
        .execute(3)

  expect(processor.registers[3]).toBe(0xde)
  expect(processor.registers[6]).toBe(0xcd)
  expect(processor.registers[15]).toBe(0)
})

test('8XY6	Store the value of register VY shifted right one bit in register VX', () => {
  const processor = new Chip8()
        .load([0x6403, 0x8346])
        .execute(2)

  expect(processor.registers[3]).toBe(1)
  expect(processor.registers[4]).toBe(3)
  expect(processor.registers[15]).toBe(1)
})

test('8XY6	Store the value of register VY shifted right one bit in register VX [2]', () => {
  const processor = new Chip8()
        .load([0x6404, 0x8346])
        .execute(2)

  expect(processor.registers[3]).toBe(2)
  expect(processor.registers[4]).toBe(4)
  expect(processor.registers[15]).toBe(0)
})

test('8XY7	Set register VX to the value of VY minus VX', () => {
  const instruction = 0x8437 // v4 = v3 - v4

  const processor = new Chip8()
        .load([0x6310, 0x6402, instruction])
        .execute(3)

  expect(processor.registers[4]).toBe(14)
  expect(processor.registers[3]).toBe(16)
  expect(processor.registers[15]).toBe(1)
})

test('8XY7	Set register VX to the value of VY minus VX [borrow]', () => {
  const instruction = 0x8437 // v4 = v3 - v4

  const processor = new Chip8()
        .load([0x6310, 0x641a, instruction])
        .execute(3)

  expect(processor.registers[4]).toBe(0x00f6)
  expect(processor.registers[3]).toBe(0x0010)
  expect(processor.registers[15]).toBe(0)
})

test('Store the value of register VY shifted left one bit in register VX', () => {
  const instruction = 0x834E // v3 = v4 << 1

  const processor = new Chip8()
        .load([0x6403, instruction])
        .execute(2)

  expect(processor.registers[3]).toBe(6)
  expect(processor.registers[4]).toBe(3)
  expect(processor.registers[15]).toBe(0)
})

test('Store the value of register VY shifted left one bit in register VX [2]', () => {
  const instruction = 0x834E // v3 = v4 << 1

  const processor = new Chip8()
        .load([0x64fa, instruction])
        .execute(2)

  expect(processor.registers[3]).toBe(0x00f4)
  expect(processor.registers[4]).toBe(0x00fa)
  expect(processor.registers[15]).toBe(1)
})
