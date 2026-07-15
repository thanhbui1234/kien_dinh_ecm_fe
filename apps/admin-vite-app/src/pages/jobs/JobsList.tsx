import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function JobsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tuyển dụng</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">Jobs list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
