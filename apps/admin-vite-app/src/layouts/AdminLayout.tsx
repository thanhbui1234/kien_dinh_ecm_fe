import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-950 dark:text-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 z-10">
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
