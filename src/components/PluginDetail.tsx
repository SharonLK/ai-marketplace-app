import { useState } from 'react'
import type { Plugin, PluginType } from '../types'
import { REPO_GITHUB_BASE } from '../api'

const BADGE: Record<PluginType, string> = {
  skill: 'bg-blue-950 text-blue-300',
  hook: 'bg-orange-950 text-orange-300',
  'mcp-server': 'bg-purple-950 text-purple-300',
  agent: 'bg-green-950 text-green-300',
  commands: 'bg-yellow-950 text-yellow-300',
}

interface Props {
  plugin: Plugin
  onClose: () => void
}


const MARKETPLACE_CMD = 'claude plugin marketplace add https://github.com/SharonLK/ai-marketplace'

function CopyRow({ cmd, label }: { cmd: string; label: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2">
      <code className="flex-1 text-xs text-zinc-300 break-all">{cmd}</code>
      <button
        onClick={handleCopy}
        aria-label={label}
        className="shrink-0 text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
      >
        {copied ? '✓' : '⧉'}
      </button>
    </div>
  )
}

export default function PluginDetail({ plugin, onClose }: Props) {
  const installCmd = `claude plugin install ${plugin.id}`

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-zinc-100">{plugin.displayName}</h2>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE[plugin.type]}`}>
            {plugin.type}
          </span>
          <span className="text-xs text-zinc-500">v{plugin.version}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-300 leading-relaxed">{plugin.description}</p>

      {/* Install — marketplace already configured */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Install</p>
        <CopyRow cmd={installCmd} label="Copy install command" />
      </div>

      {/* Install — first time, no marketplace yet */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">First time setup</p>
        <p className="text-xs text-zinc-500">Run both commands in order:</p>
        <CopyRow cmd={MARKETPLACE_CMD} label="Copy add marketplace command" />
        <CopyRow cmd={installCmd} label="Copy install command" />
      </div>

      {/* Source link */}
      <a
        href={`${REPO_GITHUB_BASE}/${plugin.path}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        View on GitHub →
      </a>
    </div>
  )
}
