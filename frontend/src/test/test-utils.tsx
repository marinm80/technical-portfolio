import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';
import '../i18n'; // Initialize i18n for tests

/**
 * Custom render that wraps components with all required providers.
 * Use this instead of @testing-library/react's render in every test.
 */
function AllProviders({ children }: { children: ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from RTL, override render
export * from '@testing-library/react';
export { customRender as render };
