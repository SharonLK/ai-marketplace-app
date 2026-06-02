import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('renders children inside a dialog', () => {
    render(<Modal onClose={() => {}}><p>hello</p></Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    render(<Modal onClose={onClose}><button>x</button></Modal>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<Modal onClose={onClose}><button>inside</button></Modal>)
    await userEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when panel content is clicked', async () => {
    const onClose = vi.fn()
    render(<Modal onClose={onClose}><button>inside</button></Modal>)
    await userEvent.click(screen.getByRole('button', { name: 'inside' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('traps focus: Tab from last element wraps to first', async () => {
    render(
      <Modal onClose={() => {}}>
        <button>first</button>
        <button>last</button>
      </Modal>
    )
    screen.getByRole('button', { name: 'last' }).focus()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'first' }))
  })

  it('traps focus: Shift+Tab from first element wraps to last', async () => {
    render(
      <Modal onClose={() => {}}>
        <button>first</button>
        <button>last</button>
      </Modal>
    )
    screen.getByRole('button', { name: 'first' }).focus()
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'last' }))
  })
})
