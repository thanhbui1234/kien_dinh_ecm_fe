import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] left-[60%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[120px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
