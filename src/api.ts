import type { MarketplaceIndex, Plugin } from './types'

export const REPO_RAW_BASE = 'https://raw.githubusercontent.com/SharonLK/claude-code-marketplace/master'
export const REPO_GITHUB_BASE = 'https://github.com/SharonLK/claude-code-marketplace/tree/master'

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

export async function loadAllPlugins(): Promise<Plugin[]> {
  const index = await fetchMarketplaceIndex()
  const manifests = await Promise.all(
    index.plugins.map(entry => fetchPluginManifest(entry.path))
  )
  return index.plugins.map((entry, i) => {
    const m = manifests[i]
    return {
      id: entry.id,
      type: entry.type,
      path: entry.path,
      name: (m.name as string) ?? entry.id,
      displayName: (m.displayName as string) ?? (m.name as string) ?? entry.id,
      version: (m.version as string) ?? '0.0.0',
      description: (m.description as string) ?? '',
      skills: m.skills as string | undefined,
      hooks: m.hooks as string | undefined,
      mcpServers: m.mcpServers as string | undefined,
      agents: m.agents as string[] | undefined,
      commands: m.commands as string[] | undefined,
    }
  })
}
