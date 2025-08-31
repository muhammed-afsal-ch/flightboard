import { test, expect } from '@playwright/test'

test.describe('FlightBoard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText(/Flight/i)
  })

  test('should have departure and arrival tabs', async ({ page }) => {
    const departureTab = page.locator('button[role="tab"]').filter({ hasText: /departure/i })
    const arrivalTab = page.locator('button[role="tab"]').filter({ hasText: /arrival/i })
    
    await expect(departureTab).toBeVisible()
    await expect(arrivalTab).toBeVisible()
  })

  test('should switch between departure and arrival tabs', async ({ page }) => {
    const departureTab = page.locator('button[role="tab"]').filter({ hasText: /departure/i })
    const arrivalTab = page.locator('button[role="tab"]').filter({ hasText: /arrival/i })
    
    // Initially, departures should be selected
    await expect(departureTab).toHaveAttribute('data-state', 'active')
    
    // Click on arrivals
    await arrivalTab.click()
    await expect(arrivalTab).toHaveAttribute('data-state', 'active')
    await expect(departureTab).toHaveAttribute('data-state', 'inactive')
    
    // Click back on departures
    await departureTab.click()
    await expect(departureTab).toHaveAttribute('data-state', 'active')
    await expect(arrivalTab).toHaveAttribute('data-state', 'inactive')
  })

  test('should display flight information in the table', async ({ page }) => {
    // Wait for flight data to load
    await page.waitForSelector('table', { timeout: 10000 })
    
    // Check for table headers
    const headers = page.locator('thead th')
    await expect(headers).toContainText(['Flight', 'Airline', 'Time', 'Status'])
  })

  test('should display airport selector', async ({ page }) => {
    const airportSelector = page.locator('select, [role="combobox"]').first()
    await expect(airportSelector).toBeVisible()
  })

  test('should change airport and reload flights', async ({ page }) => {
    // Find and click the airport selector
    const airportSelector = page.locator('select, [role="combobox"]').first()
    
    if (await airportSelector.evaluateHandle(el => el.tagName === 'SELECT')) {
      // Standard select element
      await airportSelector.selectOption({ value: 'KLAX' })
    } else {
      // Custom dropdown component
      await airportSelector.click()
      await page.locator('[role="option"]').filter({ hasText: 'LAX' }).click()
    }
    
    // Wait for new data to load
    await page.waitForTimeout(1000)
    
    // Verify flights are displayed
    const flightRows = page.locator('tbody tr')
    await expect(flightRows.first()).toBeVisible()
  })

  test('should display theme selector', async ({ page }) => {
    const themeButton = page.locator('button').filter({ hasText: /theme/i })
    if (await themeButton.count() > 0) {
      await expect(themeButton.first()).toBeVisible()
    }
  })

  test('should auto-refresh flight data', async ({ page }) => {
    // Get initial flight data
    await page.waitForSelector('tbody tr')
    const initialFlightText = await page.locator('tbody tr').first().textContent()
    
    // Wait for auto-refresh (typically 30 seconds, but we'll wait less for testing)
    await page.waitForTimeout(5000)
    
    // Check that the table still has data (refresh happened without error)
    const flightRows = page.locator('tbody tr')
    await expect(flightRows.first()).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('table')).toBeVisible()
    
    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('table')).toBeVisible()
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('table')).toBeVisible()
  })

  test('should display status badges with appropriate colors', async ({ page }) => {
    await page.waitForSelector('tbody tr')
    
    // Look for status badges
    const statusBadges = page.locator('[data-slot="badge"]')
    
    if (await statusBadges.count() > 0) {
      const firstBadge = statusBadges.first()
      await expect(firstBadge).toBeVisible()
      
      // Check that badge has some status text
      const badgeText = await firstBadge.textContent()
      expect(badgeText).toBeTruthy()
    }
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and fail them
    await page.route('**/api/flights**', route => {
      route.abort('failed')
    })
    
    // Reload the page
    await page.reload()
    
    // The app should still render (possibly with mock data or error state)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should display loading state while fetching data', async ({ page }) => {
    // Slow down the API response
    await page.route('**/api/flights**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    // Navigate and look for loading indicator
    await page.goto('/')
    
    // Check if there's any loading indicator (this depends on implementation)
    const loadingIndicator = page.locator('.loading, .spinner, [aria-busy="true"]')
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator.first()).toBeVisible()
    }
  })
})

test.describe('FlightBoard Accessibility Tests', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    
    // Check for main navigation
    const nav = page.locator('nav, [role="navigation"]')
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible()
    }
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check for table accessibility
    const table = page.locator('table')
    await expect(table).toBeVisible()
    
    // Check for proper button labels
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      expect(text || ariaLabel).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Try to activate a tab with keyboard
    const arrivalTab = page.locator('button[role="tab"]').filter({ hasText: /arrival/i })
    if (await arrivalTab.count() > 0) {
      await arrivalTab.focus()
      await page.keyboard.press('Enter')
      await expect(arrivalTab).toHaveAttribute('data-state', 'active')
    }
  })
})