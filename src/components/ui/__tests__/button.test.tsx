import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../button'

describe('Button', () => {
  it('should render with text content', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  describe('variants', () => {
    it('should apply default variant styles', () => {
      render(<Button>Default</Button>)
      const button = screen.getByText('Default')
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('should apply destructive variant styles', () => {
      render(<Button variant="destructive">Destructive</Button>)
      const button = screen.getByText('Destructive')
      expect(button).toHaveClass('bg-destructive', 'text-white')
    })

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByText('Outline')
      expect(button).toHaveClass('border', 'bg-background')
    })

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByText('Secondary')
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByText('Ghost')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should apply link variant styles', () => {
      render(<Button variant="link">Link</Button>)
      const button = screen.getByText('Link')
      expect(button).toHaveClass('text-primary', 'underline-offset-4')
    })
  })

  describe('sizes', () => {
    it('should apply default size styles', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByText('Default Size')
      expect(button).toHaveClass('h-9', 'px-4', 'py-2')
    })

    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByText('Small')
      expect(button).toHaveClass('h-8', 'px-3')
    })

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByText('Large')
      expect(button).toHaveClass('h-10', 'px-6')
    })

    it('should apply icon size styles', () => {
      render(<Button size="icon" aria-label="Icon">🔍</Button>)
      const button = screen.getByLabelText('Icon')
      expect(button).toHaveClass('size-9')
    })
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })

  it('should have data-slot attribute', () => {
    render(<Button>Button</Button>)
    const button = screen.getByText('Button')
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('should render as button element by default', () => {
    const { container } = render(<Button>Button Element</Button>)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Button Element')
  })

  it('should forward additional props', () => {
    render(
      <Button 
        data-testid="test-button" 
        aria-label="Test Button"
        type="submit"
      >
        Props
      </Button>
    )
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Test Button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should render children including icons', () => {
    render(
      <Button>
        <svg className="icon">Icon</svg>
        Button with Icon
      </Button>
    )
    expect(screen.getByText('Button with Icon')).toBeInTheDocument()
    const svg = document.querySelector('svg.icon')
    expect(svg).toBeInTheDocument()
  })
})