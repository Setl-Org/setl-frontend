# Setl app design rules

The signed-in app (`/dashboard/*`, `/developer/*`, `/oauth/authorize`) follows Plaid's dashboard
anatomy with Setl's own palette. The public site keeps its own direction (`.impeccable/`).
**One way each:** if a screen needs something these pieces don't cover, extend the shared
piece; don't write a local copy.

## Tokens (`src/index.css`, `@theme`)

| Token | Use |
|---|---|
| `ink` #141414 | Text, primary buttons |
| `ink-muted` / `ink-subtle` | Secondary text / meta and placeholders (both pass AA on white and `sunken`) |
| `canvas`, `sunken` | Page surface / hover rows, tracks, inset panels |
| `hairline`, `hairline-strong` | Card and table borders / control borders |
| `lilac`, `lilac-strong`, `violet-ink` | Selected nav item, active filter, icon tiles |
| `violet` #7c3aed | Active and focus only. Never a fill for buttons |
| `positive` / `negative` / `caution` + `-soft` | The status trio. Never reused as chart series |
| `shadow-card`, `shadow-raised`, `shadow-popover` | Rest, hover, floating |

Keyboard focus: the `focus-ring` utility everywhere. Loading: the `skeleton` utility or `SkeletonBlock`, shaped like the content.

## Shared pieces (`src/components/app/`)

- `AppButton`: `primary` (one per view), `secondary`, `ghost`, `danger`, `danger-outline`. `to`/`href` render links.
- `PageHeader`: every page starts with it; it also sets the tab title.
- `Card` / `CardHeader` / `CardBody` / `SectionTitle`: no nested cards.
- `DataTable` + `Pagination`: bordered list tables. Give a column `sortValue` only when the whole list is on the client; server-paginated tables don't sort.
- `FilterSelect`, `BankChips`, `SegmentedControl`, `SearchInput`: filters. Filters on server lists live in the URL (`useSearchParams`).
- `EmptyState`: empty, filtered-empty and `tone="error"` states. Every fetch renders one of loading, ready, empty or error; no silent `catch`.
- `InlineConfirm`: destructive actions confirm in place. No `window.confirm`, no confirm modals.
- `CopyField` / `CopyButton`: credentials and identifiers; secrets masked with reveal.
- `Field`, `TextInput`, `TextArea`, `SelectInput`, `DialogActions`: forms in dialogs; errors show on the field.
- `StatusPill`, `Tag`, `KpiTile`, `CodeBlock`.
- `BankLogo` (`src/components/ui/`): every place a bank is named next to an account.

## Page archetypes

- **Home**: setup hero (real progress), Explore cards + Getting started rail, At a glance, recent activity.
- **List** (Accounts, Transactions, Connected apps): `PageHeader` with actions, a filter row, `DataTable`, `Pagination`.
- **Detail/credentials** (Keys, OAuth apps): cards with `CopyField` and inline-confirmed actions.
- **Settings**: grid of link cards to real destinations only.

## Shell

`src/features/app-shell/`: `AppShell` (layout route, shared data via `useApp()`, page error boundary,
Cmd/Ctrl+K and `/` command menu), `AppSidebar`, `navConfig.js` (only real destinations; no
"coming soon" entries). Add a page by adding a route inside the `AppShell` group in `App.jsx`
and an entry in `navConfig.js`.

## Copy

Sentence case. No em dashes between words. Say what happened and what to do next
("Couldn't load transactions. Try again."). Don't claim what the data doesn't show.
