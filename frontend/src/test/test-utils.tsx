import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import '../i18n'; // Initialize i18n for tests

/**
 * Custom render that wraps components with all required providers.
 * Use this instead of @testing-library/react's render in every test.
 * A custom `wrapper` option replaces the default providers (useful for
 * routing tests that need MemoryRouter).
 */
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from RTL, override render
export * from '@testing-library/react';
export { customRender as render };
