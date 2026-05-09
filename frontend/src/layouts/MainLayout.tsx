import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-obsidian text-slate-300">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-8 md:p-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
