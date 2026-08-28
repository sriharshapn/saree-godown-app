---
name: Udupu
description: Premium boutique catalog for sarees and dresses with WhatsApp-first inquiry.
colors:
  bg-main: "#0B0A0F"
  bg-secondary: "#16151E"
  bg-glass: "rgba(22, 21, 30, 0.6)"
  glass-border: "rgba(255, 255, 255, 0.08)"
  primary-gold: "#D4AF37"
  primary-gold-hover: "#F3CA47"
  primary-gold-dim: "rgba(212, 175, 55, 0.15)"
  accent-burgundy: "#8B1C31"
  accent-green: "#2E8B57"
  accent-blue: "#4169E1"
  text-main: "#F4F4F6"
  text-muted: "#A0A0A8"
  danger: "#FF6B6B"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  pill: "20px"
spacing:
  sm: "0.8rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, #D4AF37, #B8860B)"
    textColor: "#000000"
    rounded: "{rounded.sm}"
    padding: "0.8rem 1.5rem"
  button-primary-hover:
    backgroundColor: "linear-gradient(135deg, #F3CA47, #D4AF37)"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text-main}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 1.5rem"
  button-danger:
    backgroundColor: "rgba(139, 28, 49, 0.2)"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.8rem"
  card-glass:
    backgroundColor: "{colors.bg-glass}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

# Design System: Udupu

## Overview

**Creative North Star: "The Obsidian Showroom"**

Udupu is a dark, jewel-toned boutique catalog that makes every saree and dress feel like it belongs in an intimate high-end showroom. The near-black backgrounds recede completely, letting product imagery and the signature gold accent carry all the visual weight. The interface is deliberately understated — muted matte surfaces, razor-thin glass borders, barely-there chrome — so that the gold moments (CTAs, nav highlights, prices) land with maximum authority.

The design operates at two registers simultaneously: a premium admin tool for the owner that feels powerful and data-rich, and a customer-facing gallery that feels curated and editorial. Both share the same token vocabulary but the gallery strips back UI chrome and lets the photographs speak, while the admin panel layers on density and structure.

Motion is subtle and purposeful — a 0.3s ease on nearly everything, cards lifting 2px on hover, elements fading in with a 10px upward drift. The system is never flashy; it is merely, unfailingly precise.

**Key Characteristics:**
- Near-black canvas, glass-surface depth
- Single gold accent; every other color serves a functional role
- Outfit typeface — geometric, modern, and neutral
- Glassmorphism cards with backdrop-blur as the primary elevation metaphor
- Mobile-first gallery; sidebar-dominant admin

## Colors

The palette is strictly controlled: one warm gold accent against a near-black canvas, with functional greens, reds, and blues reserved for status indicators only.

### Primary
- **Antique Gold** (`#D4AF37`): The one voice. Used on primary CTAs, active nav items, price highlights, and gradient-text headings. Its rarity against the dark canvas makes it feel precious.
- **Bright Gold** (`#F3CA47`): Hover state only. Never used at rest.
- **Gold Whisper** (`rgba(212, 175, 55, 0.15)`): Ambient background tint for active nav state, focused inputs, and selected filter chips. Creates warmth without competing.

### Neutral
- **Obsidian** (`#0B0A0F`): The page background. Pure and deep enough to make cards feel like they float.
- **Deep Onyx** (`#16151E`): Sidebar, modals, and panel backgrounds. One step lighter than Obsidian; creates a subtle physical layering.
- **Glass Surface** (`rgba(22, 21, 30, 0.6)`): Glassmorphism cards. Semi-transparent so Obsidian bleeds through the blur.
- **Ghost Border** (`rgba(255, 255, 255, 0.08)`): Dividers and card outlines. Almost invisible — structure without weight.
- **Warm Frost** (`#F4F4F6`): Primary text. Warm-white for legibility without harshness.
- **Pewter** (`#A0A0A8`): Secondary text, labels, placeholders. Cool-grey contrast against the warm canvas.

