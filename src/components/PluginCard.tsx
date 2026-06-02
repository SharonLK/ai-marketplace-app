import type React from 'react'
import type { Plugin, PluginType } from '../types'
import { fuzzyMatch } from '../fuzzy'

const BADGE: Record<PluginType, string> = {
  skill:      'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  hook:       'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  'mcp-server': 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  agent:      'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  commands:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
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

function HighlightedSubstring({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const lq = query.toLowerCase()
  const lt = text.toLowerCase()
  const parts: React.ReactNode[] = []
  let last = 0
  let idx = lt.indexOf(lq)
  while (idx !== -1) {
    if (idx > last) parts.push(text.slice(last, idx))
    parts.push(<mark key={idx} className="bg-yellow-400/30 text-inherit rounded-sm">{text.slice(idx, idx + query.length)}</mark>)
    last = idx + query.length
    idx = lt.indexOf(lq, last)
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export default function PluginCard({ plugin, onOpen, search = '' }: Props) {
  return (
    <button
      onClick={onOpen}
      className="text-left w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE[plugin.type]}`}>
          {plugin.type}
        </span>
        <span className="text-xs text-zinc-500">v{plugin.version}</span>
      </div>
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        <Highlighted text={plugin.displayName} query={search} />
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
        <HighlightedSubstring text={plugin.description} query={search} />
      </p>
    </button>
  )
}
