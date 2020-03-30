const Canvas = require('term-canvas')

const leftMargin = 5
const topMargin = 5
const length = 128 / 64
const high = 32 / 32

const coords = (x, y) => ({
  x: x * 2 + topMargin , y: y + topMargin, h: 2, w: 1
})

module.exports = class CanvasConnector {
  constructor () {
    this.canvas = new Canvas(100, 100)
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = 'white';
  }

  connect (_x, _y, val) {
    const ctx = this.ctx

    const { x, y, h, w } = coords(_x, _y)
    debugLog(val)
    /*
    if (val) {
      ctx.fillRect(x, y, h, w)
    } else {
      ctx.clearRect(x, y, h, w)
    }
    */
   ctx.fillStyle = val ? 'green' : 'red'


    ctx.fillRect(x, y, h, w)
    ctx.save()

  }
}
