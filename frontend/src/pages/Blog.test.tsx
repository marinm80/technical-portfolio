import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../test/test-utils';
import Blog from './Blog';
import type { WordPressPost } from '../types/wordpress';

const mocks = vi.hoisted(() => ({
  isBlogConfigured: vi.fn(),
  getLatestPosts: vi.fn(),
}));

vi.mock('../services/wordpress', () => ({
  isBlogConfigured: mocks.isBlogConfigured,
  getLatestPosts: mocks.getLatestPosts,
}));

const samplePosts: WordPressPost[] = [
  {
    id: 1,
    slug: 'primer-post',
    link: 'https://blog.example.com/primer-post',
    date: '2026-06-01T10:00:00',
    title: { rendered: 'Primer post del blog' },
    excerpt: { rendered: '<p>Un resumen con <strong>HTML</strong> embebido.</p>' },
  },
  {
    id: 2,
    slug: 'segundo-post',
    link: 'https://blog.example.com/segundo-post',
    date: '2026-05-15T09:00:00',
    title: { rendered: 'Segundo post' },
    excerpt: { rendered: '<p>Otro resumen.</p>' },
  },
];

describe('Blog Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title and description', () => {
    mocks.isBlogConfigured.mockReturnValue(false);
    render(<Blog />);
    expect(screen.getByText('Escritos & Artículos')).toBeInTheDocument();
    expect(screen.getByText(/Pensamientos sobre ingeniería de software/)).toBeInTheDocument();
  });

  it('shows the honest empty state when the blog is not configured', () => {
    mocks.isBlogConfigured.mockReturnValue(false);
    render(<Blog />);
    expect(screen.getByText('Próximamente')).toBeInTheDocument();
    expect(mocks.getLatestPosts).not.toHaveBeenCalled();
  });

  it('shows a loading state while fetching posts', () => {
    mocks.isBlogConfigured.mockReturnValue(true);
    mocks.getLatestPosts.mockReturnValue(new Promise(() => {}));
    render(<Blog />);
    expect(screen.getByText('Cargando artículos...')).toBeInTheDocument();
  });

  it('renders posts with sanitized HTML and external links', async () => {
    mocks.isBlogConfigured.mockReturnValue(true);
    mocks.getLatestPosts.mockResolvedValue(samplePosts);
    render(<Blog />);

    expect(await screen.findByText('Primer post del blog')).toBeInTheDocument();
    // El HTML del excerpt se elimina, queda solo texto
    expect(screen.getByText('Un resumen con HTML embebido.')).toBeInTheDocument();

    const readLinks = screen.getAllByText('Leer artículo');
    expect(readLinks).toHaveLength(2);
    expect(readLinks[0]!.closest('a')).toHaveAttribute('href', samplePosts[0]!.link);
    expect(readLinks[0]!.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('shows the empty state when the API returns no posts', async () => {
    mocks.isBlogConfigured.mockReturnValue(true);
    mocks.getLatestPosts.mockResolvedValue([]);
    render(<Blog />);
    expect(await screen.findByText('Próximamente')).toBeInTheDocument();
  });

  it('shows an error state when the API fails', async () => {
    mocks.isBlogConfigured.mockReturnValue(true);
    mocks.getLatestPosts.mockRejectedValue(new Error('network down'));
    render(<Blog />);
    expect(await screen.findByText(/No se pudieron cargar los artículos/)).toBeInTheDocument();
  });
});
