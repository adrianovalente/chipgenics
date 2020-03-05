const CHIP_8_MEMORY_LENGTH = 4096
const CHIP_8_STACK_LENGTH = 16
const CHIP_8_REGISTERS_LENGTH = 16
const CHIP_8_VF_INDEX = 0xf

const OpCodes = {
  UNCONDITIONAL_JUMP : 1,
  LOAD_VALUE         : 6,
  ADD_VALUE          : 7,
  BIT_OPERATIONS     : 8
}

class Chip8 {

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
    this.registers = new Array(CHIP_8_REGISTERS_LENGTH).fill(0x0)

    return this
  }

  load(program) {
    for (var i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i]
    }

    return this
  }

  execute(n = 1) {
    for (; n > 0; n--) { // TODO find a better way to implement it
      this._execute()
    }

    return this
  }

  /**
   * Executes a single instruction.
   */
  _execute() {
    const instruction = this.memory[this.pc]
    const firstDigit = (instruction & 0xf000) >> 12

    if (this.debug) {
      console.log(`PC: 0x${this.pc.toString(16)}, executing instruction: 0x${instruction.toString(16)}`)
    }

    switch ((instruction & 0xf000) >> 12) {
      case OpCodes.UNCONDITIONAL_JUMP:
        this.pc = instruction & 0x0fff
        return this

      case OpCodes.LOAD_VALUE:
        this.registers[(instruction & 0x0f00) >> 8] = (instruction & 0x00ff)
        return this._incrementProgramCounter()

      case OpCodes.ADD_VALUE:
        const sum = this.registers[(instruction & 0x0f00) >> 8] + (instruction & 0x00ff)

        this.registers[(instruction & 0x0f00) >> 8] = sum % 0x100
        return this._incrementProgramCounter()

      case OpCodes.BIT_OPERATIONS:
        switch (instruction & 0x000f) {
          case 0:
            this.registers[(instruction & 0x0f00) >> 8] = this.registers[(instruction & 0x00f0) >> 4]
            return this._incrementProgramCounter()

          case 1:
            this.registers[(instruction & 0x0f00) >> 8] = this.registers[(instruction & 0x0f00) >> 8] | this.registers[(instruction & 0x00f0) >> 4]
            return this._incrementProgramCounter()

          case 2:
            this.registers[(instruction & 0x0f00) >> 8] = this.registers[(instruction & 0x0f00) >> 8] & this.registers[(instruction & 0x00f0) >> 4]
            return this._incrementProgramCounter()

          case 3:
            this.registers[(instruction & 0x0f00) >> 8] = this.registers[(instruction & 0x0f00) >> 8] ^ this.registers[(instruction & 0x00f0) >> 4]
            return this._incrementProgramCounter()

          case 4: // TODO Carry in
            const sum = this.registers[(instruction & 0x0f00) >> 8] + this.registers[(instruction & 0x00f0) >> 4]

            // setting carry to VF
            this.registers[CHIP_8_VF_INDEX] = sum > 0xff ? 0x1 : 0x0

            // taking care that maybe the result is higher than 256
            this.registers[(instruction & 0x0f00) >> 8] = sum % 0x100
            return this._incrementProgramCounter()

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)

          }

      default:
        throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)


    }


  }

  _incrementProgramCounter() {
    this.pc = this.pc + 1
    return this
  }

}

module.exports = Chip8
