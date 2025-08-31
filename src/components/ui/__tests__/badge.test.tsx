import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Badge } from '../badge'

describe('Badge', () => {
  it('should render with text content', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('should apply default variant styles', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('should apply secondary variant styles', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const badge = screen.getByText('Secondary')
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('should apply destructive variant styles', () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    const badge = screen.getByText('Destructive')
    expect(badge).toHaveClass('bg-destructive', 'text-white')
  })

  it('should apply outline variant styles', () => {
    render(<Badge variant="outline">Outline</Badge>)
    const badge = screen.getByText('Outline')
    expect(badge).toHaveClass('text-foreground')
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })

  it('should have data-slot attribute', () => {
    render(<Badge>Badge</Badge>)
    const badge = screen.getByText('Badge')
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('should render as span by default', () => {
    const { container } = render(<Badge>Span Badge</Badge>)
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent('Span Badge')
  })

  it('should forward additional props', () => {
    render(<Badge data-testid="test-badge" aria-label="Test Label">Props</Badge>)
    const badge = screen.getByTestId('test-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('aria-label', 'Test Label')
  })

  it('should render children including elements', () => {
    render(
      <Badge>
        <span>Child Element</span>
      </Badge>
    )
    expect(screen.getByText('Child Element')).toBeInTheDocument()
  })
})