import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { StatusPill } from "@/components/app/StatusPill";
import { DEFAULT_SCOPES, FEATURED_INSTITUTIONS, SCREENS } from "./constants";
import { isDirty, useLinkCustomizations } from "./useLinkCustomizations";
import { PreviewStage } from "./components/PreviewStage";
import { SettingsPanel } from "./components/SettingsPanel";
import { CustomizationSwitcher } from "./components/CustomizationSwitcher";

/**
 * Stretch the page across the whole content area. AppShell centres pages in a
 * 1160px column with padding; the editor, like Plaid's, wants the full width.
 * Measures #main and offsets the page so its edges line up with it.
 */
function useFullBleed(ref) {
  const [box, setBox] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const main = document.getElementById("main");
    if (!el || !main) return undefined;
    const measure = () => {
      // The page's natural left edge is its parent's content box; measuring the page
      // itself would include the margin we set, so measure the parent.
      const parent = el.parentElement;
      const padLeft = parseFloat(getComputedStyle(parent).paddingLeft) || 0;
      const naturalLeft = parent.getBoundingClientRect().left + padLeft;
      const mainLeft = main.getBoundingClientRect().left;
      setBox({ width: Math.floor(main.clientWidth), offset: Math.round(naturalLeft - mainLeft) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref]);
  return box;
}

function publishedLabel(item, now) {
  if (!item.published) return "Never published";
  if (!item.publishedAt) return "Published";
  const mins = Math.round((now - item.publishedAt) / 60_000);
  if (mins < 1) return "Published just now";
  if (mins < 60) return `Published ${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Published ${hours} h ago`;
  return `Published ${new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

/**
 * Link customization - Plaid-style editor for the Setl Link flow used by
 * Pakistani banks and wallets. Demo only: customizations live in this browser.
 */
export function LinkCustomizePage() {
  const rootRef = useRef(null);
  const bleed = useFullBleed(rootRef);

  const item = useLinkCustomizations((s) => s.items[s.currentId]);
  const { update, publish, discard } = useLinkCustomizations.getState();
  const dirty = isDirty(item);

  const [screenId, setScreenId] = useState("consent");
  const [panel, setPanel] = useState("list");
  const [institution, setInstitution] = useState(FEATURED_INSTITUTIONS[0]);
  const [scopes, setScopes] = useState(DEFAULT_SCOPES);
  const [errorKind, setErrorKind] = useState("unavailable");
  const [now, setNow] = useState(() => Date.now());

  const screenIndex = SCREENS.findIndex((s) => s.id === screenId);

  useEffect(() => {
    document.title = "Link customization · Setl";
  }, []);

  // Keep "Published 3 min ago" fresh.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Moving the preview to another screen opens that screen's settings, unless the
  // panel is on the list or on colours (which apply to every screen).
  const selectScreen = useCallback((id) => {
    setScreenId(id);
    setPanel((p) => (p === "list" || p === "appearance" ? p : id));
  }, []);

  function openPanel(id) {
    setPanel(id);
    if (id !== "appearance") setScreenId(id);
  }

  function handlePublish() {
    publish();
    setNow(Date.now());
    toast.success(`Published “${item.name}”`, {
      description: "New Link sessions that use this customization show your changes from now on.",
    });
  }

  function handleDiscard() {
    discard();
    toast("Unpublished edits discarded");
  }

  const context = useMemo(
    () => ({
      go: selectScreen,
      institution,
      setInstitution,
      scopes,
      errorKind,
    }),
    [selectScreen, institution, scopes, errorKind]
  );

  const preview = { scopes, errorKind, setErrorKind };

  return (
    <div
      ref={rootRef}
      className="-mb-16 -mt-6 grid min-h-[calc(100vh-3.5rem)] grid-cols-1 sm:-mt-10 lg:-mt-14 lg:h-screen lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]"
      style={bleed ? { width: bleed.width, marginLeft: -bleed.offset } : undefined}
    >
      <PreviewStage
        settings={item.draft}
        screenIndex={screenIndex}
        onSelectScreen={selectScreen}
        context={context}
        scopes={scopes}
        onToggleScope={(id) => setScopes((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))}
        toolbar={
          <>
            <CustomizationSwitcher />
            <StatusPill tone={dirty ? "caution" : "positive"} className="h-10 rounded-lg px-3 shadow-card">
              {dirty ? (item.published ? "Unpublished changes" : "Not published yet") : publishedLabel(item, now)}
            </StatusPill>
          </>
        }
      />
      <SettingsPanel
        item={item}
        panel={panel}
        onOpen={openPanel}
        onBack={() => setPanel("list")}
        onChange={update}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
        dirty={dirty}
        preview={preview}
      />
    </div>
  );
}
