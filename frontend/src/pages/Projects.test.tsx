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
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Express').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PostgreSQL').length).toBeGreaterThanOrEqual(1);
  });

  it('renders a "View Project" button per project, pointing to the live URL or the repo', () => {
    render(<Projects />);
    const viewProjectLinks = screen.getAllByText('Ver Proyecto').map((el) => el.closest('a'));
    expect(viewProjectLinks).toHaveLength(projects.length);
    for (const [index, link] of viewProjectLinks.entries()) {
      const project = projects[index];
      expect(link).toHaveAttribute('href', project.live ?? project.github);
      expect(link).toHaveAttribute('target', '_blank');
    }
  });

  it('renders a GitHub button only for projects with a repo', () => {
    render(<Projects />);
    const githubLinks = screen.getAllByText('GitHub').map((el) => el.closest('a'));
    const withGithub = projects.filter((p) => p.github);
    expect(githubLinks).toHaveLength(withGithub.length);
    for (const link of githubLinks) {
      expect(link?.getAttribute('href')).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('never renders placeholder "#" links', () => {
    render(<Projects />);
    const anchors = document.querySelectorAll('a[href="#"]');
    expect(anchors).toHaveLength(0);
  });
});
