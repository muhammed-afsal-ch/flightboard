import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_ENVIRONMENT = 'test'

// Mock fetch for tests
global.fetch = jest.fn()

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 0)
  return 0
})

global.cancelAnimationFrame = jest.fn()

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})