import { useState } from 'react'
import type { Plugin, PluginType } from '../types'
import { fuzzyMatch } from '../fuzzy'
import Header from './Header'
import PluginCard from './PluginCard'
import FilterBar from './FilterBar'

interface Props {
  plugins: Plugin[]
  onSelectPlugin: (p: Plugin) => void
}

export default function CatalogPage({ plugins, onSelectPlugin }: Props) {
  const [activeTypes, setActiveTypes] = useState<PluginType[]>([])
  const [search, setSearch] = useState('')

  function handleToggleType(t: PluginType) {
    setActiveTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const filtered = plugins
    .filter(p => activeTypes.length === 0 || activeTypes.includes(p.type))
    .filter(p =>
      !search ||
      fuzzyMatch(search, p.displayName) !== null
    )

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <FilterBar
            total={plugins.length}
            filtered={filtered.length}
            activeTypes={activeTypes}
            onToggleType={handleToggleType}
            search={search}
            onSearch={setSearch}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(plugin => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onOpen={() => onSelectPlugin(plugin)}
              search={search}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
