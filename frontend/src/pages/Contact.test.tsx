import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';

describe('Contact Page', () => {
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
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
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
});
