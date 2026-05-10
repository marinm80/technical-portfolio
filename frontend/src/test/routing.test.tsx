import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Override the default render to use MemoryRouter for route testing
function renderWithRoute(route: string) {
  return render(
    <App />,
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      ),
    }
  );
}

describe('App Routing', () => {
  it('renders Home page on "/" route', () => {
    renderWithRoute('/');
    expect(screen.getByText('Ingeniero de Software')).toBeInTheDocument();
  });

  it('renders Experience page on "/experience" route', () => {
    renderWithRoute('/experience');
    expect(screen.getByRole('heading', { name: 'Experiencia' })).toBeInTheDocument();
  });

  it('renders Projects page on "/projects" route', () => {
    renderWithRoute('/projects');
    expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument();
  });

  it('renders Blog page on "/blog" route', () => {
    renderWithRoute('/blog');
    expect(screen.getByText('Escritos & Artículos')).toBeInTheDocument();
  });

  it('renders Contact page on "/contact" route', () => {
    renderWithRoute('/contact');
    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument();
  });

  it('redirects unknown routes to Home', () => {
    renderWithRoute('/unknown-page');
    expect(screen.getByText('Ingeniero de Software')).toBeInTheDocument();
  });
});
