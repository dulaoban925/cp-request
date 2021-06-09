import { buildURL, combineURL, isAbsoluteURL, isURLSameOrigin } from '../../src/helpers/url'

describe('helpers:url', () => {
  describe('buildURL', () => {
    test('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })
    test('should support params', () => {
      expect(buildURL('/foo', { foo: 'bar' })).toBe('/foo?foo=bar')
    })
    test('should ignore if some param value is null', () => {
      expect(buildURL('/foo', {
        foo: 'bar',
        baz: null
      })).toBe('/foo?foo=bar')
    })
    test('should ignore if the only param value is null', () => {
      expect(buildURL('/foo', {
        foo: null
      })).toBe('/foo')
    })
    test('should support Object params', () => {
      expect(buildURL('/foo', {
        foo: {
          bar: 'baz'
        }
      })).toBe(`/foo?foo=${encodeURI('{"bar":"baz"}')}`)
    })
    test('should support Date params', () => {
      const date = new Date()
      expect(buildURL('/foo', {
        foo: date
      })).toBe(`/foo?foo=${date.toISOString()}`)
    })
    test('should support Array params', () => {
      expect(buildURL('/foo', {
        foo: ['bar', 'baz']
      })).toBe('/foo?foo[]=bar&foo[]=baz')
    })
    test('should support special char params', () => {
      expect(buildURL('/foo', {
        foo: '@:$, '
      })).toBe('/foo?foo=@:$,+')
    })
    test('should support existing params', () => {
      expect(buildURL('/foo?foo=bar', {
        bar: 'baz'
      })).toBe('/foo?foo=bar&bar=baz')
    })
    test('should correct discard url hash mark', () => {
      expect(buildURL('/foo?foo=bar#hash', {
        bar: 'baz'
      })).toBe('/foo?foo=bar&bar=baz')
    })
    test('should use serializer if provided', () => {
      const serializer = jest.fn(() => {
        return 'foo=bar'
      })
      const params = { foo: 'baz' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo=bar')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })
    test('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('foo=bar'))).toBe('/foo?foo=bar')
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://github.com/ying2gege/cp-request')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })
    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })
    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//github.com/ying2gege/cp-request')).toBeTruthy()
    })
    test('should return false if URL is path-relative', () => {
      expect(isAbsoluteURL('/ying2gege/cp-request')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    test('should combine URL', () => {
      expect(combineURL('https://github.com/', 'ying2gege/cp-request')).toBe('https://github.com/ying2gege/cp-request')
    })
    test('should remove duplicate slashes', () => {
      expect(combineURL('https://github.com/', '/ying2gege/cp-request')).toBe('https://github.com/ying2gege/cp-request')
    })
    test('should insert missing slash', () => {
      expect(combineURL('https://github.com', 'ying2gege/cp-request')).toBe('https://github.com/ying2gege/cp-request')
    })
    test('should not insert slash when relative URL is missing/empty', () => {
      expect(combineURL('https://github.com/ying2gege/cp-request', '')).toBe('https://github.com/ying2gege/cp-request')
    })
    test('should allow a single slash for relative URL', () => {
      expect(combineURL('https://github.com/ying2gege', '/')).toBe('https://github.com/ying2gege/')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })
    test('should not detect same origin', () => {
      expect(isURLSameOrigin('https://github.com/ying2gege/cp-request')).toBeFalsy()
    })
  })
})
