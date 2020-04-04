const Chip8 = require('../src/chip8')
const Canvas = require('../src/connectors/canvas.connector')

const chip8 = new Chip8({
  keyboard: {
    type: 'browser'
  }
})

const canvas = new Canvas(document.getElementById("myCanvas"))
chip8.connectToDisplay(canvas)

global.changeRom = function changeRom() {
  var file = document.querySelector('#rom').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
    chip8.reset()
    chip8.write(0x0200, new Uint8Array(reader.result))
    chip8.play()
  }

  if (file) {
    reader.readAsArrayBuffer(file);
  } else {
    alert('Did not found any file!')
  }
}

// 🚢
global.chip8 = chip8
