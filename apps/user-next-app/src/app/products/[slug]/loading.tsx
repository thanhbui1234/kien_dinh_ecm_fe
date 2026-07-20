import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-[80px]">
      <Skeleton className="mb-6 h-4 w-48 border-b pb-4" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="mt-6 h-11 w-40 rounded" />
        </div>
      </div>
    </div>
  );
}