### Functional Accents
- **Burgundy** (`#8B1C31`): Danger states only. Never decorative.
- **Alert Red** (`#FF6B6B`): Error text, "Only N left" badges, danger button text.
- **Forest Green** (`#2E8B57`): Sold status, success badges, WhatsApp button.
- **Royal Blue** (`#4169E1`): Revenue metric, informational highlights.

### Named Rules
**The One Voice Rule.** Gold is the only accent color used decoratively. Every other color (green, red, blue) is strictly functional — a status signal, never a style choice.

## Typography

**Display / Body Font:** Outfit (Google Fonts, weight 300–700, sans-serif fallback)

**Character:** Geometric and approachable, Outfit sits comfortably between editorial and utilitarian. Its even weight range makes it equally credible on a `2rem` product heading as on a `0.8rem` badge label.

### Hierarchy
- **Display** (600, 2rem, 1.2): Page and section headings. Used for the Udupu brand mark and primary `h1` elements.
- **Headline** (500, 1.5rem, 1.3): Section titles within the admin panel (`h2`). Never italicized.
- **Title** (600, 1.1rem, 1.4): Card product names, modal titles.
- **Body** (400, 1rem, 1.6): Descriptions, form labels with context, paragraph copy.
- **Label** (500–600, 0.8–0.9rem, auto): Badges, nav items, button text, metadata.

### Named Rules
**The Gradient Headline Rule.** Brand headings use the gold-to-bright-gold linear gradient (`90deg, #D4AF37 → #F3CA47 → #D4AF37`) via `background-clip: text`. This treatment is reserved for the logo wordmark and the most prominent heading on each surface — never repeated more than once per screen.

## Layout

The admin panel uses a fixed 250px sidebar with `border-right` separation, and a fluid main content area with `padding: 2rem 3rem`. The page container is capped at `1800px` and centered.

The card grid uses `repeat(auto-fill, minmax(280px, 1fr))` with a `1.5rem` gap — responsive without media-query breakpoints for the column count. At 1400px+, the inventory gallery expands its minimum to `300px` and the stats grid locks to 4 columns.

On mobile (≤768px), the sidebar becomes a horizontal scrolling tab bar at the top of the page. Main content padding collapses to `1.5rem 1rem`. The card grid drops to a single column. The `.flex-between` utility reflows to a vertical stack unless marked `.keep-row`.

**Density:** Medium. Cards have `1.5rem` internal padding; there's always breathing room between elements. The design is not sparse, but it never crowds.

## Elevation & Depth

Depth is achieved through three layered techniques rather than traditional box-shadows. The system is glass-surface-first, not shadow-first.

1. **Tonal layering**: Obsidian (`#0B0A0F`) → Deep Onyx (`#16151E`) → Glass Surface — three real background tones that stack physically without needing shadows to indicate hierarchy.
2. **Backdrop blur**: `backdrop-filter: blur(12px)` on `.glass-card` creates the perception of depth through environmental reflection. The blur radius is fixed at 12px; adjusting it breaks the coherence of the effect.
3. **Glow on interaction**: Hover triggers a gold glow shadow (`0 4px 30px rgba(212, 175, 55, 0.15)`) and a `translateY(-2px)` lift. This is the only moment the system uses a traditional drop shadow.

### Shadow Vocabulary
- **Gold Glow** (`0 4px 30px rgba(212, 175, 55, 0.15)`): Card hover state and active primary button.
- **Modal Depth** (`0 20px 40px rgba(0, 0, 0, 0.5)`): Modal dialog backdrop depth.

### Named Rules
**The Flat-By-Default Rule.** Surfaces carry no shadow at rest. The glow appears only on hover or interaction, making its appearance feel like the surface responding to your intent, not decoration.

## Shapes

The system uses a three-step radius scale: `8px` (sm), `16px` (md), `24px` (lg), plus a pill (`20px`) for badge/chip elements.

- **`8px` (sm)**: Buttons, inputs, selects, nav items, small badges, dropdown menus — interactive controls and tight containers.
- **`16px` (md)**: Glass cards — the primary content container.
- **`24px` (lg)**: Modals — the largest container on the page.
- **`20px` (pill)**: Status badges and filter chips — clearly non-rectangular to signal their categorical function.

