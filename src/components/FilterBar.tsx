import type { PluginType } from '../types'

const TYPE_LABELS: { type: PluginType; label: string }[] = [
  { type: 'skill', label: 'Skill' },
  { type: 'hook', label: 'Hook' },
  { type: 'mcp-server', label: 'MCP Server' },
  { type: 'agent', label: 'Agent' },
  { type: 'commands', label: 'Commands' },
]

interface Props {
  total: number
  filtered: number
  activeTypes: PluginType[]
  onToggleType: (t: PluginType) => void
  search: string
  onSearch: (s: string) => void
}

export default function FilterBar({ total, filtered, activeTypes, onToggleType, search, onSearch }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search plugins…"
          aria-label="Search plugins"
          className="flex-1 min-w-48 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
        />
        <div className="flex flex-wrap gap-1.5">
          {TYPE_LABELS.map(({ type, label }) => {
            const active = activeTypes.includes(type)
            return (
              <button
                key={type}
                onClick={() => onToggleType(type)}
                aria-pressed={active}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-transparent border border-zinc-600 text-zinc-400 hover:border-zinc-400 hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Showing {filtered} of {total} plugins
      </p>
    </div>
  )
}
