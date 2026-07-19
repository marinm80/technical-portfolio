import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLatestPosts, isBlogConfigured } from './wordpress';

const validPost = {
  id: 1,
  slug: 'hola-mundo',
  link: 'https://blog.example.com/hola-mundo',
  date: '2026-06-01T10:00:00',
  title: { rendered: 'Hola mundo' },
  excerpt: { rendered: '<p>Resumen</p>' },
};

describe('wordpress service', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('isBlogConfigured is true even without VITE_WP_API_URL (fallback URL)', () => {
    vi.stubEnv('VITE_WP_API_URL', '');
    expect(isBlogConfigured()).toBe(true);
  });

  it('isBlogConfigured is true with VITE_WP_API_URL', () => {
    vi.stubEnv('VITE_WP_API_URL', 'https://blog.example.com');
    expect(isBlogConfigured()).toBe(true);
  });

  it('getLatestPosts uses the default blog URL when the env var is empty', async () => {
    vi.stubEnv('VITE_WP_API_URL', '');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);

    await getLatestPosts(3);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://blog.rafaelmarin.dev/wp-json/wp/v2/categories?slug=proyectos&_fields=id'
    );
  });

  it('fetches and validates posts from the portfolio category only', async () => {
    vi.stubEnv('VITE_WP_API_URL', 'https://blog.example.com/');
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 3 }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [validPost] });
    vi.stubGlobal('fetch', fetchMock);

    const posts = await getLatestPosts(5);

    expect(posts).toHaveLength(1);
    expect(posts[0]!.title.rendered).toBe('Hola mundo');
    // La URL base pierde el slash final y filtra por la categoría resuelta
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://blog.example.com/wp-json/wp/v2/posts?categories=3&per_page=5&_embed=wp:featuredmedia&_fields=id,slug,link,date,title,excerpt,_links,_embedded'
    );
  });

  it('returns empty when the portfolio category does not exist', async () => {
    vi.stubEnv('VITE_WP_API_URL', 'https://blog.example.com');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getLatestPosts()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects on HTTP errors', async () => {
    vi.stubEnv('VITE_WP_API_URL', 'https://blog.example.com');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(getLatestPosts()).rejects.toThrow(/500/);
  });

  it('rejects when the response shape does not match the contract', async () => {
    vi.stubEnv('VITE_WP_API_URL', 'https://blog.example.com');
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 3 }] })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 'not-a-number', unexpected: true }],
        })
    );
    await expect(getLatestPosts()).rejects.toThrow();
  });
});
