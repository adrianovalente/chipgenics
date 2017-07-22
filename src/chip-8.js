const CHIP_8_MEMORY_LENGTH = 4096
const CHIP_8_STACK_LENGTH = 16

export default class Chip8 {

  constructor(opts = {}) {
    this.backgroundColor = opts.backgroundColor || 'black'
    this.pixelColor = opts.pixelColor || 'white'
  }

  reset() {
    this.pc = 0x200  // Positions from 0 to 0x200 are reserved to hardcoded sprites
    this.stack = []
    this.memory = new Array(CHIP_8_MEMORY_LENGTH).fill(0x0)

    return this
  }



}
