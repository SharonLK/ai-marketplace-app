import type { RefObject } from 'react'
import type { PluginType } from '../types'

const TYPE_LABELS: { type: PluginType; label: string }[] = [
  { type: 'skill', label: 'Skill' },
  { type: 'hook', label: 'Hook' },
  { type: 'mcp-server', label: 'MCP Server' },
  { type: 'agent', label: 'Agent' },
  { type: 'commands', label: 'Commands' },
]

const TYPE_COLORS: Record<PluginType, { active: string; inactive: string }> = {
  skill:      { active: 'bg-blue-700 text-blue-100 border-blue-700',     inactive: 'bg-blue-950 text-blue-300 border-blue-800 hover:border-blue-600' },
  hook:       { active: 'bg-orange-700 text-orange-100 border-orange-700', inactive: 'bg-orange-950 text-orange-300 border-orange-800 hover:border-orange-600' },
  'mcp-server': { active: 'bg-purple-700 text-purple-100 border-purple-700', inactive: 'bg-purple-950 text-purple-300 border-purple-800 hover:border-purple-600' },
  agent:      { active: 'bg-green-700 text-green-100 border-green-700',   inactive: 'bg-green-950 text-green-300 border-green-800 hover:border-green-600' },
  commands:   { active: 'bg-yellow-700 text-yellow-100 border-yellow-700', inactive: 'bg-yellow-950 text-yellow-300 border-yellow-800 hover:border-yellow-600' },
}

export type SortOrder = 'default' | 'asc' | 'desc'

interface Props {
  total: number
  filtered: number
  activeTypes: PluginType[]
  onToggleType: (t: PluginType) => void
  search: string
  onSearch: (s: string) => void
  sort: SortOrder
  onSort: (s: SortOrder) => void
  typeCounts: Record<PluginType, number>
  inputRef?: RefObject<HTMLInputElement>
}

export default function FilterBar({ total, filtered, activeTypes, onToggleType, search, onSearch, sort, onSort, typeCounts, inputRef }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search plugins…"
          aria-label="Search plugins"
          ref={inputRef}
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
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active ? TYPE_COLORS[type].active : TYPE_COLORS[type].inactive
                }`}
              >
                {label}
                {typeCounts[type] > 0 && (
                  <span className="ml-1.5 opacity-60">{typeCounts[type]}</span>
                )}
              </button>
            )
          })}
        </div>
        <select
          value={sort}
          onChange={e => onSort(e.target.value as SortOrder)}
          aria-label="Sort order"
          className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
        >
          <option value="default">Default</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
      <p className="text-xs text-zinc-500">
        Showing {filtered} of {total} plugins
      </p>
    </div>
  )
}
