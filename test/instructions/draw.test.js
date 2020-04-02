const Display = require('../../src/display')
const Clock = require('../../src/clock')
const Memory = require('../../src/memory')
const Chip8 = require('../../src/chip-8')

describe('00E0	Clear the screen', () => {
  const instruction = 0x00e0
  const display = new Display()
  display.drawBytes(3, 3, [0xf0, 0x80, 0xf0, 0x10, 0xf0])

  test('There are no points on the screen after it is cleant', () => {
    const processor = new Chip8({
      memory: new Memory().loadProgram([instruction]),
      display: new Display(),
      clock: new Clock()
    }).play()

    expect(display.render().match(/o/g)).toBeUndefined
  })
})

describe('DXYN	Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I', () => {
  const display = new Display()

  const instruction = 0xd12f // Draws 0x000f = 15 bytes (3 chars) starting on pixel (v1, v2)
  const eraseInstruction = 0xd125 // Erases number 2 from screen
  const program = [
    0x6102, // v1 = 02
    0x6202, // v2 = 02
    0xa00a, // sets I to 0x000a (position of the sprite for `2`)

    instruction,

    eraseInstruction
  ]

  const memory = new Memory().loadProgram(program)
  const processor = new Chip8({ memory, display })

  test('draws sprites 2, 3, 4 to screen', () => {
    processor.execute(4)
    expect(display.render()).toMatchSnapshot()
  })

  test('no pixel was erased', () => {
    expect(processor.registers[15]).toBe(0) // no pixel was erased
  })

  test('erasing sprite for number 2', () => {
    processor.execute()

    expect(display.render()).toMatchSnapshot()
    expect(processor.registers[15]).toBe(1) // actually erased some pixels
  })
})

describe('FX29	Set I to the memory address of the sprite data corresponding to the hexadecimal digit stored in register VX', () => {
  const instruction = 0xf329

  expect(new Chip8({ memory: new Memory().loadProgram([0x6302, instruction])}).execute(2).i).toBe(0x000a)
})
