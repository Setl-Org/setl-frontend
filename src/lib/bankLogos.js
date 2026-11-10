/**
 * Bank logo lookup for connected accounts.
 *
 * Logos live in public/banks/<slug>.webp as 256x256 opaque tiles. Most are each
 * bank's own App Store app icon (country=pk); MCB and Standard Chartered use the
 * mark from the bank's website, and UBL is the blue panel of its app icon without
 * the "digital" caption. To refresh one, replace the file and keep the slug.
 *
 * Slugs match BANK_LOGOS in features/home/constants.js. The landing page still
 * shows wordmarks only; these logos are for the user's own connected accounts.
 */

/** Exact bankName values written by AddAccountModal (dashboard/constants.js BANKS). */
const SLUG_BY_NAME = {
  HBL: "hbl",
  MCB: "mcb",
  UBL: "ubl",
  SadaPay: "sadapay",
  JazzCash: "jazzcash",
  Easypaisa: "easypaisa",
  "Faysal Bank": "faysal",
  "Meezan Bank": "meezan",
  NayaPay: "nayapay",
  "Bank Alfalah": "alfalah",
  "Standard Chartered": "scb",
  "Askari Bank": "askari",
};

/**
 * Fallback for names from other sources (OAuth, statement parsing): normalised substring
 * match, first hit wins. A null slug marks a different bank whose name contains an alias.
 */
const SLUG_BY_ALIAS = [
  ["mcbislamic", null],
  ["habibbank", "hbl"], // not "habib": Bank AL Habib and Habib Metropolitan are different banks
  ["hbl", "hbl"],
  ["muslimcommercial", "mcb"],
  ["mcb", "mcb"],
  ["unitedbank", "ubl"],
  ["ubl", "ubl"],
  ["sadapay", "sadapay"],
  ["jazzcash", "jazzcash"],
  ["easypaisa", "easypaisa"],
  ["faysal", "faysal"],
  ["meezan", "meezan"],
  ["nayapay", "nayapay"],
  ["alfalah", "alfalah"],
  ["standardchartered", "scb"],
  ["scb", "scb"],
  ["askari", "askari"],
];

/**
 * @param {string | null | undefined} bankName
 * @returns {string | null} Public URL of the bank's logo, or null if unknown.
 */
export function getBankLogo(bankName) {
  if (!bankName) return null;
  const exact = SLUG_BY_NAME[bankName.trim()];
  if (exact) return `/banks/${exact}.webp`;

  const key = bankName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = SLUG_BY_ALIAS.find(([alias]) => key.includes(alias));
  return match?.[1] ? `/banks/${match[1]}.webp` : null;
}
