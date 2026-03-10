import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import {
  BUTTON_PRIMARY_CLASS,
  BUTTON_SECONDARY_CLASS,
  BUTTON_TERTIARY_CLASS,
} from "@/lib/styles";

const variantMap = {
  primary: BUTTON_PRIMARY_CLASS,
  secondary: BUTTON_SECONDARY_CLASS,
  tertiary: BUTTON_TERTIARY_CLASS,
};

const Button = forwardRef(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={cn(variantMap[variant] || variantMap.primary, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
