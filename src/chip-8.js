/* eslint-disable no-case-declarations */

const CHIP_8_MEMORY_LENGTH = 4096
const CHIP_8_REGISTERS_LENGTH = 16
const CHIP_8_VF_INDEX = 0xf

const OpCodes = {
  UNCONDITIONAL_JUMP: 1,
  JUMP_IF_MATCHES_VALUE: 3,
  JUMP_IF_DOES_NOT_MATCH_VALUE: 4,
  JUMP_IF_MATCHES_REGISTER: 5,
  LOAD_VALUE: 6,
  ADD_VALUE: 7,
  BIT_OPERATIONS: 8,
  JUMP_IF_DOES_NOT_MATCH_REGISTER: 9
}

class Chip8 {
  constructor (opts = {}) {
    this.backgroundColor = opts.backgroundColor || 'black'
    this.pixelColor = opts.pixelColor || 'white'
    this.debug = typeof opts.debug !== 'undefined' ? opts.debug : false
    this.reset()
  }

  reset () {
    this.stack = []

    // Positions from 0 to 0x200 are reserved to hardcoded sprites
    this.pc = 0x200

    this.memory = new Array(CHIP_8_MEMORY_LENGTH).fill(0x0)
    this.registers = new Array(CHIP_8_REGISTERS_LENGTH).fill(0x0)

    return this
  }

  load (program) {
    for (var i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i]
    }

    return this
  }

  execute (n = 1) {
    for (; n > 0; n--) { // TODO find a better way to implement it
      this._execute()
    }

    return this
  }

  /**
   * Executes a single instruction.
   */
  _execute () {
    const instruction = this.memory[this.pc]
    let sum, diff, borrow // 🌈

    const x = (instruction & 0x0f00) >> 8
    const y = (instruction & 0x00f0) >> 4
    const value = instruction & 0x00ff

    if (this.debug) {
      console.log(`PC: 0x${this.pc.toString(16)}, executing instruction: 0x${instruction.toString(16)}`)
    }

    switch ((instruction & 0xf000) >> 12) {
      case OpCodes.UNCONDITIONAL_JUMP:
        this.pc = instruction & 0x0fff
        return this

      case OpCodes.JUMP_IF_DOES_NOT_MATCH_REGISTER: return this._jumpIf(this.registers[x] !== this.registers[y])
      case OpCodes.JUMP_IF_MATCHES_VALUE: return this._jumpIf(this.registers[x] === (instruction & 0x00ff))
      case OpCodes.JUMP_IF_DOES_NOT_MATCH_VALUE: return this._jumpIf(this.registers[x] !== (instruction & 0x00ff))
      case OpCodes.JUMP_IF_MATCHES_REGISTER: return this._jumpIf(this.registers[x] === this.registers[y])

      case OpCodes.LOAD_VALUE:
        this.registers[x] = value
        return this._incrementProgramCounter()

      case OpCodes.ADD_VALUE:
        sum = this.registers[x] + value

        this.registers[x] = sum % 0x100
        return this._incrementProgramCounter()

      case OpCodes.BIT_OPERATIONS:
        switch (instruction & 0x000f) {
          // store
          case 0:
            this.registers[x] = this.registers[y]
            return this._incrementProgramCounter()

          case 1:
            this.registers[x] = this.registers[x] | this.registers[y]
            return this._incrementProgramCounter()

          case 2:
            this.registers[x] = this.registers[x] & this.registers[y]
            return this._incrementProgramCounter()

          case 3:
            this.registers[x] = this.registers[x] ^ this.registers[y]
            return this._incrementProgramCounter()

          case 4:
            sum = this.registers[x] + this.registers[y]

            // setting carry to VF
            this.registers[CHIP_8_VF_INDEX] = sum > 0x00ff ? 1 : 0

            // taking care that maybe the result is higher than 256
            this.registers[(instruction & 0x0f00) >> 8] = sum % 0x0100
            return this._incrementProgramCounter()

          case 5:
            diff = this.registers[x] - this.registers[y]
            borrow = diff < 0

            this.registers[x] = borrow ? diff + 0x0100 : diff
            this.registers[CHIP_8_VF_INDEX] = borrow ? 0 : 1

            return this._incrementProgramCounter()

          case 6:
            this.registers[CHIP_8_VF_INDEX] = this.registers[y] & 0x0001
            this.registers[x] = this.registers[y] >> 1
            return this._incrementProgramCounter()

          case 7:
            diff = this.registers[(instruction & 0x00f0) >> 4] - this.registers[(instruction & 0x0f00) >> 8]
            borrow = diff < 0

            this.registers[x] = borrow ? diff + 0x0100 : diff
            this.registers[CHIP_8_VF_INDEX] = borrow ? 0 : 1

            return this._incrementProgramCounter()

          case 0x000e:
            this.registers[CHIP_8_VF_INDEX] = (this.registers[y] & 0x0080) >> 7
            this.registers[x] = (this.registers[y] << 1) % 0x0100
            return this._incrementProgramCounter()

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
        }

      default:
        throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
    }
  }

  _incrementProgramCounter () {
    this.pc = this.pc + 1
    return this
  }

  _jumpIf (condition) {
    this.pc += condition ? 2 : 1
    return this
  }
}

module.exports = Chip8
