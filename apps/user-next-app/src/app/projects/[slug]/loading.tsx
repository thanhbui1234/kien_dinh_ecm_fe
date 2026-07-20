import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pt-[80px]">
      <Skeleton className="h-[50vh] w-full rounded-none" />
      <div className="mx-auto max-w-[1200px] px-4 py-12 space-y-4">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
