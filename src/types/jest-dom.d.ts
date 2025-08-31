import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeDisabled(): R
      toBeEnabled(): R
      toBeVisible(): R
      toContainElement(element: HTMLElement | null): R
      toHaveStyle(css: string | Record<string, any>): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveFocus(): R
      toContainHTML(html: string): R
    }
  }
}

export {}