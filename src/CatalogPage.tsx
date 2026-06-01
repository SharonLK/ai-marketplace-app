import type { Plugin } from './types'

interface Props {
  plugins: Plugin[]
  status: 'loading' | 'error' | 'ok'
}

export default function CatalogPage({ plugins, status }: Props) {
  console.log(`[CatalogPage] status=${status} plugins=${plugins.length}`)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading plugins…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Failed to load plugins.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-2xl font-semibold text-gray-700">
        {plugins.length} plugins loaded
      </p>
    </div>
  )
}
