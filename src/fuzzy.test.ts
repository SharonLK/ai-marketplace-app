import { describe, it, expect } from 'vitest'
import { fuzzyMatch } from './fuzzy'

describe('fuzzyMatch', () => {
  it('returns indices for an exact match', () => {
    expect(fuzzyMatch('abc', 'abc')).toEqual([0, 1, 2])
  })

  it('matches characters in order across gaps', () => {
    expect(fuzzyMatch('ac', 'abc')).toEqual([0, 2])
  })

  it('is case-insensitive', () => {
    expect(fuzzyMatch('ABC', 'abc')).toEqual([0, 1, 2])
    expect(fuzzyMatch('abc', 'ABC')).toEqual([0, 1, 2])
  })

  it('returns null when query has no match', () => {
    expect(fuzzyMatch('z', 'abc')).toBeNull()
  })

  it('returns null when query is longer than text', () => {
    expect(fuzzyMatch('abcd', 'abc')).toBeNull()
  })

  it('returns null when only some chars match', () => {
    expect(fuzzyMatch('az', 'abc')).toBeNull()
  })

  it('returns empty array for empty query', () => {
    expect(fuzzyMatch('', 'abc')).toEqual([])
  })

  it('returns null for non-empty query against empty text', () => {
    expect(fuzzyMatch('a', '')).toBeNull()
  })

  it('matches the first occurrence when chars repeat', () => {
    // 'aa' in 'abac' should greedily take index 0 then index 2
    expect(fuzzyMatch('aa', 'abac')).toEqual([0, 2])
  })
})
