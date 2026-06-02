import { describe, it, expect } from 'vitest'
import { artifactLinks } from './PluginDetail'
import { REPO_GITHUB_BASE } from '../api'
import type { Plugin } from '../types'

const base: Plugin = {
  id: 'foo',
  type: 'skill',
  path: 'plugins/foo',
  name: 'foo',
  displayName: 'Foo',
  version: '1.0.0',
  description: 'desc',
}

describe('artifactLinks', () => {
  it('returns empty array when plugin has no artifact fields', () => {
    expect(artifactLinks(base)).toEqual([])
  })

  it('includes a link for skills', () => {
    const links = artifactLinks({ ...base, skills: 'skills.md' })
    expect(links).toEqual([{ label: 'skills.md', href: `${REPO_GITHUB_BASE}/plugins/foo/skills.md` }])
  })

  it('includes a link for hooks', () => {
    const links = artifactLinks({ ...base, hooks: 'hooks.js' })
    expect(links).toEqual([{ label: 'hooks.js', href: `${REPO_GITHUB_BASE}/plugins/foo/hooks.js` }])
  })

  it('includes a link for mcpServers', () => {
    const links = artifactLinks({ ...base, mcpServers: 'mcp.json' })
    expect(links).toEqual([{ label: 'mcp.json', href: `${REPO_GITHUB_BASE}/plugins/foo/mcp.json` }])
  })

  it('includes one link per agent', () => {
    const links = artifactLinks({ ...base, agents: ['agent1.md', 'agent2.md'] })
    expect(links).toHaveLength(2)
    expect(links[0]).toEqual({ label: 'agent1.md', href: `${REPO_GITHUB_BASE}/plugins/foo/agent1.md` })
    expect(links[1]).toEqual({ label: 'agent2.md', href: `${REPO_GITHUB_BASE}/plugins/foo/agent2.md` })
  })

  it('includes one link per command', () => {
    const links = artifactLinks({ ...base, commands: ['cmd.md'] })
    expect(links).toEqual([{ label: 'cmd.md', href: `${REPO_GITHUB_BASE}/plugins/foo/cmd.md` }])
  })

  it('combines all artifact types in order', () => {
    const links = artifactLinks({
      ...base,
      skills: 's.md',
      hooks: 'h.js',
      agents: ['a.md'],
    })
    expect(links.map(l => l.label)).toEqual(['s.md', 'h.js', 'a.md'])
  })
})
