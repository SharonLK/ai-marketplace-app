export type PluginType = 'skill' | 'hook' | 'mcp-server' | 'agent' | 'commands'

export interface MarketplaceIndex {
  plugins: Array<{
    name: string
    source: string
    description: string
  }>
}

export interface Plugin {
  id: string
  type: PluginType
  path: string
  name: string
  displayName: string
  version: string
  description: string
  skills?: string
  hooks?: string
  mcpServers?: string
  agents?: string[]
  commands?: string[]
}
