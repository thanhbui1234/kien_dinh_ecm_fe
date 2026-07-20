import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <Skeleton className="mb-2 h-4 w-48" />
      <Skeleton className="mb-8 h-8 w-64" />
      <Skeleton className="mb-3 h-7 w-40" />
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
