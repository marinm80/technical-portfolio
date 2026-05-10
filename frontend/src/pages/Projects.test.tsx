import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Projects from './Projects';

describe('Projects Page', () => {
  it('renders the page title', () => {
    render(<Projects />);
    expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Projects />);
    expect(screen.getByText(/selección de sistemas y aplicaciones/)).toBeInTheDocument();
  });

  it('renders all project cards', () => {
    render(<Projects />);
    expect(screen.getByText('E-commerce Microservices')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Auth Gateway')).toBeInTheDocument();
  });

  it('renders project descriptions', () => {
    render(<Projects />);
    expect(screen.getByText(/arquitectura de microservicios/)).toBeInTheDocument();
    expect(screen.getByText(/Panel de control en tiempo real/)).toBeInTheDocument();
    expect(screen.getByText(/autenticación centralizado/)).toBeInTheDocument();
  });

  it('renders technology tags for each project', () => {
    render(<Projects />);
    // E-commerce tags
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('RabbitMQ')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();

    // Analytics Dashboard tags
    expect(screen.getByText('WebSockets')).toBeInTheDocument();

    // Auth Gateway tags
    expect(screen.getByText('JWT')).toBeInTheDocument();
    expect(screen.getByText('OAuth2')).toBeInTheDocument();
  });

  it('renders GitHub links with correct aria-label', () => {
    render(<Projects />);
    const githubLinks = screen.getAllByLabelText('Código fuente');
    expect(githubLinks).toHaveLength(3);
  });

  it('renders demo links with correct aria-label', () => {
    render(<Projects />);
    const demoLinks = screen.getAllByLabelText('Demo en vivo');
    expect(demoLinks).toHaveLength(3);
  });
});
