const { test, expect } = require('@playwright/test');

test.describe('Schedule page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule');
    await page.waitForSelector('.week-grid, .day-view, .month-grid');
  });

  test('loads with week view by default', async ({ page }) => {
    await expect(page.locator('.week-grid')).toBeVisible();
    await expect(page.locator('.schedule-view-tab.active')).toHaveText('Week');
  });

  test('week view shows class cards with sign-up links', async ({ page }) => {
    const items = page.locator('.class-item');
    const count = await items.count();
    if (count > 0) {
      const firstSignUp = items.first().locator('.class-signup');
      await expect(firstSignUp).toBeVisible();
      const href = await firstSignUp.getAttribute('href');
      expect(href).toContain('classkiosk');
    }
  });

  test('switch to day view via tab', async ({ page }) => {
    await page.click('.schedule-view-tab[data-view="day"]');
    await expect(page.locator('.day-view')).toBeVisible();
    await expect(page.locator('.schedule-view-tab.active')).toHaveText('Day');
  });

  test('switch to month view via tab', async ({ page }) => {
    await page.click('.schedule-view-tab[data-view="month"]');
    await expect(page.locator('.month-grid')).toBeVisible();
    await expect(page.locator('.schedule-view-tab.active')).toHaveText('Month');
  });

  test('month day tap opens day view', async ({ page }) => {
    await page.click('.schedule-view-tab[data-view="month"]');
    await page.waitForSelector('.month-grid');
    const dayCell = page.locator('.month-day:not(.other-month)').first();
    const dateVal = await dayCell.getAttribute('data-date');
    await dayCell.click();
    await expect(page.locator('.day-view')).toBeVisible();
    await expect(page.locator('.schedule-view-tab.active')).toHaveText('Day');
  });

  test('browser back navigates from day to month view', async ({ page }) => {
    await page.click('.schedule-view-tab[data-view="month"]');
    await page.waitForSelector('.month-grid');
    await page.locator('.month-day:not(.other-month)').first().click();
    await expect(page.locator('.day-view')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.month-grid')).toBeVisible();
    await expect(page.locator('.schedule-view-tab.active')).toHaveText('Month');
  });

  test('prev/next navigation works', async ({ page }) => {
    const label = page.locator('.schedule-date-label');
    const initialText = await label.textContent();
    await page.click('#nextBtn');
    const nextText = await label.textContent();
    expect(nextText).not.toEqual(initialText);
    await page.click('#prevBtn');
    const backText = await label.textContent();
    expect(backText).toEqual(initialText);
  });

  test('today button resets to current date', async ({ page }) => {
    await page.click('#nextBtn');
    await page.click('#nextBtn');
    await page.click('#todayBtn');
    const hasToday = await page.locator('.is-today').count();
    expect(hasToday).toBeGreaterThan(0);
  });
});

test.describe('Homepage navigation', () => {
  test('Book a Class links to /schedule', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('.nav-cta');
    await expect(cta).toHaveAttribute('href', '/schedule');
  });
});
