import test from 'ava'

import Chip8 from '../src/chip-8'

test('should empty the stack', t => {
  t.deepEqual(new Chip8().reset().stack, [])
})

test('should empty the program counter', t => {
  t.is(new Chip8().reset().pc, 0x200)
})

test('should empty the memory, apart from the first 0x200 positions', t => {
  t.deepEqual(
    new Chip8().reset().memory.slice(0x200),
    new Array(0xe00).fill(0x0)
  )
})

test('should load a program properly', t => {
  const program = [0x20, 0x18]
  t.deepEqual(
    new Chip8().load(program).memory.slice(0x200, 0x200 + program.length),
    program
  )

})
