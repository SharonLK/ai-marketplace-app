import type { Plugin, PluginType } from '../types'
import { fuzzyMatch } from '../fuzzy'

const BADGE: Record<PluginType, string> = {
  skill: 'bg-blue-950 text-blue-300',
  hook: 'bg-orange-950 text-orange-300',
  'mcp-server': 'bg-purple-950 text-purple-300',
  agent: 'bg-green-950 text-green-300',
  commands: 'bg-yellow-950 text-yellow-300',
}

interface Props {
  plugin: Plugin
  onOpen: () => void
  search?: string
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const matched = new Set(fuzzyMatch(query, text) ?? [])
  if (matched.size === 0) return <>{text}</>
  return (
    <>
      {Array.from(text).map((char, i) =>
        matched.has(i)
          ? <mark key={i} className="bg-yellow-400/30 text-inherit rounded-sm">{char}</mark>
          : char
      )}
    </>
  )
}

export default function PluginCard({ plugin, onOpen, search = '' }: Props) {
  return (
    <button
      onClick={onOpen}
      className="text-left w-full bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE[plugin.type]}`}>
          {plugin.type}
        </span>
        <span className="text-xs text-zinc-500">v{plugin.version}</span>
      </div>
      <h2 className="font-semibold text-zinc-100 mb-1">
        <Highlighted text={plugin.displayName} query={search} />
      </h2>
      <p className="text-sm text-zinc-400 line-clamp-2">{plugin.description}</p>
    </button>
  )
}
