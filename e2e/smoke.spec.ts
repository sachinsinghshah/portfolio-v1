import { test, expect } from "@playwright/test";

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

test("every section renders and there are no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.locator("#projects .pcard")).toHaveCount(3);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("nav anchor scrolls to a section", async ({ page }) => {
  await page.goto("/");
  await page.locator('.nav-links a[href="#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("mobile menu toggles", async ({ page }) => {
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto("/");
  await expect(page.locator("#navLinks")).toBeHidden();
  await page.locator("#burger").click();
  await expect(page.locator("#navLinks")).toBeVisible();
});

test("contact form shows the success note on valid submit", async ({ page }) => {
  await page.goto("/");
  await page.fill('#contactForm input[name="name"]', "Jane Doe");
  await page.fill('#contactForm input[name="email"]', "jane@company.com");
  await page.fill('#contactForm textarea[name="message"]', "Hello there!");
  await page.locator('#contactForm button[type="submit"]').click();
  await expect(page.locator("#formNote")).toContainText("Message sent", { timeout: 4000 });
});

test("invalid submit shows a validation warning", async ({ page }) => {
  await page.goto("/");
  await page.locator('#contactForm button[type="submit"]').click();
  await expect(page.locator("#formNote")).toContainText("Please fill in");
});
