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
  skill:      { active: 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:text-blue-100 dark:border-blue-700',         inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:border-blue-600' },
  hook:       { active: 'bg-orange-600 text-white border-orange-600 dark:bg-orange-700 dark:text-orange-100 dark:border-orange-700', inactive: 'bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:border-orange-600' },
  'mcp-server': { active: 'bg-purple-600 text-white border-purple-600 dark:bg-purple-700 dark:text-purple-100 dark:border-purple-700', inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:border-purple-600' },
  agent:      { active: 'bg-green-600 text-white border-green-600 dark:bg-green-700 dark:text-green-100 dark:border-green-700',     inactive: 'bg-green-50 text-green-700 border-green-200 hover:border-green-400 dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:border-green-600' },
  commands:   { active: 'bg-yellow-500 text-white border-yellow-500 dark:bg-yellow-700 dark:text-yellow-100 dark:border-yellow-700', inactive: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:border-yellow-400 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 dark:hover:border-yellow-600' },
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
  showStarredOnly: boolean
  onToggleStarredOnly: () => void
  starredCount: number
}

export default function FilterBar({ total, filtered, activeTypes, onToggleType, search, onSearch, sort, onSort, typeCounts, inputRef, showStarredOnly, onToggleStarredOnly, starredCount }: Props) {
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
          className="flex-1 min-w-48 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
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
        <div className="w-px self-stretch bg-zinc-200 dark:bg-zinc-700 mx-0.5 shrink-0" />
        <button
          onClick={onToggleStarredOnly}
          aria-pressed={showStarredOnly}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors shrink-0 ${
            showStarredOnly
              ? 'bg-amber-400 text-amber-950 border-amber-400 dark:bg-amber-500 dark:text-amber-950 dark:border-amber-500'
              : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-amber-300 hover:text-amber-600 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-amber-600 dark:hover:text-amber-400'
          }`}
        >
          <span className="text-sm leading-none">★</span>
          {showStarredOnly ? 'Starred' : starredCount > 0 ? `${starredCount} starred` : 'Starred'}
        </button>
        <select
          value={sort}
          onChange={e => onSort(e.target.value as SortOrder)}
          aria-label="Sort order"
          className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-500"
        >
          <option value="default">Default</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Showing {filtered} of {total} plugins
      </p>
    </div>
  )
}
