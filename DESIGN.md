---
name: Setl (public site)
description: One consented API for Pakistani bank and wallet accounts.
colors:
  ink: "#141414"
  ink-hover: "#2a2a2a"
  body-gray: "#3f3f3f"
  muted-gray: "#6b6b66"
  white: "#ffffff"
  lilac-fill: "#f3eef9"
  lilac-paper: "#faf8fd"
  lilac-hairline: "#eee8f6"
  nav-hairline: "#ebe7f2"
  input-line: "#e4ddf0"
  warm-rule: "#eceae4"
  warm-hover: "#f6f5f2"
  half-mark-lilac: "#f0eafb"
  selection-lilac: "#e8ddf8"
  setl-purple: "#542774"
  signal-violet: "#7c3aed"
  deep-plum: "#1d0b30"
  plum: "#3a1656"
  wine: "#5e1d58"
  orchid-plum: "#8e3a83"
  magenta: "#c44fa3"
  settled-green: "#0e7a4a"
  settled-green-fill: "#e6f5ed"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "5.25rem"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  display-page:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.25rem"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  body-lead:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
  screen-title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
  chip:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  link: "8px"
  logo: "10px"
  menu-item: "12px"
  row: "16px"
  screen: "20px"
  sheet: "28px"
  card: "32px"
  dark-card: "36px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter: "24px"
  sheet-pad: "28px"
  card-pad: "40px"
  section: "96px"
  section-lg: "128px"
  hero-top: "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.lilac-fill}"
  button-on-color:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "48px"
  button-on-color-hover:
    backgroundColor: "{colors.lilac-fill}"
  nav-pill:
    backgroundColor: "{colors.white}"
    textColor: "{colors.body-gray}"
    rounded: "{rounded.full}"
    height: "56px"
    padding: "0 8px"
  chip-example:
    backgroundColor: "{colors.lilac-fill}"
    textColor: "{colors.setl-purple}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  institution-row:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "10px 12px"
  institution-row-selected:
    backgroundColor: "{colors.lilac-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "10px 12px"
  input-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "0 16px"
    height: "48px"
  card-paper:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  example-screen:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.screen}"
    padding: "16px"
    width: "340px"
  code-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.code}"
    rounded: "{rounded.row}"
    padding: "20px"
---

# Design System: Setl (public site)

This file covers the public marketing site only: home, Use cases, Products, Pricing, About, and the Developers hero. The signed-in dashboard is a separate system set in Plus Jakarta Sans. It lives on another branch and none of these rules apply to it.

## Overview

**Creative North Star: "The Lit Connection"**

The site is built around a working product. A white page holds an ink headline and a real connect flow, and the Setl mark sits behind that flow as pale line-art, like light coming off it. Lower on the page the world deepens into full-bleed fields that run from deep plum through Setl purple to magenta. White product screens float on those fields with soft plum shadows. The structure follows the Plaid marketing canon: a floating pill nav, pill controls, large rounded colour tiles carrying example screens, a dark coverage band and a closing brand field.

Density is generous and calm: 96–128px section rhythm, one idea per section, and tightly tracked headlines with no ornament. The mark's hatched line-art supplies the texture. Gradients, glass and shadow all live in the plum-to-magenta family, so even the depth reads as Setl.

Proof is honest. Every product screen and connect step carries an "Example" chip. Institution logos are shown as the institutions' own artwork, unblurred. NIC Karachi is the only third-party credential.

**Key Characteristics:**
- White primary hero, with an ink headline and the pale half mark at stroke 1 cropped by the right edge.
- Full-bleed plum-to-magenta fields and colour tiles, textured by the mark's hatching in white at 5–14% opacity.
- Floating white product screens and frosted-glass sheets with soft plum shadows.
- Pill controls everywhere: ink on white, white on colour.
- Real institution logos, unblurred, with an "Example" label on any illustrative data.
- Schibsted Grotesk at weight 600 for display, with tight negative tracking.

## Colors

The palette is ink on white, deepened by plum fields and lit by a single interaction violet. The lilac tints keep light surfaces in the mark's family.

### Primary
- **Ink** (`ink`): All text, the primary pill, the nav CTA, the ConnectSheet's continue button, and code panels. The developer card is deep plum (#1d0b30) with the mark's hatching at white/6, not ink, and carries no blurred glow. Hover moves to **Ink Hover** (`ink-hover`).
- **Setl Purple** (`setl-purple`): Text and icons on lilac fills, used on "Example" chips, truth-row icon discs and use-case icon tiles. It is a text accent, not a surface.

