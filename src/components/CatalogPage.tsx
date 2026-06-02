import { useState } from 'react'
import type { Plugin, PluginType } from '../types'
import { fuzzyMatch } from '../fuzzy'
import Header from './Header'
import PluginCard from './PluginCard'
import FilterBar, { type SortOrder } from './FilterBar'
import SkeletonCard from './SkeletonCard'

interface Props {
  plugins: Plugin[]
  isLoading?: boolean
  onSelectPlugin: (p: Plugin) => void
}

export default function CatalogPage({ plugins, isLoading = false, onSelectPlugin }: Props) {
  const [activeTypes, setActiveTypes] = useState<PluginType[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('default')

  function handleToggleType(t: PluginType) {
    setActiveTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  function clearFilters() {
    setActiveTypes([])
    setSearch('')
  }

  const filtered = plugins
    .filter(p => activeTypes.length === 0 || activeTypes.includes(p.type))
    .filter(p =>
      !search ||
      fuzzyMatch(search, p.displayName) !== null ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice()
    .sort((a, b) => {
      if (sort === 'asc') return a.displayName.localeCompare(b.displayName)
      if (sort === 'desc') return b.displayName.localeCompare(a.displayName)
      return 0
    })

  function renderGrid() {
    if (isLoading) {
      return Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
    }
    if (filtered.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-zinc-300 font-medium">
            {search ? <>No results for "<span className="text-zinc-100">{search}</span>"</> : 'No plugins match your filters'}
          </p>
          <p className="text-sm text-zinc-500">Try a shorter search term or clear your filters</p>
          <button
            onClick={clearFilters}
            className="mt-1 px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 hover:bg-zinc-700 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )
    }
    return filtered.map(plugin => (
      <PluginCard
        key={plugin.id}
        plugin={plugin}
        onOpen={() => onSelectPlugin(plugin)}
        search={search}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <FilterBar
            total={plugins.length}
            filtered={isLoading ? 0 : filtered.length}
            activeTypes={activeTypes}
            onToggleType={handleToggleType}
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={setSort}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderGrid()}
        </div>
      </main>
    </div>
  )
}
