import { REPO_GITHUB_BASE } from '../api'

export default function Header() {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Ofek 324 Claude Code Marketplace</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Discover plugins for Claude Code</p>
        </div>
        <a
          href={REPO_GITHUB_BASE}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-zinc-400 hover:text-zinc-100 border border-zinc-700 rounded-md px-3 py-1.5 hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </header>
  )
}
