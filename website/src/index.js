const Chip8 = require('../../src/chip8')
const Canvas = require('../../src/connectors/canvas.connector')
const { setupSelect, setupFile } = require('./select')

;(async function main () {
  const chip8 = new Chip8({
    keyboard: {
      type: 'browser'
    }
  })

  const canvas = new Canvas(document.getElementById('display-canvas'))
  chip8.connectToDisplay(canvas)

  setupSelect(document.getElementById('predefined-rom'), (_, byteArray) => loadGame(byteArray))
  setupFile(document.getElementById('rom'), (_, byteArray) => loadGame(byteArray))

  // sorry 🚢
  global.chip8 = chip8
})()

function loadGame (byteArray) {
  console.log(byteArray)
  chip8.reset()
  chip8.write(0x200, new Uint8Array(byteArray))
  chip8.play()
}
