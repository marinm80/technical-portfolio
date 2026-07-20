import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle, MailWarning } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Seo from "../components/Seo";
import { profile } from "../data/profile";
import { isEmailConfigured, sendContactEmail } from "../services/email";

function makeContactSchema(t: TFunction) {
  return z.object({
    name: z.string().min(2, t('contact.validation.nameMin')),
    email: z.string().email(t('contact.validation.emailInvalid')),
    message: z.string().min(10, t('contact.validation.messageMin')),
  });
}

type ContactFormValues = z.infer<ReturnType<typeof makeContactSchema>>;

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);

  // `t` cambia de identidad al cambiar el idioma, regenerando los mensajes de validación.
  const contactSchema = useMemo(() => makeContactSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  // El resolver se regenera con el nuevo idioma (arriba), pero react-hook-form
  // no re-valida por sí solo los campos que ya tenían error — sin esto, el
  // mensaje queda "congelado" en el idioma en que se disparó originalmente.
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      void trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo debe re-disparar por cambio de idioma, no por cada cambio de `errors`/`trigger`.
  }, [i18n.language]);

  const onSubmit = async (data: ContactFormValues) => {
    setSendError(false);
    try {
      await sendContactEmail(data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      setSendError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <Seo title={t('meta.contact.title')} description={t('meta.contact.description')} canonicalPath="/contact" />

      <div>
        <h1 className="text-3xl font-bold mb-2">{t('contact.title')}</h1>
        <p className="text-content-muted">{t('contact.subtitle')}</p>
      </div>

      <div className="bg-surface-alt border border-edge p-6 sm:p-8 rounded-xl">
        {!isEmailConfigured() ? (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <MailWarning className="w-12 h-12 text-content-muted" />
            <p className="text-content-muted">
              {t('contact.notConfigured')}{" "}
              <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
                {profile.email}
              </a>
            </p>
          </div>
        ) : isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-4"
          >
            <CheckCircle className="w-16 h-16 text-emerald-500" />
            <h3 className="text-xl font-bold text-content-strong">{t('contact.success.title')}</h3>
            <p className="text-content-muted">{t('contact.success.message')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-content">{t('contact.name')}</label>
              <input
                {...register("name")}
                id="name"
                className="w-full bg-surface border border-edge rounded-lg px-4 py-2.5 text-content-strong focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder={t('contact.placeholder.name')}
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-content">{t('contact.email')}</label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="w-full bg-surface border border-edge rounded-lg px-4 py-2.5 text-content-strong focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder={t('contact.placeholder.email')}
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-content">{t('contact.message')}</label>
              <textarea
                {...register("message")}
                id="message"
                rows={5}
                className="w-full bg-surface border border-edge rounded-lg px-4 py-2.5 text-content-strong focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                placeholder={t('contact.placeholder.message')}
              />
              {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
            </div>

            {sendError && (
              <p className="text-red-400 text-sm">
                {t('contact.errorSend', { email: profile.email })}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-content-strong text-surface px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('contact.submitting') : t('contact.submit')}
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
