const Chip8 = require('../../src/chip-8')

test('ANNN	Store memory address NNN in register I', () => {
  const instruction = 0xA123 // sets hex value 0x123 to I
  const processor = new Chip8().load([instruction]).execute(1)

  expect(processor.pc).toBe(0x201)
  expect(processor.i).toBe(0x123)
})
