import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav.overview": "Overview",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.blog": "Writing",
      "nav.contact": "Contact",
      "home.title": "Software Engineer",
      "home.subtitle": "specialized in React & Node.js",
      "home.bio": "I transform complex problems into scalable and efficient systems. Focused on code quality, clean architectures, and exceptional user experiences.",
      "home.viewExp": "View Experience",
      "home.dlCV": "Download CV",
      "home.stack": "Main Stack"
    }
  },
  es: {
    translation: {
      "nav.overview": "Resumen",
      "nav.experience": "Experiencia",
      "nav.projects": "Proyectos",
      "nav.blog": "Artículos",
      "nav.contact": "Contacto",
      "home.title": "Ingeniero de Software",
      "home.subtitle": "especializado en React y Node.js",
      "home.bio": "Transformo problemas complejos en sistemas escalables y eficientes. Enfocado en la calidad del código, arquitecturas limpias y experiencias de usuario excepcionales.",
      "home.viewExp": "Ver Experiencia",
      "home.dlCV": "Descargar CV",
      "home.stack": "Stack Principal"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
