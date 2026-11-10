# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Fintech builders (developers):** engineers at Pakistani fintechs, lenders and money apps who want to read their users' bank and wallet accounts through one API. They come to get API keys and read the docs.
- **Fintech leaders:** founders, product and partnership leads deciding whether to build on Setl. They come to talk to the team about access, pricing and which institutions are coming.
- On the public site both carry equal weight (confirmed 2026-11-11): two clear paths, "Talk to the team" and "Get API keys".
- **End customers** of those fintechs see Setl only inside the connect and consent flow, where they choose accounts and approve what an app can read.

## Product Purpose

Setl connects bank and wallet accounts in Pakistan to the fintechs built on them. A customer consents, and the fintech reads accounts and transactions through one API instead of integrating each institution separately. Success is a fintech shipping a product on consented account data without holding bank logins or building per-bank integrations.

## Positioning

One consented API for Pakistani accounts: the same account and transaction shape across institutions, with Raast and 1Link references kept when the data carries them. Setl never stores bank logins, consent is scoped and revocable, and data is hosted in Pakistan, designed for State Bank user-data rules.

## Capabilities and Constraints

- OAuth connect flow: an app creates a connect session, the customer signs in on Setl, picks accounts and approves scopes (`accounts:read`, `transactions:read`, `profile:read`). Consent lasts 90 days and can be revoked.
- External REST API under `/api/external/v1` (accounts, transactions, profile); personal API keys for a user's own data.
- **Current state, must stay truthful:** account data comes from statements the customer provides; Setl parses and categorises them. Direct bank APIs open as each institution joins. No institution is live as a direct connection yet.
- Institutions offered in the app: HBL, MCB, UBL, SadaPay, JazzCash, Easypaisa, Faysal Bank, Meezan Bank, NayaPay, Bank Alfalah, Standard Chartered, Askari Bank.
- Published pricing: API subscription PKR 80,000–100,000 per month; enterprise from PKR 3 million per year.

## Brand Commitments

- Name: Setl. Logo mark: eight hatched sectors in a ring (`public/logo-mark.svg`), purple-to-magenta gradient #542774 → #8e3a83 → #c44fa3. Wordmark in `public/logo.svg`.
- Public site face: Schibsted Grotesk. Signed-in app face: Plus Jakarta Sans.
- Reference: plaid.com, pinned by the user for both the dashboard and the public site. On 2026-11-11 the user chose Plaid's current richer look for the landing page (full-bleed colour, line-art texture, product screens over colour) over the earlier no-gradient-hero rule.
- Bank and wallet logos are shown clearly on the public site and in the app (user decision, 2026-11-11). Copy must still say that direct connections open as each institution joins; logos never imply a live partnership.

## Evidence on Hand

- Incubated at NIC Karachi (`public/nic-karachi.webp`, links to nickarachi.com).
- Contact: hatif@joinsetl.com. LinkedIn: linkedin.com/company/setl-finance.
- Published pricing (above).
- **Absent, never fabricate:** customer names or logos, testimonials, case studies, usage or scale numbers, uptime figures, live bank partnerships. Any demonstration data (accounts, transactions, API responses) is labelled as an example.

## Product Principles

1. Honest over impressive: show the mechanism working; never claim scale, customers or live connections Setl doesn't have.
2. Consent is the product: the customer sees exactly what an app can read and can revoke it.
3. One shape everywhere: the same accounts and transactions whichever institution a customer connects.
4. Built for Pakistan: local institutions, Raast and 1Link references, data hosted in-country.
