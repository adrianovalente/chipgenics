const Chip8 = require('../src/chip-8')

test('should empty the stack', () => {
  expect(new Chip8().reset().stack).toEqual([])
})

test('should empty the program counter', () => {
  expect(new Chip8().reset().pc).toBe(0x200)
})

test('should empty the memory, apart from the first 0x200 positions', () => {
  expect(new Chip8().reset().memory.snapshot().slice(0x200))
    .toEqual(new Array(0xe00).fill(0x0))
})

test('should load a program properly', () => {
  const program = [0x20, 0x18]
  expect(new Chip8().load(program).memory.snapshot().slice(0x200, 0x200 + program.length))
    .toEqual(program)
})
