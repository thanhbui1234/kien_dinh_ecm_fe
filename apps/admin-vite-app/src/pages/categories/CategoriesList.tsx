import { Card, CardContent, CardHeader, CardTitle } from 'shared-ui';

export default function CategoriesList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500">Categories list will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
