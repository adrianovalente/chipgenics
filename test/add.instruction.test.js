const Chip8 = require('../src/chip-8')

test('instruction 0x7XNN should add NN to register X', () => {
  const processor = new Chip8()
        .load([0x63ab, 0x7311])
        .execute(2)

  expect(processor.registers[3]).toBe(0xbc)
  expect(processor.registers[15]).toBe(0x00)
})

test('instruction 0x7XNN should wraparound results higher than 256', () => {
  const processor = new Chip8()
        .load([0x63ab, 0x73ab])
        .execute(2)

  expect(processor.registers[3]).toBe(0x56)

  // does not set carry out
  expect(processor.registers[15]).toBe(0x00)
})

test('instruction 0x7XNN should increment program counter', () => {
  expect(
    new Chip8()
      .load([0x63ab, 0x7311])
      .execute(2)
      .pc).toBe(0x202)})
