const Memory = require('../../src/memory')
const Chip8 = require('../../src/chip-8')

const TEST_RUNS = 1E4

describe('CXNN	Set VX to a random number with a mask of NN', () => {
  const mask = 0x0099
  const instruction = 0xc300 + mask

  const randomNumbers = new Array(TEST_RUNS).fill(0).map(() => new Chip8({
    memory: new Memory().loadProgram([instruction])
  }).execute().registers[3])

  test('all numbers fit the hex mask', () => {
    expect(randomNumbers.map(n => n & mask)).toEqual(randomNumbers)
    expect(randomNumbers.map(n => n & ~ mask)).toEqual(new Array(TEST_RUNS).fill(0))
  })
})
