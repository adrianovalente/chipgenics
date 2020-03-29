const Memory = require('../../src/memory')
const Cpu = require('../../src/chip-8')

describe('2NNN	Execute subroutine starting at address NNN', () => {
  const memory = new Memory({
    program: [0x2100] // calls subroutine on address 0x0100
  })

  const processor = new Cpu({ memory }).execute()

  test('update program counter', () => {
    expect(processor.pc).toBe(0x100)
  })

  test('return address is stacked', () => {
    expect(processor.stack).toEqual([0x201])
  })
})

describe('00EE	Return from a subroutine', () => {
  const instruction = 0x00ee // return

  const memory = new Memory().set(0x100, instruction)
  const processor = new Cpu({ memory })

  processor.stack = [0x0200, 0x0150]
  processor.pc = 0x100

  processor.execute()

  test('returns to original PC', () => expect(processor.pc).toBe(0x0150))
  test('pops return address from stack', () => expect(processor.stack).toEqual([0x0200]))

  test('throws error when there is no return point', () => {
    processor.reset()
    processor.pc = 0x100

    expect(() => processor.execute()).toThrow(/There is no stacked PC to be popped/)
  })
})

describe('Nested subroutines o/', () => {
  /*
   * This is a program that calculates (v1 + v2) * 2 + v3
   */

  const main = [
    0x6102, // v1 <~ 4
    0x6203, // v2 <~ 3
    0x6302, // v3 <~ 2
    0x2102 // calls subroutine at 0x0102
  ]

  const memSnapshot = [
    0x8aa4, // 0x0100 va = va + va
    0x00ee, // 0x0101 return
    0x8a10, // 0x0102 va <~ v1 <--------- entry point of first subroutine call
    0x8a24, // 0x0103 va = va + v2
    0x2100, // 0x0104 calls subroutine at 0x100
    0x8a34, // 0x0105 va = va + v3
    0x00ee // return
  ]

  const memory = new Memory({ program: main })
  for (let i = 0; i < memSnapshot.length; i++) {
    memory.set(0x0100 + i, memSnapshot[i])
  }

  const processor = new Cpu({ memory }).play()

  test('subroutine returned properly', () => expect(processor.registers[10]).toBe(12))
})
