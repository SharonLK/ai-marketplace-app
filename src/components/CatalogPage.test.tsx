import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CatalogPage from './CatalogPage'
import type { Plugin } from '../types'

const makePlugin = (overrides: Partial<Plugin> = {}): Plugin => ({
  id: 'p1',
  type: 'skill',
  path: 'plugins/p1',
  name: 'p1',
  displayName: 'Test Plugin',
  version: '1.0.0',
  description: 'A test plugin',
  ...overrides,
})

const skillPlugin = makePlugin({ id: 'skill1', type: 'skill', displayName: 'Skill One' })
const hookPlugin = makePlugin({ id: 'hook1', type: 'hook', displayName: 'Hook One' })

describe('CatalogPage', () => {
  it('renders all plugins when no filters are active', () => {
    render(<CatalogPage plugins={[skillPlugin, hookPlugin]} onSelectPlugin={vi.fn()} />)
    expect(screen.getByText('Skill One')).toBeInTheDocument()
    expect(screen.getByText('Hook One')).toBeInTheDocument()
  })

  it('shows 6 skeleton cards when loading', () => {
    render(<CatalogPage plugins={[]} isLoading onSelectPlugin={vi.fn()} />)
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(6)
  })

  it('filters plugins by type when a toggle is active', async () => {
    render(<CatalogPage plugins={[skillPlugin, hookPlugin]} onSelectPlugin={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Skill' }))
    expect(screen.getByText('Skill One')).toBeInTheDocument()
    expect(screen.queryByText('Hook One')).not.toBeInTheDocument()
  })

  it('filters plugins by search query', async () => {
    render(<CatalogPage plugins={[skillPlugin, hookPlugin]} onSelectPlugin={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Search plugins' }), 'Skill')
    expect(screen.getByRole('heading', { name: 'Skill One' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hook One' })).not.toBeInTheDocument()
  })

  it('shows empty state when no plugins match filters', async () => {
    render(<CatalogPage plugins={[skillPlugin]} onSelectPlugin={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Search plugins' }), 'zzznomatch')
    expect(screen.getByText('No plugins match your filters')).toBeInTheDocument()
  })

  it('clear filters button restores all plugins', async () => {
    render(<CatalogPage plugins={[skillPlugin]} onSelectPlugin={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: 'Search plugins' }), 'zzznomatch')
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Skill One')).toBeInTheDocument()
  })

  it('calls onSelectPlugin when a card is clicked', async () => {
    const onSelectPlugin = vi.fn()
    render(<CatalogPage plugins={[skillPlugin]} onSelectPlugin={onSelectPlugin} />)
    await userEvent.click(screen.getByText('Skill One'))
    expect(onSelectPlugin).toHaveBeenCalledWith(skillPlugin)
  })
})
