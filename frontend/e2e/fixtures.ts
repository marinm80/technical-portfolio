import { test as base, expect, type Page, type Request, type Route } from "@playwright/test";
import {
  COVER_PNG,
  PORTFOLIO_CATEGORY_ID,
  WP_ORIGIN,
  blogPosts,
  projectPosts,
  projectTags,
} from "./wp-data";

export type Language = "es" | "en";
export type Theme = "dark" | "light";

interface SiteOptions {
  language: Language;
  theme: Theme | null;
  wordpressStatus: number;
  emailStatus: number;
}

interface SiteFixtures {
  emailRequests: Request[];
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

function wordpressResponse(route: Route, url: URL, status: number) {
  if (url.pathname.startsWith("/media/")) {
    return route.fulfill({ status: 200, contentType: "image/png", body: COVER_PNG });
  }
  if (status !== 200) return json(route, { code: "error" }, status);
  const params = url.searchParams;
  if (url.pathname === "/wp-json/wp/v2/categories") {
    return json(route, params.get("slug") === "proyectos" ? [{ id: PORTFOLIO_CATEGORY_ID }] : []);
  }
  if (url.pathname === "/wp-json/wp/v2/tags") {
    const requested = (params.get("slug") ?? "").split(",");
    return json(route, projectTags.filter((tag) => requested.includes(tag.slug)));
  }
  if (url.pathname === "/wp-json/wp/v2/posts" && params.has("tags")) {
    const requested = (params.get("tags") ?? "").split(",").map(Number);
    return json(route, projectPosts.filter((post) => post.tags.some((id) => requested.includes(id))));
  }
  if (url.pathname === "/wp-json/wp/v2/posts") {
    return json(route, params.get("categories") === String(PORTFOLIO_CATEGORY_ID) ? blogPosts : []);
  }
  return json(route, [], 404);
}

async function isolateNetwork(page: Page, options: SiteOptions, emailRequests: Request[]) {
  await page.route("**/*", (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === "localhost") return route.continue();
    if (url.origin === WP_ORIGIN) return wordpressResponse(route, url, options.wordpressStatus);
    if (url.hostname === "api.emailjs.com") {
      emailRequests.push(request);
      return route.fulfill({ status: options.emailStatus, contentType: "text/plain", body: "OK" });
    }
    return route.abort();
  });
}

export const test = base.extend<SiteOptions & SiteFixtures>({
  language: ["es", { option: true }],
  theme: ["dark" as Theme | null, { option: true }],
  wordpressStatus: [200, { option: true }],
  emailStatus: [200, { option: true }],
  emailRequests: async ({}, provide) => {
    await provide([]);
  },
  page: async ({ page, emailRequests, language, theme, wordpressStatus, emailStatus }, provide) => {
    await isolateNetwork(page, { language, theme, wordpressStatus, emailStatus }, emailRequests);
    await page.addInitScript(
      ([lng, th]) => {
        if (sessionStorage.getItem("characterization-seeded")) return;
        localStorage.setItem("i18nextLng", lng);
        if (th) localStorage.setItem("theme", th);
        sessionStorage.setItem("characterization-seeded", "1");
      },
      [language, theme] as const,
    );
    await provide(page);
  },
});

export { expect };

export async function openMenuIfCollapsed(page: Page) {
  const openMenu = page.getByRole("button", { name: "Open Menu" });
  if (await openMenu.isVisible()) await openMenu.click();
}
