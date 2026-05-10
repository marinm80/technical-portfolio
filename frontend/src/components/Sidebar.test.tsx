import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Sidebar from './Sidebar';
import userEvent from '@testing-library/user-event';

describe('Sidebar Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: () => {},
  };

  it('renders the user name', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Tu Nombre')).toBeInTheDocument();
  });

  it('renders the role', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('renders all navigation links (in Spanish by default)', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('Experiencia')).toBeInTheDocument();
    expect(screen.getByText('Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Artículos')).toBeInTheDocument();
  });

  it('renders the contact link', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('renders the language toggle button', () => {
    render(<Sidebar {...defaultProps} />);
    // Default is 'es', so button shows 'English'
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByTitle('GitHub')).toBeInTheDocument();
    expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
  });

  it('navigation links have correct href', () => {
    render(<Sidebar {...defaultProps} />);
    const overviewLink = screen.getByText('Resumen').closest('a');
    const experienceLink = screen.getByText('Experiencia').closest('a');
    const projectsLink = screen.getByText('Proyectos').closest('a');
    const blogLink = screen.getByText('Artículos').closest('a');

    expect(overviewLink).toHaveAttribute('href', '/');
    expect(experienceLink).toHaveAttribute('href', '/experience');
    expect(projectsLink).toHaveAttribute('href', '/projects');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('toggles language when language button is clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar {...defaultProps} />);

    const langButton = screen.getByText('English');
    await user.click(langButton);

    // After toggling from 'es' to 'en', button should now show 'Español'
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('renders multiple interactive buttons', () => {
    render(<Sidebar {...defaultProps} />);
    // Sidebar should have at least: close button (mobile) + language toggle
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});
