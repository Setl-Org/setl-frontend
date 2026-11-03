import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import { FOOTER_COLUMNS } from "../constants";

/**
 * Footer - Public site footer.
 */
export function Footer() {
  return (
    <footer className="border-t border-[#eceae4] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <img src="/logo.svg" alt="Setl" className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#6b6b66]">
            The connector between Pakistani bank accounts and the fintechs built on them.
          </p>
          <div className="mt-4 flex flex-col items-start gap-2">
          <a href="mailto:hatif@joinsetl.com" className="text-sm font-medium text-[#141414] underline-offset-4 hover:underline">
            hatif@joinsetl.com
          </a>
          <a
            href="https://www.linkedin.com/company/setl-finance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#141414] underline-offset-4 hover:underline"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          </div>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-medium text-[#141414]">{column.title}</h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.internal ? (
                    <Link to={link.href} className="text-sm text-[#6b6b66] hover:text-[#141414]">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="text-sm text-[#6b6b66] hover:text-[#141414]">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#eceae4]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-[#6b6b66] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Setl</p>
          <p>Data hosted in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
