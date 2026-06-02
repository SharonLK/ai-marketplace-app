import { useEffect, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode
}

export default function Modal({ onClose, children }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      aria-label="Close modal"
    >
      <div
        className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
