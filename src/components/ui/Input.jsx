import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { INPUT_CLASS } from "@/lib/styles";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(INPUT_CLASS, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
