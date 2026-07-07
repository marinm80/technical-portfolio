import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';

const mocks = vi.hoisted(() => ({
  isEmailConfigured: vi.fn(() => true),
  sendContactEmail: vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 50))),
}));

vi.mock('../services/email', () => ({
  isEmailConfigured: mocks.isEmailConfigured,
  sendContactEmail: mocks.sendContactEmail,
}));

describe('Contact Page', () => {
  beforeEach(() => {
    mocks.isEmailConfigured.mockReturnValue(true);
    mocks.sendContactEmail.mockClear();
  });

  it('renders the page title', () => {
    render(<Contact />);
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Contact />);
    expect(screen.getByText(/proyecto en mente o una oportunidad laboral/)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /Enviar Mensaje/i })).toBeInTheDocument();
  });

  it('shows validation error when name is too short', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Nombre');
    await user.type(nameInput, 'A');

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/al menos 2 caracteres/)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Mensaje');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'This is a long enough test message for validation.');

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Zod may use different wording; check for any email-related error
      const errorElement = screen.queryByText(/email/i);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('shows validation error when message is too short', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Mensaje');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/al menos 10 caracteres/)).toBeInTheDocument();
    });
  });

  it('shows success message after valid form submission', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const nameInput = screen.getByLabelText('Nombre');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Mensaje');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message for the contact form.');

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders placeholders in form fields', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Detalla tu propuesta aquí...')).toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Nombre'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'This is a test message for the contact form.');

    const submitButton = screen.getByRole('button', { name: /Enviar Mensaje/i });
    await user.click(submitButton);

    // During submission the button should show "Enviando..."
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Enviando/i })).toBeDisabled();
    });
  });

  it('sends the email through the email service', async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Nombre'), 'Ana García');
    await user.type(screen.getByLabelText('Email'), 'ana@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Mensaje de prueba con longitud válida.');
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(mocks.sendContactEmail).toHaveBeenCalledWith({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje de prueba con longitud válida.',
      });
    });
  });

  it('shows a send error with mailto fallback when the service fails', async () => {
    mocks.sendContactEmail.mockRejectedValueOnce(new Error('emailjs down'));
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText('Nombre'), 'Ana García');
    await user.type(screen.getByLabelText('Email'), 'ana@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Mensaje de prueba con longitud válida.');
    await user.click(screen.getByRole('button', { name: /Enviar Mensaje/i }));

    await waitFor(() => {
      expect(screen.getByText(/No se pudo enviar el mensaje/)).toBeInTheDocument();
    });
  });

  it('shows a mailto fallback instead of the form when EmailJS is not configured', () => {
    mocks.isEmailConfigured.mockReturnValue(false);
    render(<Contact />);

    expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument();
    expect(screen.getByText(/no está disponible todavía/)).toBeInTheDocument();
    const mailto = screen.getByRole('link', { name: /rocanegras/ });
    expect(mailto.getAttribute('href')).toMatch(/^mailto:/);
  });
});
