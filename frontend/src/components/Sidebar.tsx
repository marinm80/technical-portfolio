import { NavLink } from "react-router-dom";
import { User, Code, FileText, Mail, X, Globe, Sun, Moon } from "lucide-react";
import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { profile } from "../data/profile";
import { useTheme } from "../context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { path: "/", label: t('nav.overview'), icon: User },
    // Experiencia oculta hasta tener trayectoria real (ver App.tsx)
    { path: "/projects", label: t('nav.projects'), icon: Code },
    { path: "/blog", label: t('nav.blog'), icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-surface-alt border-r border-edge flex flex-col z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-content-strong tracking-tight">{profile.name}</h1>
            <p className="text-sm text-accent mt-1 font-mono">{profile.role}</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-content-muted hover:text-content-strong transition-colors -mr-4 -mt-2 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-content-muted hover:bg-edge hover:text-content"
                )
              }
            >
              <item.icon className={cn(
                "w-4 h-4 transition-transform duration-200",
                "group-hover:scale-110"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-edge flex flex-col gap-2">
          <div className="flex gap-4 px-4 py-2 mb-2">
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-content-muted hover:text-accent transition-colors" title="GitHub" aria-label="GitHub">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-content-muted hover:text-accent transition-colors" title="LinkedIn" aria-label="LinkedIn">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>

          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 text-sm transition-colors group rounded-md",
                isActive ? "text-accent" : "text-content-muted hover:text-content"
              )
            }
          >
            <Mail className="w-4 h-4 group-hover:text-accent transition-colors" />
            {t('nav.contact')}
          </NavLink>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-4 py-2 text-sm text-content-muted hover:text-content transition-colors group rounded-md text-left"
          >
            <Globe className="w-4 h-4 group-hover:text-accent transition-colors" />
            {/* Convención: el label muestra el idioma destino en su propio idioma */}
            {i18n.language === 'es' ? 'English' : 'Español'}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2 text-sm text-content-muted hover:text-content transition-colors group rounded-md text-left"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 group-hover:text-accent transition-colors" />
            ) : (
              <Moon className="w-4 h-4 group-hover:text-accent transition-colors" />
            )}
            {theme === 'dark' ? t('sidebar.themeLight') : t('sidebar.themeDark')}
          </button>
        </div>
      </aside>
    </>
  );
}
