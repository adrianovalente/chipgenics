import test from 'ava'

import Chip8 from '../src/chip-8'

test('instruction 0x6XNN should set value NN to register X', t => {
  t.is(
    new Chip8()
      .load([0x63ab])
      .execute()
      .registers[3],
    0xab
  )

})

test('should increment program counter', t => {
  t.is(
    new Chip8()
      .load([0x63ab])
      .execute()
      .pc,
    0x201
  )
})
