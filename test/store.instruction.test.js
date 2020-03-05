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

