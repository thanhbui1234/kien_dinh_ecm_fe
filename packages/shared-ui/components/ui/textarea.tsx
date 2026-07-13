import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[88px] w-full resize-y rounded-lg border border-input bg-background px-3 py-2.5 text-sm leading-relaxed shadow-[inset_0_1px_0_oklch(1_0_0/0.4)] transition-all",
          "placeholder:text-muted-foreground/70",
          "focus-visible:border-ring/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.03)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
