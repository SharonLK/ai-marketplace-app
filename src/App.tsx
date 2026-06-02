import { useEffect, useState } from 'react'
import { loadAllPlugins } from './api'
import type { Plugin } from './types'
import CatalogPage from './components/CatalogPage'
import Modal from './components/Modal'
import PluginDetail from './components/PluginDetail'

type Status = 'loading' | 'error' | 'ok'

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)

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

  return (
    <>
      <CatalogPage plugins={plugins} onSelectPlugin={setSelectedPlugin} />
      {selectedPlugin && (
        <Modal onClose={() => setSelectedPlugin(null)}>
          <PluginDetail plugin={selectedPlugin} onClose={() => setSelectedPlugin(null)} />
        </Modal>
      )}
    </>
  )
}

export default App
