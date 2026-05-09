import { NavLink } from "react-router-dom";
import { User, Briefcase, Code, FileText, Mail, X, Globe, Link as LinkIcon, GitBranch } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { path: "/", label: t('nav.overview'), icon: User },
    { path: "/experience", label: t('nav.experience'), icon: Briefcase },
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
        "fixed inset-y-0 left-0 w-64 bg-obsidian-light border-r border-obsidian-border flex flex-col z-40 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-slate-50 tracking-tight">Tu Nombre</h1>
            <p className="text-sm text-accent mt-1 font-mono">Software Engineer</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-slate-100 transition-colors -mr-4 -mt-2 p-2"
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
                    : "text-slate-400 hover:bg-obsidian-border hover:text-slate-200"
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

        <div className="p-4 border-t border-obsidian-border flex flex-col gap-2">
          <div className="flex gap-4 px-4 py-2 mb-2">
            <a href="https://github.com/tu-usuario" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent transition-colors" title="GitHub">
              <GitBranch className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent transition-colors" title="LinkedIn">
              <LinkIcon className="w-5 h-5" />
            </a>
          </div>

          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2 text-sm transition-colors group rounded-md",
                isActive ? "text-accent" : "text-slate-400 hover:text-slate-200"
              )
            }
          >
            <Mail className="w-4 h-4 group-hover:text-accent transition-colors" />
            {t('nav.contact')}
          </NavLink>
          
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors group rounded-md text-left"
          >
            <Globe className="w-4 h-4 group-hover:text-accent transition-colors" />
            {i18n.language === 'es' ? 'English' : 'Español'}
          </button>
        </div>
      </aside>
    </>
  );
}
