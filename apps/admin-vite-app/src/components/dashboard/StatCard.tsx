import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, description, icon, trend = 'neutral' }: StatCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-zinc-200/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-500/30 group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${
          trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
          trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        } transition-colors group-hover:scale-110 duration-300`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-extrabold tracking-tight">{value}</div>
        <p className={`text-xs mt-1 font-medium ${
          trend === 'up' ? 'text-green-600 dark:text-green-400' : 
          trend === 'down' ? 'text-red-600 dark:text-red-400' : 
          'text-zinc-500 dark:text-zinc-400'
        }`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
