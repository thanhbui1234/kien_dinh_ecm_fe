import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero carousel */}
      <Skeleton className="h-[60vh] w-full rounded-none" />

      {/* Products section */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/3] w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-[1200px] px-4">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-36 shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Projects section */}
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
