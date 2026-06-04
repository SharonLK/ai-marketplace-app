import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchMarketplaceIndex, fetchPluginManifest, loadAllPlugins, REPO_RAW_BASE } from './api'

function makeFetch(body: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body),
  })
}

const INDEX = {
  plugins: [
    { name: 'foo', source: './plugins/foo', description: 'Does foo things' },
    { name: 'bar', source: './plugins/bar', description: 'Does bar things' },
  ],
}

const FOO_MANIFEST = {
  name: 'foo',
  displayName: 'Foo Skill',
  version: '1.0.0',
  description: 'Does foo things',
}

const BAR_MANIFEST = {
  name: 'bar',
  displayName: 'Bar Hook',
  version: '2.0.0',
  description: 'Does bar things',
  hooks: 'hooks.js',
}

describe('fetchMarketplaceIndex', () => {
  it('fetches from the correct URL', async () => {
    const fetch = makeFetch(INDEX)
    vi.stubGlobal('fetch', fetch)
    await fetchMarketplaceIndex()
    expect(fetch).toHaveBeenCalledWith(`${REPO_RAW_BASE}/.claude-plugin/marketplace.json`, { cache: 'no-cache' })
  })

  it('returns parsed JSON', async () => {
    vi.stubGlobal('fetch', makeFetch(INDEX))
    const result = await fetchMarketplaceIndex()
    expect(result).toEqual(INDEX)
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', makeFetch(null, false))
    await expect(fetchMarketplaceIndex()).rejects.toThrow('Failed to fetch marketplace index: 500')
  })
})

describe('fetchPluginManifest', () => {
  it('fetches from the correct URL', async () => {
    const fetch = makeFetch(FOO_MANIFEST)
    vi.stubGlobal('fetch', fetch)
    await fetchPluginManifest('plugins/foo')
    expect(fetch).toHaveBeenCalledWith(`${REPO_RAW_BASE}/plugins/foo/.claude-plugin/plugin.json`)
  })

  it('returns parsed JSON', async () => {
    vi.stubGlobal('fetch', makeFetch(FOO_MANIFEST))
    const result = await fetchPluginManifest('plugins/foo')
    expect(result).toEqual(FOO_MANIFEST)
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', makeFetch(null, false))
    await expect(fetchPluginManifest('plugins/foo')).rejects.toThrow(
      'Failed to fetch manifest for plugins/foo: 500'
    )
  })
})

describe('loadAllPlugins', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(INDEX) })
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(FOO_MANIFEST) })
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(BAR_MANIFEST) })
    )
  })

  it('returns one Plugin per entry in the index', async () => {
    const plugins = await loadAllPlugins()
    expect(plugins).toHaveLength(2)
  })

  it('merges index fields with manifest fields', async () => {
    const [foo, bar] = await loadAllPlugins()
    expect(foo).toMatchObject({
      id: 'foo',
      type: 'skill',
      path: 'plugins/foo',
      displayName: 'Foo Skill',
      version: '1.0.0',
      description: 'Does foo things',
    })
    expect(bar).toMatchObject({
      id: 'bar',
      type: 'hook',
      displayName: 'Bar Hook',
    })
  })

  it('falls back to id when displayName and name are missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ plugins: [{ name: 'bare', source: './plugins/bare', description: '' }] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ version: '0.1.0', description: 'minimal' }),
        })
    )
    const [plugin] = await loadAllPlugins()
    expect(plugin.displayName).toBe('bare')
    expect(plugin.name).toBe('bare')
  })

  it('propagates index fetch failure', async () => {
    vi.stubGlobal('fetch', makeFetch(null, false))
    await expect(loadAllPlugins()).rejects.toThrow('Failed to fetch marketplace index')
  })
})
