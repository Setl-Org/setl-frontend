import { useState } from "react";
import { Building2, Upload, Bell, ChevronRight, BookOpen, ExternalLink, Zap, MessageSquare, TrendingUp } from "lucide-react";

export function DashboardSidebar({ onAddAccount, onUploadStatements }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  const quickActions = [
    { label: "Add account", Icon: Building2, onClick: onAddAccount },
    { label: "Upload statements", Icon: Upload, onClick: onUploadStatements },
  ];

  const resources = [
    { label: "API Documentation", Icon: BookOpen },
    { label: "Integration guides", Icon: Zap },
    { label: "Support", Icon: MessageSquare },
  ];

  const changelog = [
    "Balance trend chart added",
    "Improved category detection",
    "Faster statement parsing",
  ];

  return (
    <aside className="flex flex-col gap-4">
      {/* Newsletter */}
      <div className="rounded-2xl border border-border/80 bg-primary p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">Stay updated</p>
            <p className="text-xs text-muted-foreground">Product news & updates</p>
          </div>
        </div>

        {subscribed ? (
          <div className="rounded-xl bg-success/8 border border-success/20 px-3 py-3 text-center">
            <p className="text-sm font-medium text-success">You&apos;re subscribed!</p>
            <p className="mt-0.5 text-xs text-muted-foreground">We&apos;ll keep you in the loop.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-secondary placeholder:text-muted-foreground/70 focus:border-tertiary/50 focus:outline-none focus:ring-2 focus:ring-tertiary/20 transition-all"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-tertiary px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-tertiary/90 hover:shadow-md hover:shadow-tertiary/20 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-border/80 bg-primary p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </p>
        <div className="flex flex-col gap-0.5">
          {quickActions.map(({ label, Icon, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-secondary transition-all hover:bg-muted/60"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tertiary/8 text-tertiary group-hover:bg-tertiary/15 transition-colors">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {label}
              <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="rounded-2xl border border-border/80 bg-primary p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Resources
        </p>
        <div className="flex flex-col gap-0.5">
          {resources.map(({ label, Icon }) => (
            <a
              key={label}
              href="#"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition-all hover:bg-muted/60"
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              {label}
              <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground/50" />
            </a>
          ))}
        </div>
      </div>

      {/* What's new */}
      <div className="rounded-2xl border border-tertiary/20 bg-gradient-to-br from-tertiary/5 via-tertiary/3 to-transparent p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-tertiary" />
          <p className="text-sm font-semibold text-secondary">What&apos;s new</p>
          <span className="ml-auto rounded-full bg-tertiary/15 px-2 py-0.5 text-[10px] font-semibold text-tertiary">
            v2.1
          </span>
        </div>
        <ul className="flex flex-col gap-2.5">
          {changelog.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary/50" />
              <span className="text-xs leading-relaxed text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
