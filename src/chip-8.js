const CHIP_8_MEMORY_LENGTH = 4096
const CHIP_8_STACK_LENGTH = 16

const GOTO_OPCODE = 1


export default class Chip8 {

  constructor(opts = {}) {
    this.backgroundColor = opts.backgroundColor || 'black'
    this.pixelColor = opts.pixelColor || 'white'
    this.debug = typeof opts.debug !== 'undefined' ? opts.debug : false
    this.reset()
  }

  reset() {
    this.stack = []

    // Positions from 0 to 0x200 are reserved to hardcoded sprites
    this.pc = 0x200

    this.memory = new Array(CHIP_8_MEMORY_LENGTH).fill(0x0)

    return this
  }

  load(program) {
    for (var i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i]
    }

    return this
  }

  /**
   * Executes a single instruction.
   */
  execute() {
    const instruction = this.memory[this.pc]
    const firstDigit = (instruction & 0xf000) >> 12

    if (this.debug) {
      console.log(`PC: 0x${this.pc.toString(16)}, executing instruction: 0x${instruction.toString(16)}`)
    }

    // unconditional jump
    if (firstDigit === GOTO_OPCODE) {
      this.pc = instruction & 0x0fff
      return this
    }


    throw new Error(`unimplemented instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
  }





}
