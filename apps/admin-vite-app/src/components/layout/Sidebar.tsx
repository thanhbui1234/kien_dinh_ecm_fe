import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Package, FolderTree, Briefcase, Phone, Presentation, Hexagon } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Categories', path: '/categories', icon: FolderTree },
  { name: 'Projects', path: '/projects', icon: Presentation },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'Leads', path: '/leads', icon: Phone },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-72 flex-col border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl z-20 shadow-sm">
      <div className="flex h-16 items-center border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
          <Hexagon className="w-5 h-5" />
        </div>
        <span className="text-xl font-extrabold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400 tracking-tight">
          CMS Admin
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="mb-4 px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Main Menu</div>
        <nav className="grid gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100 hover:translate-x-1'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
