const { MockKeyboard } = require('../../src/keyboard')
const Memory = require('../../src/memory')
const Cpu = require('../../src/chip-8')

describe('EX9E	Skip the following instruction if the key corresponding to the hex value currently stored in register VX is pressed', () => {
  const instruction = 0xe39e

  const keyboard = new MockKeyboard()
  const memory = new Memory({
    program: [0x630f, instruction, instruction, 0xffff, instruction]
  })

  const processor = new Cpu({ memory, keyboard }).execute(1)

  test('does not jump when key is not pressed', () => {
    processor.execute(1)
    expect(processor.pc).toBe(0x202)
  })

  test('jumps when key is pressed', () => {
    keyboard.pressKey('f')
    processor.execute(1)

    expect(processor.pc).toBe(0x204)
  })

  test('does not jump once key is released', () => {
    keyboard.release()
    processor.execute(1)

    expect(processor.pc).toBe(0x205)
  })
})

describe('EXA1	Skip the following instruction if the key corresponding to the hex value currently stored in register VX is not pressed', () => {
  const instruction = 0xe3a1

  const keyboard = new MockKeyboard()
  const memory = new Memory({
    program: [0x630f, instruction, 0xffff, instruction, instruction]
  })

  const processor = new Cpu({ memory, keyboard }).execute(1)

  test('jumps when key is not pressed', () => {
    processor.execute(1)
    expect(processor.pc).toBe(0x203)
  })

  test('does not jump once key is pressed', () => {
    keyboard.pressKey('f')
    processor.execute(1)

    expect(processor.pc).toBe(0x204)
  })

  test('jumps again once key is released', () => {
    keyboard.release()
    processor.execute(1)

    expect(processor.pc).toBe(0x206)
  })
})

describe('FX0A Wait for a keypress and store the result in register VX', () => {
  const instruction = 0xf30a // stores pressed key on v3

  const keyboard = new MockKeyboard()
  const memory = new Memory({
    program: [instruction, 0x61ff] // loads ff into v1 in the end of the program
  })

  const processor = new Cpu({ keyboard, memory }, { debug: false })

  test('waits until key is pressed', () => {
    processor.play()
    expect(processor.registers[1]).toBe(0)
    expect(processor.registers[3]).toBe(0)
    expect(processor.pc).toBe(0x0201)
    expect(processor._isRunning).toBe(false)
  })

  test('when key is pressed', () => {
    keyboard.pressKey('a')
    expect(processor.registers[1]).toBe(0x00ff)
    expect(processor.registers[3]).toBe(0x000a)
    expect(processor.pc).toBe(0x0202)
  })
})
