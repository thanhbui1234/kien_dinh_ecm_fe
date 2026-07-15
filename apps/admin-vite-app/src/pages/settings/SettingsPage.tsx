import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình chung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">System settings will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
