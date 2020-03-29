/* eslint-disable no-case-declarations */

const Memory = require('./memory')

const CHIP_8_REGISTERS_LENGTH = 16
const CHIP_8_VF_INDEX = 0xf

const OpCodes = {
  ZERO_OP_CODE: 0,
  UNCONDITIONAL_JUMP: 1,
  JUMP_IF_MATCHES_VALUE: 3,
  JUMP_IF_DOES_NOT_MATCH_VALUE: 4,
  JUMP_IF_MATCHES_REGISTER: 5,
  LOAD_VALUE: 6,
  ADD_VALUE: 7,
  BIT_OPERATIONS: 8,
  JUMP_IF_DOES_NOT_MATCH_REGISTER: 9,
  SET_REGISTER_I: 0xa,
  JUMP_NNN: 0xb,
  RANDOM_NUMBER: 0xc,
  DRAW: 0xd,
  SPECIAL_OPERATORS: 0xf
}

class Chip8 {
  constructor ({ memory, display } = {}, { debug } = {}) {
    this.debug = typeof debug !== 'undefined' && debug
    this.display = display
    this.reset(memory)
  }

  reset (memory) {
    this.stack = []

    // Positions from 0 to 0x200 are reserved to hardcoded sprites
    this.pc = 0x200

    // The `i` register is used to access memory
    this.i = 0

    if (!memory) {
      console.warn('Memory instantiation inside processor is deprecated, it should be injected as dependency instead')
      this.memory = new Memory({ debug: this.debug })
    } else {
      this.memory = memory
    }

    this.registers = new Array(CHIP_8_REGISTERS_LENGTH).fill(0x0)

    return this
  }

  /*
   * DEPRECATED
   * @TODO inject external memory component instead of loading program here
   */
  load (program) {
    this.memory.loadProgram(program)
    return this
  }

  execute (n = 1) {
    for (; n > 0; n--) { // TODO find a better way to implement it
      this._execute()
    }

    return this
  }

  _execute () {
    const instruction = this.memory.get(this.pc)
    let sum, diff, borrow // 🌈

    const x = (instruction & 0x0f00) >> 8
    const y = (instruction & 0x00f0) >> 4
    const value = instruction & 0x00ff
    const nnnValue = instruction & 0x0fff

    if (this.debug) {
      console.log(`PC: 0x${this.pc.toString(16)}, executing instruction: 0x${instruction.toString(16)}`)
    }

    switch ((instruction & 0xf000) >> 12) {
      case OpCodes.UNCONDITIONAL_JUMP:
        this.pc = instruction & 0x0fff
        return this

      case OpCodes.JUMP_NNN:
        this.pc = this.registers[0] + nnnValue
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

      case OpCodes.SET_REGISTER_I:
        this.i = nnnValue
        return this._incrementProgramCounter()

      case OpCodes.RANDOM_NUMBER:
        this.registers[x] = Math.floor(Math.random() * 0x00ff) & value
        return this._incrementProgramCounter()

      case OpCodes.DRAW:
        const anyBytesWereErased = this.display.drawBytes(
          this.registers[x],
          this.registers[y],
          new Array(instruction & 0x000f).fill(0).map((_, b) => this.memory.get(this.i + b))
        )

        this.registers[CHIP_8_VF_INDEX] = anyBytesWereErased ? 1 : 0
        return this._incrementProgramCounter()

      case OpCodes.ZERO_OP_CODE:
        switch (instruction & 0x00ff) {
          case 0x00e0:
            this.display.reset()
            return this._incrementProgramCounter()

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
        }

      case OpCodes.SPECIAL_OPERATORS:
        switch (instruction & 0x00ff) {
          case 0x0029:
            this.i = this.memory.getSpriteMemoryPosition(this.registers[x])
            return this._incrementProgramCounter()

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
        }

      case OpCodes.BIT_OPERATIONS:
        switch (instruction & 0x000f) {
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
