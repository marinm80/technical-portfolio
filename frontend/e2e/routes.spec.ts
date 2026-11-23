import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Language } from "./fixtures";
import type { Page } from "@playwright/test";

const ROUTES = [
  { slug: "home", path: "/", ready: (page: Page) => page.getByRole("heading", { level: 1 }) },
  { slug: "projects", path: "/projects", ready: (page: Page) => page.getByRole("link", { name: /Diseño del Task Manager/ }) },
  { slug: "blog", path: "/blog", ready: (page: Page) => page.getByText("Arquitectura por capas en React") },
  { slug: "contact", path: "/contact", ready: (page: Page) => page.getByRole("button", { name: /Enviar Mensaje|Send Message/ }) },
] as const;

const LANGUAGES: Language[] = ["es", "en"];

async function pageFacts(page: Page) {
  return page.evaluate(() => ({
    path: location.pathname,
    title: document.title,
    lang: document.documentElement.lang,
    darkClass: document.documentElement.classList.contains("dark"),
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent?.replace(/\s+/g, " ").trim()),
  }));
}

for (const language of LANGUAGES) {
  test.describe(`golden master ${language}`, () => {
    test.use({ language });

    for (const route of ROUTES) {
      test(`${route.slug} conserva título, metadatos, árbol accesible y resultado de axe`, async ({ page }, testInfo) => {
        await page.goto(route.path);
        await expect(route.ready(page)).toBeVisible();
        await page.waitForLoadState("networkidle");

        const name = `${route.slug}-${language}-${testInfo.project.name}`;
        expect(JSON.stringify(await pageFacts(page), null, 2)).toMatchSnapshot(`${name}.facts.json`);
        await expect(page.locator("body")).toMatchAriaSnapshot({ name: `${name}.aria.yml` });

        const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const violations = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
        expect(JSON.stringify(violations, null, 2)).toMatchSnapshot(`${name}.axe.json`);
      });

      test(`${route.slug} conserva su aspecto visual @visual`, async ({ page }) => {
        await page.goto(route.path);
        await expect(route.ready(page)).toBeVisible();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot(`${route.slug}-${language}.png`, { fullPage: true, animations: "disabled" });
      });
    }
  });
}
