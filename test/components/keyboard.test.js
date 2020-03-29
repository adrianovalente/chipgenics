const { MockKeyboard } = require('../../src/keyboard')
const mockOnKeyPressListener = jest.fn()

describe('Mock Keyboard interface', () => {
  const keyboard = new MockKeyboard()

  test('initial state', () => expect(keyboard.pressedKey()).toBeNull())
  test('key press', () => {
    keyboard.onKeyPress(mockOnKeyPressListener)
    keyboard.pressKey('a', 0)

    expect(mockOnKeyPressListener).toBeCalledWith('a')
    expect(keyboard.pressedKey()).toBe('a')
  })

  test('release', () => {
    keyboard.release()
    expect(keyboard.pressedKey()).toBeNull()
  })
})
