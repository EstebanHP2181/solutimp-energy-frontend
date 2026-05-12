import { describe, expect, it } from 'vitest'
import { normalizeQueryParamValue, readUtmsFromQuery } from './utmQuery'

describe('normalizeQueryParamValue', () => {
  it('trims strings and drops empty', () => {
    expect(normalizeQueryParamValue('  foo  ')).toBe('foo')
    expect(normalizeQueryParamValue('')).toBe(undefined)
    expect(normalizeQueryParamValue('   ')).toBe(undefined)
  })
  it('ignores null and undefined', () => {
    expect(normalizeQueryParamValue(null)).toBe(undefined)
    expect(normalizeQueryParamValue(undefined)).toBe(undefined)
  })
  it('takes first valid string from array', () => {
    expect(normalizeQueryParamValue(['', '  bar ', 'baz'])).toBe('bar')
    expect(normalizeQueryParamValue(['', '   ', 'ok'])).toBe('ok')
  })
  it('returns undefined when array has no valid strings', () => {
    expect(normalizeQueryParamValue([])).toBe(undefined)
    expect(normalizeQueryParamValue(['', '  '])).toBe(undefined)
    expect(normalizeQueryParamValue([null, 1, {}])).toBe(undefined)
  })
  it('rejects non-string non-array', () => {
    expect(normalizeQueryParamValue(42)).toBe(undefined)
    expect(normalizeQueryParamValue({})).toBe(undefined)
  })
})

describe('readUtmsFromQuery', () => {
  it('collects known utm keys only', () => {
    expect(
      readUtmsFromQuery({
        utm_source: 'google',
        utm_medium: ['', 'cpc'],
        utm_campaign: '  ',
        foo: 'bar',
      })
    ).toEqual({
      utm_source: 'google',
      utm_medium: 'cpc',
    })
  })
  it('returns empty object when no utms', () => {
    expect(readUtmsFromQuery({})).toEqual({})
    expect(readUtmsFromQuery({ utm_source: null, utm_medium: undefined })).toEqual({})
  })
})
