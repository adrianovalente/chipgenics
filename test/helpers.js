const Chip8 = require('../src/chip8')

const buildChip8 = program => new Chip8({
  memory: {
    program
  },
  clock: {
    sync: true
  }
})

module.exports.writeToMemory = (chip8, position, bytes) => chip8.write(position, bytes)
module.exports.memorySnapshot = ({ memory }, start = 0x0000, end = 0x1000) => new Array(end - start + 1).fill(0x0000).map((_, i) => memory.get(start + i))
module.exports.buildChip8AndPlay = program => buildChip8(program).step(program.length)
module.exports.buildChip8 = buildChip8
