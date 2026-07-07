import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Projects from './Projects';
import { projects } from '../data/projects';

describe('Projects Page', () => {
  it('renders the page title', () => {
    render(<Projects />);
    expect(screen.getByText('Proyectos Destacados')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Projects />);
    expect(screen.getByText(/selección de sistemas y aplicaciones/)).toBeInTheDocument();
  });

  it('renders a card per project in the data file', () => {
    render(<Projects />);
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('renders technology tags', () => {
    render(<Projects />);
    expect(screen.getAllByText('Docker').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('JWT')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders a GitHub link only for projects with a repo', () => {
    render(<Projects />);
    const githubLinks = screen.getAllByLabelText('Código fuente');
    const withGithub = projects.filter((p) => p.github);
    expect(githubLinks).toHaveLength(withGithub.length);
    for (const link of githubLinks) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('renders a live demo link only for projects with a live URL', () => {
    render(<Projects />);
    const demoLinks = screen.getAllByLabelText('Demo en vivo');
    const withLive = projects.filter((p) => p.live);
    expect(demoLinks).toHaveLength(withLive.length);
    for (const link of demoLinks) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\//);
    }
  });

  it('never renders placeholder "#" links', () => {
    render(<Projects />);
    const anchors = document.querySelectorAll('a[href="#"]');
    expect(anchors).toHaveLength(0);
  });
});
