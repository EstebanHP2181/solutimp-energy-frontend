import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadUtmsFromSession, saveUtmsToSession, UTM_SESSION_STORAGE_KEY } from './utmSession'

function createSessionStorageMock() {
  const store = new Map<string, string>()
  return {
    getItem: vi.fn((k: string) => (store.has(k) ? store.get(k)! : null)),
    setItem: vi.fn((k: string, v: string) => {
      store.set(k, v)
    }),
    removeItem: vi.fn((k: string) => {
      store.delete(k)
    }),
    clear: vi.fn(() => store.clear()),
    key: vi.fn((i: number) => [...store.keys()][i] ?? null),
    get length() {
      return store.size
    },
    _store: store,
  }
}

describe('utmSession', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('saveUtmsToSession does not setItem when no valid UTMs', () => {
    const m = createSessionStorageMock()
    vi.stubGlobal('sessionStorage', m)
    saveUtmsToSession({})
    saveUtmsToSession({ utm_source: '   ' })
    expect(m.setItem).not.toHaveBeenCalled()
  })

  it('saveUtmsToSession writes trimmed payload and overwrites previous', () => {
    const m = createSessionStorageMock()
    vi.stubGlobal('sessionStorage', m)
    saveUtmsToSession({ utm_source: ' google ' })
    expect(m.setItem).toHaveBeenCalledTimes(1)
    expect(m.setItem).toHaveBeenLastCalledWith(
      UTM_SESSION_STORAGE_KEY,
      JSON.stringify({ utm_source: 'google' })
    )
    saveUtmsToSession({ utm_medium: 'cpc', utm_campaign: 'summer' })
    expect(m.setItem).toHaveBeenCalledTimes(2)
    expect(m.setItem).toHaveBeenLastCalledWith(
      UTM_SESSION_STORAGE_KEY,
      JSON.stringify({ utm_medium: 'cpc', utm_campaign: 'summer' })
    )
  })

  it('loadUtmsFromSession returns parsed UTMs', () => {
    const m = createSessionStorageMock()
    vi.stubGlobal('sessionStorage', m)
    m._store.set(
      UTM_SESSION_STORAGE_KEY,
      JSON.stringify({ utm_source: 'meta', utm_term: 'solar', other: 'x' })
    )
    expect(loadUtmsFromSession()).toEqual({ utm_source: 'meta', utm_term: 'solar' })
  })

  it('loadUtmsFromSession returns {} on missing, invalid JSON, or non-object', () => {
    const m = createSessionStorageMock()
    vi.stubGlobal('sessionStorage', m)
    expect(loadUtmsFromSession()).toEqual({})
    m._store.set(UTM_SESSION_STORAGE_KEY, 'not-json{')
    expect(loadUtmsFromSession()).toEqual({})
    m._store.set(UTM_SESSION_STORAGE_KEY, JSON.stringify([]))
    expect(loadUtmsFromSession()).toEqual({})
    m._store.set(UTM_SESSION_STORAGE_KEY, JSON.stringify({ utm_source: 123 }))
    expect(loadUtmsFromSession()).toEqual({})
  })
})
