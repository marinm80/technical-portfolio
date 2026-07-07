import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isEmailConfigured, sendContactEmail } from './email';
import emailjs from '@emailjs/browser';

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }) },
}));

const message = { name: 'Ana', email: 'ana@example.com', message: 'Hola, esto es una prueba.' };

describe('email service', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.mocked(emailjs.send).mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isEmailConfigured is false when any key is missing', () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'svc');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'tpl');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', '');
    expect(isEmailConfigured()).toBe(false);
  });

  it('isEmailConfigured is true with all three keys', () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'svc');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'tpl');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'pk');
    expect(isEmailConfigured()).toBe(true);
  });

  it('sendContactEmail rejects when not configured', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', '');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', '');
    await expect(sendContactEmail(message)).rejects.toThrow(/not configured/);
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it('sendContactEmail delegates to emailjs with the template params', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'svc');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'tpl');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'pk');

    await sendContactEmail(message);

    expect(emailjs.send).toHaveBeenCalledWith('svc', 'tpl', { ...message }, { publicKey: 'pk' });
  });
});
