import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-[80px]">
      <div className="flex items-center justify-between border-b py-4">
        <div className="space-y-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-48" />
        </div>
      </div>
      <div className="flex items-center justify-between py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/3] w-full" />
            <Skeleton className="mt-2 h-3 w-1/3" />
            <Skeleton className="mt-1 h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
