import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { SELECT_CLASS } from "@/lib/styles";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select className={cn(SELECT_CLASS, className)} ref={ref} {...props}>
      {children}
    </select>
  );
});

Select.displayName = "Select";

export { Select };
