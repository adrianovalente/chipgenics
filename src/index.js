const fs = require('fs')
const path = require('path')

const stream = fs.createWriteStream('/Users/drico/Desktop/debug.log')
const debugLog = log => {
  log = typeof log === 'string' ? log : JSON.stringify(log)
  stream.write(log + '\n')
}
global.debugLog = debugLog

const Cpu = require('./chip-8')
const Display = require('./display')
const Memory = require('./memory')
const { MockKeyboard, Keyboard } = require('./keyboard')
const Timer = require('./timer')
const Clock = require('./clock')
// const Canvas = require('./canvas')

const Canvas = require('term-canvas')

const invaders = require('./invaders')



// const filePath = path.join(__dirname, '../roms/ibm-logo.ch8')
// const filePath = path.join(__dirname, '../roms/invaders')
 const filePath = path.join(__dirname, '../roms/TEST')
// const bytes = fs.readFileSync(filePath)

const bytes = invaders.data


;(async function main () {
  const memory = new Memory({
//    program: bytes
    program: fs.readFileSync(filePath)
  })


  const keyboard = new Keyboard()
  //const keyboard = new MockKeyboard()
  const timer = new Timer()
  const display = new Display()
  const clock = new Clock(600)

  const cpu = new Cpu({
    memory, keyboard, timer, display, clock
  }, {
    debug: false
  })

  global.memory = memory
  global.timer = timer
  global.display = display
  global.cpu = cpu

  var canvas = new Canvas(100, 100)

  const ctx = canvas.getContext('2d')

  const leftMargin = 5
  const topMargin = 5

  const length = 128 / 64
  const high = 32 / 32

  //ctx.fillStyle = 'red';
  //ctx.fillRect(5, 5, 128, 32);

  const coords = (x, y) => ({
    x: x * 2 + topMargin , y: y + topMargin, h: 2, w: 1
  })

  ctx.save();

  display.onClear(() => {
    ctx.clearRect(5, 5, 128, 32);
  })

  const onPixel = (_x, _y, val) => {

    const { x, y, h, w } = coords(_x, _y)
    ctx.fillStyle = 'green'
    if (val) {
      ctx.fillRect(x, y, h, w)
    } else {
      ctx.clearRect(x, y, h, w)
    }

    /*
    ctx.fillStyle = val ? 'green' : 'red'
    ctx.fillRect(x, y, h, w)
    */


    ctx.save()

  }

  //display.onPixel(() => {})
  display.onPixel(onPixel)

//  display.onPixel(new Canvas().connect)

  cpu.play()

//  console.log(display.render())

})()
