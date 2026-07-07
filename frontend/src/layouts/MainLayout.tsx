import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { profile } from "../data/profile";

function PageFallback() {
  return (
    <div className="space-y-4 py-8 animate-pulse" aria-hidden="true">
      <div className="h-8 w-2/3 rounded bg-surface-alt" />
      <div className="h-4 w-full rounded bg-surface-alt" />
      <div className="h-4 w-5/6 rounded bg-surface-alt" />
    </div>
  );
}

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface text-content">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-alt/80 backdrop-blur-md border-b border-edge z-20 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-content-muted hover:text-content-strong transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-4 font-bold text-content-strong tracking-tight">{profile.name}</span>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 ml-0 md:ml-64 p-8 pt-24 md:p-16 md:pt-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
