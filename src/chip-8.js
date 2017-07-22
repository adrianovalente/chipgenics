export default class Chip8 {
  
  constructor(opts = {}) {
    this.backgroundColor = opts.backgroundColor || 'black'
    this.pixelColor = opts.pixelColor || 'white'
  }

  sayHello() {
    console.log('Hello my background color is', this.backgroundColor) 
  }
}
