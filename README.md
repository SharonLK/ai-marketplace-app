# Ofek 324 Claude Code Marketplace

A read-only plugin browser for the [ai-marketplace](https://github.com/SharonLK/ai-marketplace) repository. Discover, filter, search, and copy install commands for Claude Code plugins — no backend required.

## Features

- **Plugin catalog** — browse all available plugins in a responsive card grid
- **Filter by type** — skill, hook, mcp-server, agent, commands (with per-type counts)
- **Fuzzy search** — matches plugin names (fuzzy) and descriptions (substring), with match highlighting
- **Sort** — Default, A→Z, Z→A
- **Starred plugins** — star/unstar any plugin; starred cards float to the top and persist across sessions
- **Plugin detail modal** — copy install commands for user scope or project scope
- **URL deep links** — share a direct link to any plugin via `/#<plugin-id>`
- **Light / dark theme** — toggle via the settings gear; preference saved in `localStorage`
- **Keyboard shortcuts** — press `/` to focus search, `Esc` to close the modal, `?` button for the full list

## Data flow

No backend. On load, `loadAllPlugins()` fetches two things from the GitHub CDN:

1. `marketplace.json` — the plugin index listing all plugin sources
2. Each plugin's `plugin.json` manifest — fetched in parallel

The results are merged into a `Plugin[]` array held in top-level `App` state.

## Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI and state |
| Vite | Dev server and build |
| Tailwind CSS 3 | Styling (dark mode via `class` strategy) |
| Vitest + Testing Library | Unit and integration tests |

## Getting started

```bash
npm install
npm run dev        # starts at localhost:5173
```

## Commands

```bash
npm run dev        # development server
npm run build      # type-check + production build
npm run test       # run all tests (vitest)
npm run test:watch # run tests in watch mode
```

## Installing a plugin

The modal for each plugin shows the two commands you need:

```bash
# 1. Register the marketplace (once per machine)
claude plugin marketplace add https://github.com/SharonLK/ai-marketplace

# 2a. Install for your user (all projects)
claude plugin install <plugin-id>

# 2b. Install for the current project only
claude plugin install --scope project <plugin-id>
```

## Project structure

```
src/
├── api.ts              # loadAllPlugins() — fetches and merges plugin data
├── fuzzy.ts            # fuzzyMatch() — returns matched character indices
├── types.ts            # Plugin, PluginType, MarketplaceIndex
├── App.tsx             # top-level state (plugins, status, selectedPlugin, theme)
└── components/
    ├── Header.tsx          # title + GitHub link + theme settings dropdown
    ├── FilterBar.tsx       # search input, type toggles, sort select, ? button
    ├── PluginCard.tsx      # card with fuzzy-highlighted name, substring-highlighted description, star button
    ├── SkeletonCard.tsx    # loading placeholder
    ├── Modal.tsx           # focus-trapped dialog (Escape / backdrop closes)
    ├── PluginDetail.tsx    # install commands + GitHub link
    └── ShortcutsModal.tsx  # keyboard shortcuts overlay
```

## Tests

43 tests across 6 suites covering `fuzzy`, `api`, `FilterBar`, `Modal`, `CatalogPage`, and `App`.

```bash
npm run test
```
