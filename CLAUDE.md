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

**State:** `App` owns top-level state (`plugins[]`, `status: 'loading'|'ok'|'error'`, `selectedPlugin`). `CatalogPage` owns filter/search state locally (`activeTypes[]`, `search` string). Filtering is pure in-render — no derived state stored.

**Component tree:**
```
App  (plugins[], status, selectedPlugin)
├── CatalogPage  (filter/search state)
│   ├── Header
│   ├── FilterBar   (type toggles + search input, aria-pressed)
│   ├── PluginCard[]  (click → onSelectPlugin)
│   └── SkeletonCard×6  (shown while isLoading)
└── Modal  (focus trap, Escape/backdrop closes, role="dialog")
    └── PluginDetail  (install command copy, artifact links, GitHub link)
```

**Search:** `src/fuzzy.ts` — `fuzzyMatch(query, text)` returns matched char indices; `PluginCard` wraps them in `<mark>` for highlighting.

**Install command:** `claude plugin install <id>` — requires the marketplace to be registered first via `claude plugin marketplace add https://github.com/SharonLK/ai-marketplace`.
## Tests

Vitest + jsdom + @testing-library/react. 7 suites, 50 tests covering `fuzzy`, `api`, `artifactLinks`, `FilterBar`, `Modal`, `CatalogPage`, `App`.
