import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { GithubIcon } from './GithubIcon';
import { LinkedinIcon } from './LinkedinIcon';

describe('Icon Components', () => {
  describe('GithubIcon', () => {
    it('renders an SVG element', () => {
      const { container } = render(<GithubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies the provided className', () => {
      const { container } = render(<GithubIcon className="w-6 h-6 text-red-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-6', 'h-6', 'text-red-500');
    });

    it('has correct viewBox', () => {
      const { container } = render(<GithubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('uses currentColor for stroke', () => {
      const { container } = render(<GithubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });
  });

  describe('LinkedinIcon', () => {
    it('renders an SVG element', () => {
      const { container } = render(<LinkedinIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('applies the provided className', () => {
      const { container } = render(<LinkedinIcon className="w-5 h-5" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-5', 'h-5');
    });

    it('has correct viewBox', () => {
      const { container } = render(<LinkedinIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('renders without className prop', () => {
      const { container } = render(<LinkedinIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).not.toHaveAttribute('class');
    });
  });
});
