import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should read cookies', () => {
    document.cookie = 'a=b'
    expect(cookie.read('a')).toBe('b')
  })
  test('should return null if cookie name is not exist', () => {
    document.cookie = 'a=b'
    expect(cookie.read('foo')).toBeNull()
  })
})
