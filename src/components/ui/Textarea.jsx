import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { TEXTAREA_CLASS } from "@/lib/styles";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea className={cn(TEXTAREA_CLASS, className)} ref={ref} {...props} />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
