import type { MarketplaceIndex, Plugin } from './types'

export const REPO_RAW_BASE = 'https://raw.githubusercontent.com/SharonLK/ai-marketplace/master'
export const REPO_GITHUB_BASE = 'https://github.com/SharonLK/ai-marketplace/tree/master'

export async function fetchMarketplaceIndex(): Promise<MarketplaceIndex> {
  const res = await fetch(`${REPO_RAW_BASE}/.claude-plugin/marketplace.json`)
  if (!res.ok) throw new Error(`Failed to fetch marketplace index: ${res.status}`)
  return res.json()
}

export async function fetchPluginManifest(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${REPO_RAW_BASE}/${path}/.claude-plugin/plugin.json`)
  if (!res.ok) throw new Error(`Failed to fetch manifest for ${path}: ${res.status}`)
  return res.json()
}

function deriveType(m: Record<string, unknown>): import('./types').PluginType {
  if (m.agents) return 'agent'
  if (m.mcpServers) return 'mcp-server'
  if (m.hooks) return 'hook'
  if (m.commands) return 'commands'
  return 'skill'
}

export async function loadAllPlugins(): Promise<Plugin[]> {
  const index = await fetchMarketplaceIndex()
  const paths = index.plugins.map(e => e.source.replace(/^\.\//, ''))
  const manifests = await Promise.all(paths.map(fetchPluginManifest))
  return index.plugins.map((entry, i) => {
    const m = manifests[i]
    const path = paths[i]
    return {
      id: entry.name,
      type: deriveType(m),
      path,
      name: (m.name as string) ?? entry.name,
      displayName: (m.displayName as string) ?? (m.name as string) ?? entry.name,
      version: (m.version as string) ?? '0.0.0',
      description: (m.description as string) ?? entry.description,
      skills: m.skills as string | undefined,
      hooks: m.hooks as string | undefined,
      mcpServers: m.mcpServers as string | undefined,
      agents: m.agents as string[] | undefined,
      commands: m.commands as string[] | undefined,
    }
  })
}
