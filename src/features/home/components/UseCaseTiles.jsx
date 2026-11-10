import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TILE_FIELDS } from "../brand";
import { ScreenTile } from "./ExampleScreens";

const TILES = [
  { slug: "lending", title: "Lending", line: "Income and cash flow from the accounts a borrower connects.", field: TILE_FIELDS.plum },
  { slug: "pfm", title: "Personal finance", line: "Balances and categorized transactions for a money app.", field: TILE_FIELDS.violet },
  { slug: "accounting", title: "Accounting", line: "The same transaction shape for every institution a business connects.", field: TILE_FIELDS.night },
  { slug: "payments", title: "Reconciliation", line: "Match collections against the feed, including Raast and 1Link references.", field: TILE_FIELDS.rose },
];

/** UseCaseTiles - Plaid-style product cards: a colour field with the product at work, then the copy. */
export function UseCaseTiles() {
  return (
    <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
      {TILES.map((tile) => (
        <Link key={tile.slug} to={`/use-cases#${tile.slug}`} className="group block rounded-[32px]">
          <ScreenTile kind={tile.slug} field={tile.field} />
          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] sm:text-[28px]">{tile.title}</h3>
          <p className="mt-2 max-w-md text-base leading-relaxed text-[#3f3f3f]">{tile.line}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#141414] transition-colors group-hover:bg-[#141414] group-hover:text-white">
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            See {tile.title.toLowerCase()}
          </span>
        </Link>
      ))}
    </div>
  );
}
