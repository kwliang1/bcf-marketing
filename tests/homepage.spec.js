const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero renders with logo, heading, and CTAs', async ({ page }) => {
    await expect(page.locator('.hero-logo')).toBeVisible();
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('.hero-cta .btn-primary')).toBeVisible();
    await expect(page.locator('.hero-cta .btn-outline')).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const toggle = page.locator('#navToggle');
    const menu = page.locator('#navMenu');
    await toggle.click();
    await expect(menu).toHaveClass(/active/);
    await toggle.click();
    await expect(menu).not.toHaveClass(/active/);
  });

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.click('#navToggle');
    await expect(page.locator('#navMenu')).toHaveClass(/active/);
    await page.click('.nav-menu a[href="#about"]');
    await expect(page.locator('#navMenu')).not.toHaveClass(/active/);
  });

  test('signup modal opens and navigates all 3 screens', async ({ page }) => {
    await page.click('#signupBtn');
    await expect(page.locator('#signupModal')).toHaveClass(/active/);
    await expect(page.locator('#screen1')).toHaveClass(/active/);

    await page.click('.modal-option[data-path="membership"]');
    await expect(page.locator('#screen2')).toHaveClass(/active/);

    await page.click('.modal-plan-featured');
    await expect(page.locator('#screen3')).toHaveClass(/active/);

    const link = page.locator('#confirmLink');
    await expect(link).toHaveAttribute('href', /chalkitpro\.com/);
  });

  test('signup modal closes on backdrop click', async ({ page }) => {
    await page.click('#signupBtn');
    await expect(page.locator('#signupModal')).toHaveClass(/active/);
    await page.locator('#signupModal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#signupModal')).not.toHaveClass(/active/);
  });

  test('signup modal closes on Escape', async ({ page }) => {
    await page.click('#signupBtn');
    await expect(page.locator('#signupModal')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#signupModal')).not.toHaveClass(/active/);
  });

  test('signup modal back buttons work', async ({ page }) => {
    await page.click('#signupBtn');
    await page.click('.modal-option[data-path="trial"]');
    await expect(page.locator('#screen2')).toHaveClass(/active/);
    await page.click('#backTo1');
    await expect(page.locator('#screen1')).toHaveClass(/active/);
  });

  test('gallery lightbox opens and navigates', async ({ page }) => {
    const firstPhoto = page.locator('.gym-gallery img').first();
    await firstPhoto.scrollIntoViewIfNeeded();
    await firstPhoto.click();
    await expect(page.locator('#lightbox')).toHaveClass(/active/);

    await page.click('#lightboxNext');
    await page.click('#lightboxPrev');

    await page.click('#lightboxClose');
    await expect(page.locator('#lightbox')).not.toHaveClass(/active/);
  });

  test('gallery lightbox closes on Escape', async ({ page }) => {
    const firstPhoto = page.locator('.gym-gallery img').first();
    await firstPhoto.scrollIntoViewIfNeeded();
    await firstPhoto.click();
    await expect(page.locator('#lightbox')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox')).not.toHaveClass(/active/);
  });

  test('coach lightbox opens on photo click', async ({ page }) => {
    const coachPhoto = page.locator('.coach-photo img').first();
    await coachPhoto.scrollIntoViewIfNeeded();
    await coachPhoto.click();
    await expect(page.locator('.coach-lightbox-overlay')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.coach-lightbox-overlay')).not.toHaveClass(/active/);
  });

  test('all images load without 404s', async ({ page }) => {
    const failed = [];
    page.on('response', (res) => {
      if (res.url().includes('/images/') && res.status() >= 400) {
        failed.push(res.url());
      }
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });

  test('WebP sources are present in picture elements', async ({ page }) => {
    const sources = page.locator('picture source[type="image/webp"]');
    const count = await sources.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const srcset = await sources.nth(i).getAttribute('srcset');
      expect(srcset).toMatch(/\.webp$/);
    }
  });

  test('all sections are present', async ({ page }) => {
    for (const id of ['about', 'programs', 'coaches', 'testimonials', 'membership', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('drop-in link points to ChalkItPro', async ({ page }) => {
    const dropinBtn = page.locator('#dropin .btn-outline');
    await expect(dropinBtn).toHaveAttribute('href', /chalkitpro\.com\/dropIns/);
  });
});
