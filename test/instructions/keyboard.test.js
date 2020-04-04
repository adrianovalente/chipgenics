const { buildChip8 } = require('../helpers')

describe('EX9E Skip the following instruction if the key corresponding to the hex value currently stored in register VX is pressed', () => {
  const instruction = 0xe39e

  const chip8 = buildChip8([0x630f, instruction, instruction, 0xffff, instruction])
  const keyboard = chip8.keyboard
  chip8.step()

  test('does not jump when key is not pressed', () => {
    chip8.step()
    expect(chip8.cpu.pc).toBe(0x204)
  })

  test('jumps when key is pressed', () => {
    keyboard.pressKey('f')
    chip8.step()

    expect(chip8.cpu.pc).toBe(0x208)
  })

  test('does not jump once key is released', () => {
    keyboard.release()
    chip8.step()

    expect(chip8.cpu.pc).toBe(0x20a)
  })
})

describe('EXA1 Skip the following instruction if the key corresponding to the hex value currently stored in register VX is not pressed', () => {
  const instruction = 0xe3a1

  const chip8 = buildChip8([0x630f, instruction, 0xffff, instruction, instruction])
  const keyboard = chip8.keyboard
  chip8.step()

  test('jumps when key is not pressed', () => {
    chip8.step()
    expect(chip8.cpu.pc).toBe(0x206)
  })

  test('does not jump once key is pressed', () => {
    keyboard.pressKey('f')
    chip8.step()

    expect(chip8.cpu.pc).toBe(0x208)
  })

  test('jumps again once key is released', () => {
    keyboard.release()
    chip8.step()

    expect(chip8.cpu.pc).toBe(0x20c)
  })
})

describe('FX0A Wait for a keypress and store the result in register VX', () => {
  console.warn = () => {} // 🤫
  const instruction = 0xf30a // stores pressed key on v3

  const chip8 = buildChip8([instruction, 0x61ff])
  const keyboard = chip8.keyboard
  const cpu = chip8.cpu

  test('waits until key is pressed', () => {
    chip8.play()
    expect(cpu.registers[1]).toBe(0)
    expect(cpu.registers[3]).toBe(0)
    expect(cpu.pc).toBe(0x0202)
    expect(cpu._isRunning).toBe(false)
  })

  test('when key is pressed', () => {
    keyboard.pressKey('a')
    expect(cpu.registers[1]).toBe(0x00ff)
    expect(cpu.registers[3]).toBe(0x000a)
    expect(cpu.pc).toBe(0x0204)
  })
})
