const { test, expect } = require('@playwright/test');

test.describe('SEO — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('JSON-LD structured data is present and valid', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd);
    expect(data['@type']).toBe('GymOrSportsActivityLocation');
    expect(data.name).toBe('Ballard CrossFit');
    expect(data.telephone).toBe('+1-206-383-2020');
    expect(data.address.streetAddress).toBe('6419 15th Ave NW');
    expect(data.geo.latitude).toBe(47.6755);
    expect(data.geo.longitude).toBe(-122.3766);
    expect(data.openingHoursSpecification.length).toBeGreaterThan(0);
  });

  test('Open Graph tags are present', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Ballard CrossFit/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /hero-bg/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://ballardcrossfit.com/');
  });

  test('Twitter Card tags are present', async ({ page }) => {
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /Ballard CrossFit/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /hero-bg/);
  });

  test('canonical URL is correct', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ballardcrossfit.com/');
  });

  test('title and meta description are set', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Ballard CrossFit');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  });
});

test.describe('SEO — Schedule page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schedule');
  });

  test('Open Graph tags are present', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Schedule/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://ballardcrossfit.com/schedule');
  });

  test('canonical URL is correct', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ballardcrossfit.com/schedule');
  });

  test('title is set', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Schedule');
  });

  test('Book a Class nav link points to /schedule', async ({ page }) => {
    const cta = page.locator('.nav-cta');
    await expect(cta).toHaveAttribute('href', '/schedule');
  });
});
