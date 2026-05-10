import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog Page', () => {
  it('renders the page title', () => {
    render(<Blog />);
    expect(screen.getByText('Escritos & Artículos')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Blog />);
    expect(screen.getByText(/Pensamientos sobre ingeniería de software/)).toBeInTheDocument();
  });

  it('renders all article titles', () => {
    render(<Blog />);
    expect(screen.getByText('Understanding React Server Components')).toBeInTheDocument();
    expect(screen.getByText('Defensive Programming in TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Micro-frontends with Module Federation')).toBeInTheDocument();
  });

  it('renders article metadata (date and reading time)', () => {
    render(<Blog />);
    expect(screen.getByText(/May 15, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
    expect(screen.getByText(/12 min read/)).toBeInTheDocument();
  });

  it('renders article summaries', () => {
    render(<Blog />);
    expect(screen.getByText(/deep dive into how Server Components/)).toBeInTheDocument();
    expect(screen.getByText(/avoiding 'any' isn't enough/)).toBeInTheDocument();
  });

  it('does not show article content by default', () => {
    render(<Blog />);
    expect(screen.queryByText(/React Server Components \(RSC\)/)).not.toBeInTheDocument();
  });

  it('expands article content when "Leer artículo" is clicked', async () => {
    const user = userEvent.setup();
    render(<Blog />);

    const readButtons = screen.getAllByText('Leer artículo');
    await user.click(readButtons[0]);

    expect(screen.getByText(/React Server Components \(RSC\) representan/)).toBeInTheDocument();
  });

  it('shows "Cerrar artículo" button after expanding', async () => {
    const user = userEvent.setup();
    render(<Blog />);

    const readButtons = screen.getAllByText('Leer artículo');
    await user.click(readButtons[0]);

    expect(screen.getByText('Cerrar artículo')).toBeInTheDocument();
  });

  it('toggles back to "Leer artículo" after collapsing', async () => {
    const user = userEvent.setup();
    render(<Blog />);

    // Expand first
    const readButtons = screen.getAllByText('Leer artículo');
    await user.click(readButtons[0]);

    // Collapse
    const closeButton = screen.getByText('Cerrar artículo');
    await user.click(closeButton);

    // Button should toggle back
    await waitFor(() => {
      expect(screen.getAllByText('Leer artículo')).toHaveLength(3);
    });
  });

  it('renders the correct number of articles', () => {
    render(<Blog />);
    const readButtons = screen.getAllByText('Leer artículo');
    expect(readButtons).toHaveLength(3);
  });
});
