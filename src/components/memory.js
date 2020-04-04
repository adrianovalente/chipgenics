const CHIP_8_MEMORY_LENGTH = 4096

const HEX_CHAR_SPRITES = [
  0xf0, 0x90, 0x90, 0x90, 0xf0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xf0, 0x10, 0xf0, 0x80, 0xf0, // 2
  0xf0, 0x10, 0xf0, 0x10, 0xf0, // 3
  0x90, 0x90, 0xf0, 0x10, 0x10, // 4
  0xf0, 0x80, 0xf0, 0x10, 0xf0, // 5
  0xf0, 0x80, 0xf0, 0x90, 0xf0, // 6
  0xf0, 0x10, 0x20, 0x40, 0x40, // 7
  0xf0, 0x90, 0xf0, 0x90, 0xf0, // 8
  0xf0, 0x90, 0xf0, 0x10, 0xf0, // 9
  0xf0, 0x90, 0xf0, 0x90, 0x90, // a
  0xe0, 0x90, 0xe0, 0x90, 0xe0, // b
  0xf0, 0x80, 0x80, 0x80, 0xf0, // c
  0xe0, 0x90, 0x90, 0x90, 0xe0, // d
  0xf0, 0x80, 0xf0, 0x80, 0xf0, // e
  0xf0, 0x80, 0xf0, 0x80, 0x80 // f
]

module.exports = class Memory {
  constructor ({ debug, program } = {}) {
    this.debug = typeof debug !== 'undefined' && debug
    this.reset()

    if (program) {
      this.loadProgram(program)
    }
  }

  reset () {
    this.bytes = new Array(CHIP_8_MEMORY_LENGTH).fill(0x0000)

    for (let i = 0; i < HEX_CHAR_SPRITES.length; i++) {
      this.bytes[i] = HEX_CHAR_SPRITES[i]
    }
  }

  get (position) {
    return this.bytes[position]
  }

  set (position, value) {
    this.bytes[position] = value
    return this
  }

  loadProgram (program, position = 0x0200) {
    const bytes = program.reduce((acc, inst) => ([
      ...acc,
      (inst & 0xff00) >> 8,
      inst & 0x00ff
    ]), [])

    for (let i = 0; i < bytes.length; i++) {
      this.bytes[position + i] = bytes[i]
    }

    return this
  }

  getSpriteMemoryPosition (hex) {
    if (hex > 0x000f) {
      throw Error('Can only get sprite memory position for value lower than 15')
    }

    return hex * 5
  }

  snapshot () {
    return Object.freeze(this.bytes)
  }
}
