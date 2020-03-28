const Chip8 = require('../src/chip-8')

test('instruction 1NNN should jump to NNN position', () => {
  expect(new Chip8().load([0x1ABC]).execute().pc).toBe(0xABC)
})

test('9XY0  Skip the following instruction if the value of register VX is not equal to the value of register VY', () => {
  const instruction = 0x9340 // skip the following instruction if v4 != v5
  const processor = new Chip8()
        .load([0x6304, 0x6404, instruction])
        .execute(3)

   expect(processor.pc).toBe(0x203)
})

test('9XY0  Skip the following instruction if the value of register VX is not equal to the value of register VY [skip]', () => {
  const instruction = 0x9340 // skip the following instruction if v4 != v5
  const processor = new Chip8()
        .load([0x6304, 0x6405, instruction])
        .execute(3)

  expect(processor.pc).toBe(0x204)
})
