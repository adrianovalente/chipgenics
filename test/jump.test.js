const Chip8 = require('../src/chip-8')

test('instruction 1NNN should jump to NNN position', () => {
  expect(new Chip8().load([0x1ABC]).execute().pc).toBe(0xABC)
})
