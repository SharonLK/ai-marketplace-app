import { useEffect } from 'react'

const SHORTCUTS = [
  { key: '/', description: 'Focus search' },
  { key: 'Esc', description: 'Close modal' },
]

interface Props {
  onClose: () => void
}

export default function ShortcutsModal({ onClose }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl p-5 w-64"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Keyboard shortcuts</h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts"
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <dl className="flex flex-col gap-2.5">
          {SHORTCUTS.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{description}</span>
              <kbd className="px-2 py-0.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-300 dark:border-zinc-600 shrink-0">
                {key}
              </kbd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
