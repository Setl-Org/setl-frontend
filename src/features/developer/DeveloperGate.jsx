import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { KeyRound, AppWindow, Sparkles, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useApp } from "@/features/app-shell/useApp";
import { PageHeader } from "@/components/app/PageHeader";
import { AppButton } from "@/components/app/AppButton";

const PERKS = [
  { icon: KeyRound, title: "Personal API key", body: "Query your own accounts and transactions from a script or a notebook." },
  { icon: FileSpreadsheet, title: "Your data, anywhere", body: "Pull transactions into Python, Excel or any workflow you already use." },
  { icon: AppWindow, title: "OAuth apps", body: "Register apps that other Setl users can authorise, like a budget tracker." },
];

function DeveloperModeLanding() {
  const enableDeveloperMode = useAuthStore((s) => s.enableDeveloperMode);
  const [enabling, setEnabling] = useState(false);

  async function enable() {
    setEnabling(true);
    try {
      await enableDeveloperMode();
      toast.success("Developer mode is on");
    } catch (err) {
      toast.error(err.errorMessage ?? "Couldn't turn on developer mode. Try again.");
      setEnabling(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Developers" description="Build on Setl with a personal API key or OAuth apps." />
      <section className="relative overflow-hidden rounded-[22px] border border-lilac-strong bg-[linear-gradient(115deg,#faf7fe_0%,#f3eef9_60%,#ece4fa_100%)] px-6 py-10 sm:px-12 sm:py-14">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-violet shadow-card">
          <Sparkles className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-6 text-[28px] font-bold tracking-[-0.025em] text-ink sm:text-[32px]">Turn on developer mode</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Developer mode adds API keys and OAuth apps to your workspace. It doesn&apos;t change your accounts or share any data.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-hairline bg-canvas p-5 shadow-card">
              <Icon className="h-5 w-5 text-violet" aria-hidden />
              <p className="mt-3 text-[15px] font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[13px] leading-5 text-ink-muted">{body}</p>
            </li>
          ))}
        </ul>
        <AppButton variant="primary" className="mt-8" loading={enabling} leadingIcon={Sparkles} onClick={enable}>
          Turn on developer mode
        </AppButton>
      </section>
    </div>
  );
}

/** Gate for /developer/*: shows the opt-in until developer mode is on, then the page. */
export function DeveloperGate() {
  const app = useApp();
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const user = app.user;

  // The cached user may predate the isDeveloper field.
  useEffect(() => {
    if (user && user.isDeveloper === undefined) refreshProfile();
  }, [user, refreshProfile]);

  if (!user?.isDeveloper) return <DeveloperModeLanding />;
  return <Outlet context={app} />;
}
