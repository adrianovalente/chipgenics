import test from 'ava'

import Chip8 from '../src/chip-8'

test('instruction 1NNN should jump to NNN position', t => {
  t.is(new Chip8().load([0x1ABC]).execute().pc, 0xABC)
})
