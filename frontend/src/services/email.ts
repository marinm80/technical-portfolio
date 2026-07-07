import emailjs from "@emailjs/browser";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

function getConfig() {
  const env = import.meta.env;
  return {
    serviceId: env.VITE_EMAILJS_SERVICE_ID as string | undefined,
    templateId: env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
  };
}

export function isEmailConfigured(): boolean {
  const { serviceId, templateId, publicKey } = getConfig();
  return Boolean(serviceId && templateId && publicKey);
}

export async function sendContactEmail(data: ContactMessage): Promise<void> {
  const { serviceId, templateId, publicKey } = getConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured");
  }

  // La plantilla de EmailJS debe usar las variables {{name}}, {{email}} y {{message}}.
  await emailjs.send(serviceId, templateId, { ...data }, { publicKey });
}
