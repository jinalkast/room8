import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
})) 