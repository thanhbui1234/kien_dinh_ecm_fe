import { cn } from "../../lib/utils"

interface SkeletonProps {
  className?: string
  /** Shape variant */
  variant?: "rectangular" | "rounded" | "circular"
}

/**
 * Skeleton — animated placeholder for loading states.
 * Uses a shimmer sweep that adapts to both dark and light backgrounds
 * via currentColor-based opacity layers.
 */
export function Skeleton({ className, variant = "rounded" }: SkeletonProps) {
  const shapeClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "rectangular"
        ? "rounded-none"
        : "rounded-xl"

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-current opacity-10",
        shapeClass,
        className
      )}
      aria-hidden="true"
    >
      {/* Shimmer sweep overlay */}
      <div
        className={cn(
          "absolute inset-0",
          "animate-shimmer-sweep",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "-translate-x-full"
        )}
      />
    </div>
  )
}
