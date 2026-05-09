import { NavLink } from "react-router-dom";
import { User, Briefcase, Code, FileText, Mail } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: "/", label: "Overview", icon: User },
  { path: "/experience", label: "Experience", icon: Briefcase },
  { path: "/projects", label: "Projects", icon: Code },
  { path: "/blog", label: "Writing", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-obsidian-light border-r border-obsidian-border flex flex-col hidden md:flex">
      <div className="p-8 pb-4">
        <h1 className="text-xl font-bold text-slate-50 tracking-tight">Tu Nombre</h1>
        <p className="text-sm text-slate-400 mt-1 font-mono">Software Engineer</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-slate-400 hover:bg-obsidian-border hover:text-slate-200"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-obsidian-border">
        <a
          href="mailto:hello@example.com"
          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact
        </a>
      </div>
    </aside>
  );
}
