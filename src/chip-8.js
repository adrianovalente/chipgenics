/* eslint-disable no-case-declarations */
const CHIP_8_REGISTERS_LENGTH = 16
const CHIP_8_VF_INDEX = 0xf
const STACK_LENGTH = 1E3

const OpCodes = {
  ZERO_OP_CODE: 0,
  UNCONDITIONAL_JUMP: 1,
  SUBROUTINE: 2,
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
  KEYBOARD: 0xe,
  SPECIAL_OPERATORS: 0xf
}

class Chip8 {
  constructor ({ memory, display, keyboard, timer } = {}, { debug } = {}) {
    this.debug = typeof debug !== 'undefined' && debug
    this.memory = memory
    this.display = display
    this.keyboard = keyboard
    this.timer = timer

    this.reset()
  }

  reset () {
    this._isRunning = false
    this.stack = []

    // Positions from 0 to 0x200 are reserved to hardcoded sprites
    this.pc = 0x200

    // The `i` register is used to access memory
    this.i = 0

    this.registers = new Array(CHIP_8_REGISTERS_LENGTH).fill(0x0)

    return this
  }

  pause () {
    if (this.debug) {
      console.warn(`Execution paused, PC: 0x${this.pc.toString(16)}`)
    }
    this._isRunning = false
    return this
  }

  play () {
    if (this.debug) {
      console.info(`Execution started, PC: 0x${this.pc.toString(16)}`)
    }
    this._isRunning = true
    while (this._isRunning && this.memory.get(this.pc) !== 0x0000) {
      this._isRunning && this._execute()
    }

    return this
  }

  execute (n = 1) {
    for (; n > 0; n--) { // TODO find a better way to implement it
      this._execute()
    }

    return this
  }

  _execute () {
    const self = this
    const instruction = this.memory.get(this.pc)
    let sum, diff, borrow // 🌈

    const x = (instruction & 0x0f00) >> 8
    const y = (instruction & 0x00f0) >> 4
    const nnValue = instruction & 0x00ff
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

      case OpCodes.SUBROUTINE:
        if (this.stack.length > STACK_LENGTH) {
          throw new Error('Stackoverflow: Max recursions reached')
        }
        this.stack.push(this.pc + 1)
        this.pc = nnnValue
        return this

      case OpCodes.JUMP_IF_DOES_NOT_MATCH_REGISTER: return this._jumpIf(this.registers[x] !== this.registers[y])
      case OpCodes.JUMP_IF_MATCHES_VALUE: return this._jumpIf(this.registers[x] === (instruction & 0x00ff))
      case OpCodes.JUMP_IF_DOES_NOT_MATCH_VALUE: return this._jumpIf(this.registers[x] !== (instruction & 0x00ff))
      case OpCodes.JUMP_IF_MATCHES_REGISTER: return this._jumpIf(this.registers[x] === this.registers[y])

      case OpCodes.LOAD_VALUE:
        this.registers[x] = nnValue
        return this._incrementProgramCounter()

      case OpCodes.ADD_VALUE:
        sum = this.registers[x] + nnValue

        this.registers[x] = sum % 0x100
        return this._incrementProgramCounter()

      case OpCodes.SET_REGISTER_I:
        this.i = nnnValue
        return this._incrementProgramCounter()

      case OpCodes.RANDOM_NUMBER:
        this.registers[x] = Math.floor(Math.random() * 0x00ff) & nnValue
        return this._incrementProgramCounter()

      case OpCodes.DRAW:
        const anyBytesWereErased = this.display.drawBytes(
          this.registers[x],
          this.registers[y],
          new Array(instruction & 0x000f).fill(0).map((_, b) => this.memory.get(this.i + b))
        )

        this.registers[CHIP_8_VF_INDEX] = anyBytesWereErased ? 1 : 0
        return this._incrementProgramCounter()

      case OpCodes.KEYBOARD:
        switch (instruction & 0x00ff) {
          case 0x009e: return this._jumpIf(parseInt(this.keyboard.pressedKey(), 16) === this.registers[x])
          case 0x00a1: return this._jumpIf(parseInt(this.keyboard.pressedKey(), 16) !== this.registers[x])

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
        }

      case OpCodes.ZERO_OP_CODE:
        switch (nnValue) {
          case 0x00e0:
            this.display.reset()
            return this._incrementProgramCounter()

          case 0x00ee:
            if (this.stack.length < 1) {
              throw new Error('There is no stacked PC to be popped')
            }

            this.pc = this.stack.pop()
            return this

          default:
            throw new Error(`Unknown instruction: 0x${instruction.toString(16)}, PC: 0x${this.pc.toString(16)}`)
        }

      case OpCodes.SPECIAL_OPERATORS:
        switch (nnValue) {
          case 0x0029:
            this.i = this.memory.getSpriteMemoryPosition(this.registers[x])
            return this._incrementProgramCounter()

          case 0x000a:
            this.pause()
            this.keyboard.onKeyPress(k => {
              self.registers[x] = parseInt(k, 16)
              self.play()
            })

            return this._incrementProgramCounter()

          case 0x0015:
            this.timer.set(this.registers[x])
            return this._incrementProgramCounter()

          case 0x0007:
            this.registers[x] = this.timer.get()
            return this._incrementProgramCounter()

          case 0x001e:
            this.i += this.registers[x]
            return this._incrementProgramCounter()

          case 0x0033:
            this.registers[x].toString().padStart(3, '0').split('')
              .map(n => parseInt(n))
              .forEach((n, i) => {
                this.memory.set(this.i + i, n)
              })

            return this._incrementProgramCounter()

          case 0x0055:
            for (let i = 0; i <= x; i++) {
              this.memory.set(this.i + i, this.registers[i])
            }

            this.i = this.i + x + 1
            return this._incrementProgramCounter()

          case 0x0065:
            for (let i = 0; i <= x; i++) {
              this.registers[i] = this.memory.get(i + this.i)
            }

            this.i = this.i + x + 1
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
