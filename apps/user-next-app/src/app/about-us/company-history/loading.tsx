import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <Skeleton className="mb-2 h-4 w-48" />
      <Skeleton className="mb-8 h-8 w-64" />
      <div className="space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-dashed pb-6">
            <Skeleton className="h-6 w-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
