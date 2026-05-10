import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Experience from './Experience';

describe('Experience Page', () => {
  it('renders the page title', () => {
    render(<Experience />);
    expect(screen.getByText('Experiencia')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Experience />);
    expect(screen.getByText(/resumen de mi trayectoria profesional/)).toBeInTheDocument();
  });

  it('renders all experience cards with roles', () => {
    render(<Experience />);
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
  });

  it('renders company names', () => {
    render(<Experience />);
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Startup Inc')).toBeInTheDocument();
  });

  it('renders period badges', () => {
    render(<Experience />);
    expect(screen.getByText('2021 — Presente')).toBeInTheDocument();
    expect(screen.getByText('2018 — 2021')).toBeInTheDocument();
  });

  it('initially shows only 2 description items per card', () => {
    render(<Experience />);
    // First card has 5 items, only 2 should be visible initially
    expect(screen.getByText(/migración de una arquitectura monolítica/)).toBeInTheDocument();
    expect(screen.getByText(/sistema de diseño utilizando React/)).toBeInTheDocument();
    // Third item should NOT be visible initially
    expect(screen.queryByText(/Core Web Vitals/)).not.toBeInTheDocument();
  });

  it('expands to show all items when "Ver más" is clicked', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    const expandButtons = screen.getAllByText('Ver más');
    await user.click(expandButtons[0]);

    // Now the third, fourth and fifth items should be visible
    expect(screen.getByText(/Core Web Vitals/)).toBeInTheDocument();
    expect(screen.getByText(/Mentoricé a nuevos ingenieros/)).toBeInTheDocument();
  });

  it('shows "Ver menos" button after expanding', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    const expandButtons = screen.getAllByText('Ver más');
    await user.click(expandButtons[0]);

    expect(screen.getByText('Ver menos')).toBeInTheDocument();
  });

  it('toggles back to "Ver más" after collapsing', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    const expandButtons = screen.getAllByText('Ver más');
    await user.click(expandButtons[0]);

    const collapseButton = screen.getByText('Ver menos');
    await user.click(collapseButton);

    // The "Ver más" button should reappear for the first card
    await waitFor(() => {
      expect(screen.getAllByText('Ver más')).toHaveLength(2);
    });
  });
});
