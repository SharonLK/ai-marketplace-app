import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'
import { loadAllPlugins } from './api'
import type { Plugin } from './types'

vi.mock('./api', async importOriginal => ({
  ...(await importOriginal<typeof import('./api')>()),
  loadAllPlugins: vi.fn(),
}))

const mockPlugin: Plugin = {
  id: 'foo',
  type: 'skill',
  path: 'plugins/foo',
  name: 'foo',
  displayName: 'Foo Plugin',
  version: '1.0.0',
  description: 'Does foo things',
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(loadAllPlugins).mockReset()
  })

  it('shows skeleton cards while loading', () => {
    vi.mocked(loadAllPlugins).mockReturnValue(new Promise(() => {}))
    render(<App />)
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(6)
  })

  it('renders plugin cards after successful fetch', async () => {
    vi.mocked(loadAllPlugins).mockResolvedValue([mockPlugin])
    render(<App />)
    expect(await screen.findByText('Foo Plugin')).toBeInTheDocument()
  })

  it('shows error message when fetch fails', async () => {
    vi.mocked(loadAllPlugins).mockRejectedValue(new Error('network'))
    render(<App />)
    expect(await screen.findByText('Failed to load plugins')).toBeInTheDocument()
  })

  it('retry button refetches and shows plugins on success', async () => {
    vi.mocked(loadAllPlugins)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce([mockPlugin])
    render(<App />)
    await userEvent.click(await screen.findByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Foo Plugin')).toBeInTheDocument()
  })

  it('opens plugin detail modal when a card is clicked', async () => {
    vi.mocked(loadAllPlugins).mockResolvedValue([mockPlugin])
    render(<App />)
    await userEvent.click(await screen.findByText('Foo Plugin'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes modal when Escape is pressed', async () => {
    vi.mocked(loadAllPlugins).mockResolvedValue([mockPlugin])
    render(<App />)
    await userEvent.click(await screen.findByText('Foo Plugin'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
