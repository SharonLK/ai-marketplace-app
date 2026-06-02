# Ofek 324 Claude Code Marketplace

Read-only plugin browser for [ai-marketplace](https://github.com/SharonLK/ai-marketplace). Users discover, filter, search, and copy install commands for Claude Code plugins.

## Commands

```bash
npm run dev        # localhost:5173 — already running in a separate terminal, don't start it
npm run build      # type-check + production build
npm run test       # run all tests (vitest)
```

## Architecture

**Data flow:** No backend. `loadAllPlugins()` in `src/api.ts` fetches raw GitHub CDN URLs — first `.claude-plugin/marketplace.json` (plugin index), then all `plugin.json` manifests in parallel — and merges them into `Plugin[]` (`src/types.ts`). The base CDN URL is `REPO_GITHUB_BASE` in `api.ts`.

**State:** `App` owns `plugins[]`, `status`, `selectedPlugin`, `theme`. `CatalogPage` owns `activeTypes[]`, `search`, `sort`, `starred` (persisted to `localStorage`). Filtering is pure in-render — no derived state stored.

**Component tree:**
```
App  (plugins[], status, selectedPlugin, theme)
├── CatalogPage  (filter/search/sort/starred state)
│   ├── Header
│   ├── FilterBar   (type toggles + search input + sort + ? button)
│   ├── PluginCard[]  (click → onSelectPlugin, star button)
│   ├── SkeletonCard×6  (shown while isLoading)
│   └── ShortcutsModal  (shown on ? button click)
└── Modal  (focus trap, Escape/backdrop closes, role="dialog")
    └── PluginDetail  (install command copy, GitHub link)
```

**Search:** `src/fuzzy.ts` — `fuzzyMatch(query, text)` returns matched char indices for display name; description uses substring match. Both highlight matches in `<mark>`.

**Install command:** `claude plugin install <id>` — requires the marketplace to be registered first via `claude plugin marketplace add https://github.com/SharonLK/ai-marketplace`.

## Tests

Vitest + jsdom + @testing-library/react. 6 suites, 43 tests covering `fuzzy`, `api`, `FilterBar`, `Modal`, `CatalogPage`, `App`.
