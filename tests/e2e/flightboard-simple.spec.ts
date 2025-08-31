import { test, expect } from '@playwright/test'

test.describe('FlightBoard Core Functionality', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    
    // Wait for network to settle
    await page.waitForLoadState('networkidle')
    
    // Check that the main app container exists
    await expect(page.locator('body')).toBeVisible()
    
    // Check for tabs (departure/arrival)
    const tabs = page.locator('[role="tablist"]')
    await expect(tabs).toBeVisible()
  })

  test('should display flight data in tables', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for table to be visible
    await page.waitForSelector('table', { timeout: 10000 })
    
    // Check that table exists
    const table = page.locator('table').first()
    await expect(table).toBeVisible()
    
    // Check for table headers
    const headers = page.locator('thead th')
    const headerCount = await headers.count()
    expect(headerCount).toBeGreaterThan(0)
  })

  test('should switch between departure and arrival tabs', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find tabs
    const departureTab = page.locator('[role="tab"]').filter({ hasText: /departure/i }).first()
    const arrivalTab = page.locator('[role="tab"]').filter({ hasText: /arrival/i }).first()
    
    // Check both tabs exist
    await expect(departureTab).toBeVisible()
    await expect(arrivalTab).toBeVisible()
    
    // Click arrival tab
    await arrivalTab.click()
    
    // Verify tab state changed
    await expect(arrivalTab).toHaveAttribute('data-state', 'active')
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept and fail API calls
    await page.route('**/api/flights**', route => {
      route.abort('failed')
    })
    
    // Navigate to the app
    await page.goto('/')
    
    // App should still render without crashing
    await expect(page.locator('body')).toBeVisible()
    
    // Tabs should still be visible
    const tabs = page.locator('[role="tablist"]')
    await expect(tabs).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[role="tablist"]')).toBeVisible()
  })
})