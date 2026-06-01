import { useEffect, useState } from 'react'
import { loadAllPlugins } from './api'
import type { Plugin } from './types'
import CatalogPage from './CatalogPage'

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

  return <CatalogPage plugins={plugins} status={status} />
}

export default App
