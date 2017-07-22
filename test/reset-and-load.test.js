import test from 'ava'

import Chip8 from '../src/chip-8'

test('reset method should empty the stack', t => {
  const chip8 =
  t.deepEqual(new Chip8().reset().stack, [])

  t.pass()
})
