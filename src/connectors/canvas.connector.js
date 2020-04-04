module.exports = class CanvasConnector {
  constructor (canvas) {
    if (!canvas) {
      throw new Error('Canvas not provided')
    }
    this.canvas = canvas

    this.width = canvas.width
    this.height = canvas.height

    this.pixelWidth = this.width / 64
    this.pixelHeight = this.height / 32
  }

  setBitmap (bitmap) {
    this._clear()

    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = 'green'

    for (let i = 0; i < bitmap.length; i++) {
      for (let j = 0; j < bitmap[0].length; j++) {
        if (bitmap[i][j]) {
          ctx.fillRect(j * this.pixelHeight, i * this.pixelWidth, this.pixelHeight, this.pixelWidth)
        }
      }
    }

    ctx.save()
  }

  connect (display) {
    const self = this
    self._clear()

    display.onClear(() => self._clear())
    display.onPixel((_x, _y, val) => {
      const coords = (x, y) => ({
        x: x * self.pixelWidth, y: y * self.pixelHeight, h: self.pixelWidth, w: self.pixelHeight
      })

      const ctx = this.canvas.getContext('2d')
      ctx.beginPath()

      const { x, y, h, w } = coords(_x, _y)
      ctx.fillStyle = 'green'
      if (val) {
        ctx.fillRect(x, y, h, w)
      } else {
        ctx.clearRect(x, y, h, w)
      }

      ctx.save()
    })
  }

  _clear () {
    const ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.save()
  }
}
