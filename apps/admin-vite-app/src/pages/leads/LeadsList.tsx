import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function LeadsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Leads & Contacts</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu báo giá</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">Leads list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
