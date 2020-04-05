<p align="center">
<img src="docs/img/readme.png"/>
<h2 align="center">chipgenics</h2>
</p>

> Quarantine day 22: _"I think I'm gonna write a hardware emulator"_

[![Build Status](https://travis-ci.org/adrianovalente/chip8-emulator.svg?branch=master)](https://travis-ci.org/adrianovalente/chip8-emulator)
[![license](https://img.shields.io/badge/licence-MIT-blue)]()
[![Coverage Status](https://coveralls.io/repos/github/adrianovalente/chip8-emulator/badge.svg)](https://coveralls.io/github/adrianovalente/chip8-emulator)

**chipgenics** is my homemade implementation of a CHIP-8 Virtual Machine running 100% on Javascript. It can be used as the core code for web, mobile or even terminal-made applications. A live demo is available on **[chipgenics.site](https://chipgenics.site)**.

### What is CHIP-8?
CHIP-8 is a interpreted programming language developed by [Joseph Weisbecker](https://en.wikipedia.org/wiki/Joseph_Weisbecker) during the decade of the 1970's. A lot of famous games have their version for CHIP-8, such as Space Invaders, Tetris and others.

### The architecture
CHIP-8 was designed to have a very simple implementation. The processor has 16 single-byte registers and a special 2-bytes register used to store memory addresses. Most implementations had a memory of 4096 positions. The processor also had a program counter and a stack pointer which allowed up to eight recursive subroutine calls. This project implements the CHIP-8 in its original architecture, component by component.

### Instruction Set
The CHIP-8 had a instruction set composed by 48 instructions, including arithmetic and boolean operations, logical jumps, subroutines and a special instruction to draw points in the screen. The complete CHIP-8 instruction set can be found [here](http://mattmik.com/files/chip8/mastering/chip8.html).

### Stop talking, show me the code
After cloning this project and installing the dependencies, you can use the emulator core code requiring the main file under `src/chip8`.

``` javascript
const Chip8 = require('src/chip8')

const program = [
  0x00e0 // Clears the screen
  0x6102, // v1 = 02
  0x6202, // v2 = 02
  0xa00a, // sets I to 0x000a (position of the sprite for `2`)

  0xd125  // draws the number "2" on the screen
]

const chip8 = new Chip8({
  memory: {
    program
  }
}).start()

console.log(chip8.display.render())
// => this will log the rendered screen on the output

```

Alternatively you can also load a program directly from a ROM using the `loadProgram` method from the `Chip8.Memory` class.

### Known issues
- The sound timer is still not implemented.
- There is an issue in ~at least~ one implemented instruction. I can tell it by playing `Space Invaders` and killing an invader, you will see that some unexpected things happen then.
