import { useEffect, useRef, useState } from 'react'
import { loadAllPlugins } from './api'
import type { Plugin } from './types'
import CatalogPage from './components/CatalogPage'
import Modal from './components/Modal'
import PluginDetail from './components/PluginDetail'

type Status = 'loading' | 'error' | 'ok'
type Theme = 'light' | 'dark'

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const initialHash = useRef(window.location.hash.slice(1))
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )

  function changeTheme(next: Theme) {
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  function fetchPlugins() {
    setStatus('loading')
    setPlugins([])
    loadAllPlugins()
      .then(data => {
        setPlugins(data)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }

  useEffect(() => { fetchPlugins() }, [])

  // Open plugin from hash on initial load — reads initialHash (captured before effects run)
  // so Strict Mode double-invocation of the sync effect can't clear it first
  useEffect(() => {
    if (status !== 'ok' || plugins.length === 0) return
    const id = initialHash.current
    if (!id) return
    initialHash.current = '' // consume so retry-load doesn't reopen a closed modal
    const match = plugins.find(p => p.id === id)
    if (match) setSelectedPlugin(match)
  }, [status, plugins])

  // Sync hash with selected plugin
  useEffect(() => {
    if (selectedPlugin) {
      history.pushState(null, '', `#${selectedPlugin.id}`)
    } else {
      history.replaceState(null, '', window.location.pathname)
    }
  }, [selectedPlugin])

  // Back button closes modal
  useEffect(() => {
    function onPopState() {
      setSelectedPlugin(null)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 dark:text-red-400 text-lg">Failed to load plugins</p>
        <button
          onClick={fetchPlugins}
          className="px-4 py-2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <>
      <CatalogPage plugins={plugins} isLoading={status === 'loading'} onSelectPlugin={setSelectedPlugin} theme={theme} onChangeTheme={changeTheme} />
      {selectedPlugin && (
        <Modal onClose={() => setSelectedPlugin(null)}>
          <PluginDetail plugin={selectedPlugin} onClose={() => setSelectedPlugin(null)} />
        </Modal>
      )}
    </>
  )
}

export default App
