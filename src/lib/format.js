/**
 * Display formatters for the signed-in app. One way each, so amounts, dates and
 * account numbers read the same on every page.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Rs 1,234" (no sign). Pass `{ signed: true }` for "+Rs 1,234" / "−Rs 1,234". */
export function formatRs(value, { signed = false, compact = false } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  const body = compact && abs >= 1000
    ? abs >= 1_000_000
      ? `${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
      : `${(abs / 1000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, "")}k`
    : Math.round(abs).toLocaleString("en-PK");
  if (!signed) return `${n < 0 ? "−" : ""}Rs ${body}`;
  return `${n < 0 ? "−" : "+"}Rs ${body}`;
}

export function formatCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("en-PK") : "";
}

/** Accepts an ISO timestamp or a YYYY-MM-DD date. Returns "26 Jun 2026". */
export function formatDate(value) {
  if (!value) return "";
  const s = String(value);
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (ymd) return `${Number(ymd[3])} ${MONTHS[Number(ymd[2]) - 1]} ${ymd[1]}`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "1 Jun – 25 Jun 2026" style period, collapsing the shared year. */
export function formatPeriod(start, end) {
  if (!start || !end) return formatDate(start || end);
  const a = formatDate(start);
  const b = formatDate(end);
  const ya = a.slice(-4);
  return ya === b.slice(-4) ? `${a.slice(0, -5)} to ${b}` : `${a} to ${b}`;
}

/** "•••• 8830" from any account number. */
export function maskAccountNumber(accountNumber) {
  const digits = String(accountNumber ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return `•••• ${digits.slice(-4)}`;
}

/** "acct_Nay…2d06": keeps both ends of a long identifier readable. */
export function middleTruncate(value, head = 9, tail = 5) {
  const s = String(value ?? "");
  return s.length <= head + tail + 1 ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;
}

export function capitalize(value) {
  const s = String(value ?? "");
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

/** First name for greetings, falling back to the email's local part. */
export function displayName(user) {
  const email = user?.email ?? user?.profile?.email ?? "";
  return (
    user?.profile?.firstName ||
    user?.name ||
    email.split("@")[0] ||
    "there"
  );
}

export function fullName(user) {
  const first = user?.profile?.firstName ?? "";
  const last = user?.profile?.lastName ?? "";
  return `${first} ${last}`.trim() || displayName(user);
}
