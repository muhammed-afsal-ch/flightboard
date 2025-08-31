import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-blue-500')
    expect(result).toBe('px-2 py-1 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('should handle false conditions', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class')
  })

  it('should override conflicting Tailwind classes', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['px-2', 'py-1'], 'bg-blue-500')
    expect(result).toBe('px-2 py-1 bg-blue-500')
  })

  it('should handle undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'another-class')
    expect(result).toBe('base-class another-class')
  })

  it('should handle objects with boolean values', () => {
    const result = cn('base', {
      'text-red-500': true,
      'text-blue-500': false,
    })
    expect(result).toBe('base text-red-500')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should merge complex Tailwind utilities correctly', () => {
    const result = cn(
      'text-sm font-medium text-gray-900',
      'hover:bg-gray-100',
      'text-lg'
    )
    expect(result).toBe('font-medium text-gray-900 hover:bg-gray-100 text-lg')
  })
})