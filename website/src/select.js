const GAMES = [
  '15PUZZLE',
  'BLITZ',
  'CONNECT4',
  'HIDDEN  ',
  'KALEID',
  'MERLIN',
  'PONG',
  'PUZZLE',
  'TANK',
  'TICTAC',
  'VBRIX',
  'WIPEOFF',
  'BLINKY',
  'BRIX',
  'GUESS',
  'INVADERS',
  'MAZE',
  'MISSILE',
  'PONG2',
  'SYZYGY',
  'TETRIS',
  'UFO',
  'VERS'
]

module.exports.setupSelect = function setupSelect (select, cb) {
  GAMES.forEach(function (game) {
    const option = document.createElement('option')
    option.innerHTML = game
    option.setAttribute('value', game)
    select.appendChild(option)
  })

  select.addEventListener('change', () => {
    const request = new XMLHttpRequest()
    request.open('GET', `roms/${select.value}`, true)
    request.responseType = 'arraybuffer'

    request.onload = function (oEvent) {
      const arrayBuffer = request.response
      cb(null, arrayBuffer)
    }

    request.send(null)
  })
}

module.exports.setupFile = function setupFile (element, cb) {
  element.addEventListener('change', function changeRom () {
    const file = element.files[0]
    const reader = new FileReader()
    reader.onloadend = () => cb(null, reader.result)

    if (file) {
      reader.readAsArrayBuffer(file)
    } else {
      alert('Did not found any file!')
    }
  })
}
