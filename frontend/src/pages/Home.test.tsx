import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/test-utils';
import Home from './Home';
import { profile } from '../data/profile';

describe('Home Page', () => {
  it('renders the main title', () => {
    render(<Home />);
    // Default language is 'es', so we expect Spanish text
    expect(screen.getByText('Ingeniero de Software')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Home />);
    expect(screen.getByText('especializado en React y Node.js')).toBeInTheDocument();
  });

  it('renders the bio paragraph', () => {
    render(<Home />);
    expect(screen.getByText(/Transformo problemas complejos/)).toBeInTheDocument();
  });

  it('renders the "View Experience" CTA link', () => {
    render(<Home />);
    const ctaLink = screen.getByText('Ver Experiencia');
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink.closest('a')).toHaveAttribute('href', '/experience');
  });

  it('renders the LinkedIn link', () => {
    render(<Home />);
    const linkedinLink = screen.getByText('LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('renders the "Stack Principal" section heading', () => {
    render(<Home />);
    expect(screen.getByText('Stack Principal')).toBeInTheDocument();
  });

  it('renders all technology tags from the profile', () => {
    render(<Home />);
    for (const tech of profile.stack) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });
});
