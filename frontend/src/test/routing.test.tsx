import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import App from '../App';

// Override the default render to use MemoryRouter for route testing
function renderWithRoute(route: string) {
  return render(
    <App />,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>
            {children}
          </MemoryRouter>
        </ThemeProvider>
      ),
    }
  );
}

// Las páginas se cargan con React.lazy, por eso se usa findByText (async).
describe('App Routing', () => {
  it('renders Home page on "/" route', async () => {
    renderWithRoute('/');
    expect(await screen.findByText('Ingeniero de Software', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('redirects the hidden "/experience" route to Home', async () => {
    renderWithRoute('/experience');
    expect(await screen.findByText('Ingeniero de Software', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('renders Projects page on "/projects" route', async () => {
    renderWithRoute('/projects');
    expect(await screen.findByText('Proyectos Destacados', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('renders Blog page on "/blog" route', async () => {
    renderWithRoute('/blog');
    expect(await screen.findByText('Escritos & Artículos', {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('renders Contact page on "/contact" route', async () => {
    renderWithRoute('/contact');
    expect(await screen.findByRole('heading', { name: 'Contacto' }, { timeout: 3000 })).toBeInTheDocument();
  });

  it('redirects unknown routes to Home', async () => {
    renderWithRoute('/unknown-page');
    expect(await screen.findByText('Ingeniero de Software', {}, { timeout: 3000 })).toBeInTheDocument();
  });
});
