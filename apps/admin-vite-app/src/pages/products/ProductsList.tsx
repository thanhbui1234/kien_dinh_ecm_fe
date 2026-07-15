import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function ProductsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">Products list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
