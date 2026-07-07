import "@testing-library/jest-dom/vitest";
import { beforeAll, vi } from "vitest";
import i18n from "../i18n";

// jsdom no implementa matchMedia (lo usa ThemeContext).
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom reporta navigator.language = 'en-US'; los tests asumen español.
beforeAll(async () => {
  await i18n.changeLanguage("es");
});
