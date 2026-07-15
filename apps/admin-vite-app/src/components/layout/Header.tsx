import { Bell, Search, User } from 'lucide-react';
import { Button, Input } from 'shared-ui';

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md px-6 z-20 sticky top-0">
      <div className="w-full flex-1">
        <form>
          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search anything..."
              className="w-full appearance-none bg-zinc-100/50 dark:bg-zinc-900/50 pl-10 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-950 transition-all shadow-sm rounded-full h-10"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-105">
          <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all hover:scale-105 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <User className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </div>
    </header>
  );
}
