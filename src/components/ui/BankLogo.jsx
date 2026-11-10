import { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { getBankLogo } from "@/lib/bankLogos";

/**
 * BankLogo - Square bank logo tile. Falls back to a generic bank icon when the
 * bank is unknown or the image fails to load.
 *
 * Decorative by default (alt=""), since the bank name is shown next to it.
 *
 * @param {Object} props
 * @param {string} [props.bankName]
 * @param {string} [props.className] - Size and shape overrides (default h-10 w-10 rounded-lg)
 */
export function BankLogo({ bankName, className }) {
  const src = getBankLogo(bankName);
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary",
          className
        )}
      >
        <Building2 className="h-1/2 w-1/2" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn(
        "h-10 w-10 shrink-0 rounded-lg bg-white object-cover ring-1 ring-border/80",
        className
      )}
    />
  );
}
