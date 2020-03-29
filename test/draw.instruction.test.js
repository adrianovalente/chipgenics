const Display = require('../src/display')
const Memory = require('../src/memory')
const Chip8 = require('../src/chip-8')

describe('00E0	Clear the screen', () => {
  const instruction = 0x00e0
  const display = new Display()
  display.drawBytes(3, 3, [0xf0, 0x80, 0xf0, 0x10, 0xf0])

  test('There are no points on the screen after it is cleant', () => {
    const processor = new Chip8({
      memory: new Memory().loadProgram([instruction]),
      display: new Display()
    }).execute()

    expect(display.render().match(/o/g)).toBeUndefined
  })
})
