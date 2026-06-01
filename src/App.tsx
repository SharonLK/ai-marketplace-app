import { useEffect, useState } from 'react'
import { loadAllPlugins } from './api'
import type { Plugin } from './types'
import CatalogPage from './components/CatalogPage'

type Status = 'loading' | 'error' | 'ok'

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    loadAllPlugins()
      .then(data => {
        setPlugins(data)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading plugins…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-red-400">Failed to load plugins.</p>
      </div>
    )
  }

  return <CatalogPage plugins={plugins} onSelectPlugin={() => {}} />
}

export default App
