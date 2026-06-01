import type { Plugin } from '../types'
import Header from './Header'
import PluginCard from './PluginCard'

interface Props {
  plugins: Plugin[]
  onSelectPlugin: (p: Plugin) => void
}

export default function CatalogPage({ plugins, onSelectPlugin }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">{/* FilterBar — Task 05 */}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plugins.map(plugin => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onOpen={() => onSelectPlugin(plugin)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
