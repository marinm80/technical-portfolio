import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Debe ser un email válido."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Simulating EmailJS call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Mock Email Sent:", data);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Contacto</h1>
        <p className="text-slate-400">¿Tienes un proyecto en mente o una oportunidad laboral? Hablemos.</p>
      </div>

      <div className="bg-obsidian-light border border-obsidian-border p-6 sm:p-8 rounded-xl">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-4"
          >
            <CheckCircle className="w-16 h-16 text-emerald-500" />
            <h3 className="text-xl font-bold text-slate-100">¡Mensaje enviado!</h3>
            <p className="text-slate-400">Te responderé lo más pronto posible.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">Nombre</label>
              <input
                {...register("name")}
                id="name"
                className="w-full bg-obsidian border border-obsidian-border rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className="w-full bg-obsidian border border-obsidian-border rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-300">Mensaje</label>
              <textarea
                {...register("message")}
                id="message"
                rows={5}
                className="w-full bg-obsidian border border-obsidian-border rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                placeholder="Detalla tu propuesta aquí..."
              />
              {errors.message && <p className="text-red-400 text-sm">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 text-obsidian px-6 py-2.5 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
