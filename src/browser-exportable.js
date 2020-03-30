global.Cpu = require('./chip-8')
global.Display = require('./display')
global.Memory = require('./memory')
global.MockKeyboard = require('./keyboard').MockKeyboard
global.ChromeKeyboard = require('./keyboard').ChromeKeyboard
global.Timer = require('./timer')
global.Clock = require('./clock')

global.program = require('./invaders').data

