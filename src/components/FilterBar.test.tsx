import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FilterBar from './FilterBar'
import type { PluginType } from '../types'

function renderBar(overrides: Partial<Parameters<typeof FilterBar>[0]> = {}) {
  const props = {
    total: 5,
    filtered: 3,
    activeTypes: [] as PluginType[],
    onToggleType: vi.fn(),
    search: '',
    onSearch: vi.fn(),
    ...overrides,
  }
  return { ...render(<FilterBar {...props} />), props }
}

describe('FilterBar', () => {
  it('displays correct plugin count', () => {
    renderBar({ total: 5, filtered: 3 })
    expect(screen.getByText('Showing 3 of 5 plugins')).toBeInTheDocument()
  })

  it('renders all 5 type toggle buttons', () => {
    renderBar()
    for (const label of ['Skill', 'Hook', 'MCP Server', 'Agent', 'Commands']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('active type has aria-pressed="true", inactive has "false"', () => {
    renderBar({ activeTypes: ['skill'] })
    expect(screen.getByRole('button', { name: 'Skill' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Hook' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('clicking a toggle calls onToggleType with the correct type', async () => {
    const onToggleType = vi.fn()
    renderBar({ onToggleType })
    await userEvent.click(screen.getByRole('button', { name: 'Hook' }))
    expect(onToggleType).toHaveBeenCalledWith('hook')
  })

  it('typing in search box calls onSearch', async () => {
    const onSearch = vi.fn()
    renderBar({ onSearch })
    await userEvent.type(screen.getByRole('textbox', { name: 'Search plugins' }), 'a')
    expect(onSearch).toHaveBeenCalledWith('a')
  })
})
