import { cn } from "@/lib/cn";
import { getBankLogo } from "@/lib/bankLogos";

/**
 * InstitutionLogo - An institution's logo tile from public/banks. Decorative:
 * the institution's name always sits beside it.
 */
export function InstitutionLogo({ bankName, className }) {
  const src = getBankLogo(bankName);
  return (
    <span aria-hidden="true" className={cn("relative block shrink-0 overflow-hidden rounded-lg bg-[#f3f2ee]", className)}>
      {src && <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />}
    </span>
  );
}