The product image within the catalog card uses `overflow: hidden` with no explicit radius, allowing the card's `border-radius` to clip the image naturally. Aspect ratio is locked at `4/5` (portrait) to respect saree and dress photography proportions.

## Components

### Buttons
- **Shape:** Gently curved (8px radius, `--radius-sm`)
- **Primary:** Gold-to-dark-gold diagonal gradient (`135deg, #D4AF37 → #B8860B`), black text (weight 600), padding `0.8rem 1.5rem`. Hover brightens to `#F3CA47` and lifts `2px` with a gold glow.
- **Secondary:** Nearly invisible — `rgba(255,255,255,0.05)` background, ghost border, white text. Becomes slightly more opaque on hover.
- **Danger:** Burgundy-tinted background, alert-red text, burgundy border. Compact padding (`0.4rem 0.8rem`) for inline use in table rows.

### Cards / Glass Surface
- **Corner Style:** 16px radius (`--radius-md`)
- **Background:** `rgba(22, 21, 30, 0.6)` with `backdrop-filter: blur(12px)`
- **Border:** 1px solid `rgba(255, 255, 255, 0.08)`
- **Hover:** `translateY(-2px)` + gold glow shadow + border softens to `rgba(212, 175, 55, 0.3)`
- **Internal Padding:** `1.5rem`

### Inputs / Fields
- **Style:** Dark background (`rgba(0,0,0,0.2)`), ghost border, 8px radius, `0.8rem 1rem` padding
- **Focus:** Gold border (`--primary-gold`) + `2px` gold-dim ring (`box-shadow: 0 0 0 2px rgba(212,175,55,0.15)`)
- **Font:** Outfit (inherits from body)

### Navigation (Admin Sidebar)
- **Desktop:** 250px fixed sidebar, vertical list of `.nav-item` rows
- **Nav Item Default:** Muted grey text (`--text-muted`), transparent background, 8px radius
- **Nav Item Active / Hover:** Gold-dim background tint, gold text
- **Mobile:** Horizontal scrolling tab bar, nav items center-aligned, white-space nowrap

### Badges / Status Chips
- **Shape:** Pill (20px radius)
- **Available (success):** Green-tinted background (`rgba(46,139,87,0.2)`), bright green text (`#4ade80`), green border
- **Warning / Low Stock:** Gold-dim background, gold text, gold border
- **Partial / Info:** Blue-tinted background, light-blue text (`#60a5fa`), blue border

### Product Card (Customer Gallery)
- **Image Area:** `4/5` aspect ratio, `overflow: hidden`, dark scrim fallback
- **"Only N left" Badge:** Absolute-positioned top-right, red background, white text
- **Price Display:** Gold for standard price; red for sale price with strikethrough original
- **CTA:** Full-width WhatsApp green button (`#25D366`), white text, darkens on hover

## Do's and Don'ts

### Do:
- **Do** use `--primary-gold` (`#D4AF37`) as the singular accent — on no more than one primary action and one text highlight per screen.
- **Do** apply `backdrop-filter: blur(12px)` to every floating surface (cards, modals, dropdowns) — it is the defining depth metaphor.
- **Do** use the `translateY(-2px)` + gold glow combination for every interactive card hover — consistency here makes the whole UI feel alive.
- **Do** lock product image aspect ratio to `4/5` (portrait) to preserve saree and dress photography proportions.
- **Do** use the Outfit font across all text — no mixing with serif or other geometric sans-serifs.

### Don't:
- **Don't** introduce new decorative accent colors. Green is for sold/success, red is for danger, blue is for revenue — never swap their semantic roles.
- **Don't** add box-shadows to elements at rest. The Flat-By-Default Rule means shadows only respond to interaction.
- **Don't** use the gold gradient text treatment on more than one heading per screen. Its scarcity is what makes it land.
- **Don't** collapse the `backdrop-filter` to zero on glass cards for performance without providing a fallback background — the card will become transparent.
- **Don't** break the 8px / 16px / 24px radius scale. Introducing new radii fragments the form language.
