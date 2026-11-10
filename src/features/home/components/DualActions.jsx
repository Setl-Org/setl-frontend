import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/authStore";
import { pillClass } from "../brand";

/** The site's two paths at equal weight: one for fintech leaders, one for builders. */
export function DualActions({ onDark = false, className }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const keysHref = isAuthenticated ? "/developer" : "/auth";
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Link
        to="/pricing#contact"
        className={cn(pillClass, onDark ? "bg-white text-[#141414] hover:bg-[#F3EEF9]" : "bg-[#141414] text-white hover:bg-[#2a2a2a]")}
      >
        Talk to the team
      </Link>
      <Link
        to={keysHref}
        className={cn(
          pillClass,
          onDark ? "bg-[#141414] text-white ring-1 ring-white/20 hover:bg-black" : "bg-white text-[#141414] ring-1 ring-[#141414] hover:bg-[#F3EEF9]"
        )}
      >
        Get API keys
      </Link>
    </div>
  );
}
