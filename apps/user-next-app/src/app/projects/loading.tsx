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
      <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="mt-2 h-3 w-1/3" />
            <Skeleton className="mt-1 h-5 w-3/4" />
            <Skeleton className="mt-1 h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