### Secondary
- **Signal Violet** (`signal-violet`): The interaction colour. Used for focus outlines (2px, offset 3px), the caret, the selected institution row's ring and filled radio, and form focus borders. Outside interaction it appears only as the brand field's low-opacity violet glow.

### Tertiary (the field family)
- **Deep Plum** (`deep-plum`): The darkest stop of the brand field, the "Built for Pakistan" and "Opening with the banks" bands, and the numbered step discs.
- **Plum** (`plum`) and **Wine** (`wine`): The middle and end stops of the brand field's linear base.
- **Magenta** (`magenta`): The brand field's radial light and the bright end of the plum tile. It also appears as the endpoint of the step connector's hairline gradient.
- **Orchid Plum** (`orchid-plum`): The mid stop of the plum colour tile.

The brand field (`FIELD`) is a composite: `linear-gradient(160deg, #1d0b30 0%, #3a1656 46%, #5e1d58 100%)` lit by a magenta radial (`rgba(196,79,163,0.62)` at 82% 28%) and a violet radial (`rgba(124,58,237,0.38)` at 8% 100%). The six tile fields (`TILE_FIELDS`: plum, violet, night, rose, dusk, orchid) are 135° three-stop gradients that run from a dark plum-family stop to a pale tint of the same hue.

### Neutral
- **White** (`white`): The hero, most section grounds, product screens and paper cards.
- **Lilac Paper** (`lilac-paper`): Quiet card fills inside white sections (the About team cards). Alternating section grounds use **Lilac Fill** (#f3eef9), per the reviewed fix of 2026-11-11.
- **Lilac Fill** (`lilac-fill`): Fills for selected states and chips, and the ground of the two form sections (Talk to the team, Request a use case). Also the hover fill of white pills.
- **Half-Mark Lilac** (`half-mark-lilac`): The stroke colour of the hero's half mark, and nothing else.
- **Selection Lilac** (`selection-lilac`): The text-selection background.
- **Lilac Hairline** (`lilac-hairline`), **Nav Hairline** (`nav-hairline`), **Input Line** (`input-line`): Cool rings on paper cards, the nav pill and menus, and form fields.
- **Warm Rule** (`warm-rule`) and **Warm Hover** (`warm-hover`): Dividers inside screens, sheets and the footer, plus the hover fill of rows and menu items.
- **Body Gray** (`body-gray`): Body and lead copy on white. **Muted Gray** (`muted-gray`): Secondary lines, captions and footer links.
- **Settled Green** (`settled-green`) on **Settled Green Fill** (`settled-green-fill`): Credits and "settled", "matched" or "in policy" status pills inside example screens only.

### Named Rules
**The Field Family Rule.** Every gradient, glow and tinted shadow comes from the mark's family: deep plum, plum, wine, Setl purple, violet, orchid and magenta. No other hue is used as atmosphere.

**The Violet Signal Rule.** Signal violet marks interaction (focus, caret, the selected institution). It is never a flat fill on a section ground, card or button. Outside interaction it appears only as the brand field's low-opacity glow.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** the system monospace stack, for code, API paths and rail references

**Character:** A single grotesk carries the whole site. Weight 600 with tight tracking gives headlines a dense, engineered presence. Running copy stays at 400 in body gray with relaxed leading.

### Hierarchy
- **Display** (600, 3rem / 4.25rem / 5.25rem stepped at mobile / sm / lg, line-height 0.95, -0.04em): The home hero headline only, capped at 11ch.
- **Display Page** (600, 2.75rem / 3.75rem / 4.25rem, 0.98, -0.04em): The PageHero headline on every other page, capped at 15ch.
- **Headline** (600, 2.25rem mobile to 3rem sm+, 1.05, -0.035em): Section headings. Sub-page section heads use 1.875rem to 2.25rem at -0.03em.
- **Title** (600, 1.5rem, -0.02em): Step, trust and card titles. Use-case tile titles run 28px at -0.025em.
- **Body Lead** (400, 1.125rem to 1.25rem in heroes, line-height 1.625): The paragraph under a headline, held to about 31–34rem.
- **Body** (400, 1rem or 15px, 1.625): Running copy in tiles, cards and steps.
- **Label** (500, 15px): Pill buttons. Nav links and menu titles use 14px.
- **Screen Title** (600, 13px): The title line of an example screen. Rows inside screens run 12.5px.
- **Chip** (500, 10–11px, tabular numerals): "Example" chips and status pills. Sentence case throughout.
- **Code** (system mono, 12.5px on 24px leading, 13px from sm): Code panels. The ConnectSheet's response preview runs 11.5px at 1.7.

### Named Rules
**The One Grotesk Rule.** The public site uses Schibsted Grotesk for every role except code. Plus Jakarta Sans belongs to the dashboard and never appears here.

**The Tight Display Rule.** Anything at 1.5rem or larger is set at weight 600 with negative tracking (-0.02em to -0.04em, tighter as the size grows).

## Layout

Content sits in a centred 1152px container (`max-w-6xl`) with 16px gutters, widening to 24px from sm. Sections stack full-bleed and alternate between white, lilac fill (#f3eef9), deep plum bands and the brand field. Vertical rhythm is 96px per section, rising to 112–128px at lg. Heroes clear the fixed nav with 128px of top padding (160px at lg).

The home hero is a two-column grid: copy, plus a 480px column holding the connect sheet. The sheet sits in a fixed 700px-tall cell at lg, so changing steps never moves the headline. PageHero repeats the grid with a 460px aside. Use-case and product rows alternate a colour tile and copy left and right at lg. The hero ends in a four-column row of product truths above a hairline. Everything collapses to one column below lg, and the half mark is hidden below md.

Pill controls are 48px tall. Paired actions sit side by side from sm and stack full-width below it.

## Elevation & Depth

Depth is soft and tinted. Shadows are long, negatively spread and coloured plum (`rgba(29,11,48,…)`) or Setl purple (`rgba(84,39,116,…)`), so floating objects look lit by the field rather than lifted off a grey page. Surfaces at rest are flat paper with hairline rings. Shadow is reserved for objects that float: the nav, menus, screens, sheets and the NIC Karachi chip on hover.

### Shadow Vocabulary
- **Nav float** (`box-shadow: 0 12px 32px -20px rgba(29,11,48,0.45)`): The floating pill nav.
- **Menu float** (`box-shadow: 0 24px 48px -24px rgba(29,11,48,0.45)`): Nav dropdowns and the mobile menu.
- **Screen float** (`box-shadow: 0 30px 60px -28px rgba(29,11,48,0.7)`): Example screens on colour tiles.
- **Glass sheet** (`box-shadow: 0 0 0 1px rgba(196,170,240,0.35), 0 40px 80px -34px rgba(84,39,116,0.55), inset 0 1px 0 rgba(255,255,255,0.95)`): Frosted-glass sheets and cards on white or lilac.
- **Solid sheet on colour** (`box-shadow: 0 40px 80px -30px rgba(29,11,48,0.75), 0 12px 24px -12px rgba(29,11,48,0.35)`): The solid ConnectSheet when it sits on a field.
- **Icon tile** (`box-shadow: 0 14px 28px -16px rgba(29,11,48,0.6)`): Gradient icon tiles in the trust list.

### Named Rules
**The Plum Shadow Rule.** Shadows are tinted plum or purple and negatively spread. Grey or black drop shadows are only used on the ink code panel.

**The Glass on Light Rule.** Frosted glass (white 74%→50% at 150°, blur 14px, saturate 150%, white/70 border) sits on white or lilac grounds. On a colour field, the sheet turns solid white (`glass={false}`).

## Shapes

Shapes are soft and generous. Every action is a full pill, including the nav itself. Large containers are rounded at 28px (sheets, colour tiles), 32px (paper and pricing cards) and 36px (the one dark API card). Example screens use 20px, and rows, inputs, menu panels and code panels use 16px. Institution logos sit in 10px tiles in lists and full circles in pills. Recurring geometry comes from the Setl mark: eight hatched 45° sectors, drawn as line art at strokes of 1 to 1.4 and cropped by a page edge.

## Components

### Buttons
Calm, confident pills.
- **Shape:** Full pill, 48px tall, 24px horizontal padding, 15px weight-500 label (`pillClass`).
- **Primary:** Ink pill with white text, hovering to ink hover.
- **Secondary on white:** White pill with a 1px ink ring and ink text, hovering to lilac fill.
- **On colour:** A white pill (hover lilac fill) paired with an ink pill carrying a white/20 ring (hover black).
- **Ghost on dark:** White text with a white/30 ring and a white/10 hover. Used for secondary links such as "Read the docs".
- **Arrow link:** A 28px ink-outlined circle holding an arrow, beside a weight-500 label. The circle fills ink on hover.
- **Focus:** A 2px signal-violet outline at a 3px offset, white on dark sections.

### Chips
- **Example chip:** Lilac fill, Setl purple text, 10–11px weight 500, full pill. Required on every illustrative screen and on each connect step ("Example · 1/3").
- **Status pill:** Settled green on its pale fill for done states, warm gray for pending ones.
- **Institution pill (dark band):** A white/6 fill with a white/15 border, a 32px circular logo and a 15px name. These drift in two columns (40s up, 44s down), pause off-screen and stop under reduced motion.

### Cards / Containers
- **Corner Style:** 28px for sheets and tiles, 32px for paper cards, 36px for the plum developer card.
- **Background:** White with a lilac hairline ring on lilac paper. The brand field for the Enterprise and featured panels, with the mark at white/12–14 in the corner.
- **Shadow Strategy:** Flat at rest. Only floating objects carry the plum shadows listed above.
- **Internal Padding:** 32px, rising to 40px from sm. Sheets use 24px, rising to 28px.

### Inputs / Fields
- **Style:** 48px tall, 16px radius, a 1px input-line border, white at 80%, 15px text, placeholder `#8a8a96`.
- **Focus:** The border turns signal violet, with a 4px violet ring at 10%.
- **Forms** sit inside a frosted-glass card on a lilac-fill section, with the mark at white/70 cropped off the left edge.

### Navigation
- **Style:** A fixed floating pill, 56px tall, white at 85% with a backdrop blur, a nav-hairline border and the nav float shadow, inset 12–16px from the viewport. The logo sits on the left, the links sit in the exact centre of a three-column grid, and the actions sit on the right.
- **Links:** 14px body gray, turning ink on hover. The active page is ink at weight 500. Products, Use cases and Developers open 16px-radius white menu panels.
- **Actions:** A "Log in" ghost pill and an ink "Get API keys" pill, both 40px tall. The ink pill reads "Dashboard" when signed in.
- **Mobile:** The links collapse into a 24px-radius white panel with grouped accordions and full-width pills.

### ConnectSheet (signature)
The working three-step consent flow: choose an institution, approve the scopes and accounts, then see the JSON the app receives.
- **Hero form:** Frosted glass (the glass sheet recipe) floating directly on the white hero over the half mark. No stage panel or colour field sits behind it.
- **Solid form:** `glass={false}` gives a solid white sheet with the solid-on-colour shadow, for use on colour fields (Products).
- **Institution row:** A 16px-radius row with a 32px logo, name and radio. Selected rows take a lilac fill, a 1px signal-violet ring and a filled violet radio. Unselected rows hover to warm hover.
- **Progress:** Three 4px bars (ink when reached, 24px wide; warm gray, 12px, when not) beside the Example chip.
- **Motion:** Steps cross-fade with a 16px slide and a 4px blur over 320ms (`cubic-bezier(0.16,1,0.3,1)`). The response JSON reveals line by line once. Under reduced motion only the opacity changes.

### ScreenTile (signature)
A 300–340px-tall, 28px-radius colour field from `TILE_FIELDS`, with the mark at white/13 cropped top-right and one white example screen floating centred. On hover the screen lifts 6px and the mark turns 8° (500–700ms, same ease).

### SetlMark and the half mark
The logo mark redrawn as hatched line art. In heroes it is the **half mark**: pale half-mark lilac at stroke 1, sized up to 1180–1320px and cropped by the right edge so only half shows. On the home hero it plays `assemble` once: its sectors turn into place in sequence over 1000ms, staggered 70ms apart. On dark grounds it is white at 5–14%; on lilac it is white at 70%. Phones: a second assembling half mark (150vw, same #f0eafb at stroke 1) bleeds off the right edge behind the headline, so the one authored motion plays at every width.

## Do's and Don'ts

### Do:
- **Do** open every public page on a white hero with an ink headline and the pale half mark (#f0eafb, stroke 1) cropped by the right edge.
- **Do** give "Talk to the team" and "Get API keys" equal size and weight wherever they appear as the hero or closing pair: ink solid plus white with an ink ring on white, and white plus ink on colour.
- **Do** float the hero ConnectSheet as frosted glass directly on the white hero, and switch to the solid sheet (`glass={false}`) on colour fields.
- **Do** keep the selected institution row's lilac fill and 1px signal-violet ring.
- **Do** centre the nav links in the floating pill, with the logo left and actions right.
- **Do** show institution logos as their own unblurred artwork, always beside the institution's name.
- **Do** label every illustrative screen, account and connect step with the Example chip.
- **Do** keep gradients, glows and shadow tints inside the mark's plum-to-magenta family.

### Don't:
- **Don't** blur, tint or obscure institution logos.
- **Don't** put a stage panel or colour block behind the hero connect sheet.
- **Don't** show customer logos, testimonials, usage counts or live-bank claims. Proof is limited to product truths, published pricing and NIC Karachi.
- **Don't** make one of the two hero or closing CTAs smaller, ghosted or demoted.
- **Don't** use Plus Jakarta Sans or any second display face on the public site.
- **Don't** use signal violet as a flat fill on a section, card or button. Outside interaction it appears only as the field's low-opacity glow.
- **Don't** use grey or black drop shadows on floating white objects. Tint them plum.
