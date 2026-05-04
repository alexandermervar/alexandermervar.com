# Style Guide — alexandermervar.com

A reference for the visual design system. The source of truth is `public/styles/global.css` — this document explains the decisions behind it.

---

## Philosophy

The site is styled after a newspaper: black ink on white paper, strong typographic hierarchy, no decoration for its own sake. Every visual choice should serve legibility or structure. If something can be removed without losing meaning, remove it.

Rules:
- Links are always underlined in body text. No exceptions.
- Color is not used for decoration. The palette is black, white, and gray.
- Every interactive element must have a visible `:focus-visible` style.
- No rounded corners, no shadows, no gradients.

---

## Color palette

All colors are defined as CSS custom properties in `:root`. Use the variables — never hardcode hex values in new rules.

| Variable       | Value     | Role                          | Contrast vs white |
|----------------|-----------|-------------------------------|-------------------|
| `--ink`        | `#1a1a1a` | Primary text, borders, nav    | 16.7:1 — AAA      |
| `--ink-muted`  | `#595959` | Secondary text, metadata      |  7.0:1 — AAA      |
| `--rule`       | `#d0d0d0` | Dividers, borders, tag outlines | decorative only |
| `--paper`      | `#ffffff` | Page background               | —                 |

All text colors meet WCAG AA (4.5:1 minimum for normal text). `--ink` and `--ink-muted` both meet the stricter AAA standard (7:1).

---

## Typography

| Role            | Font                           | Notes                                      |
|-----------------|--------------------------------|--------------------------------------------|
| Body text       | `Georgia, 'Times New Roman', serif` | Warm, editorial. Used for all prose.  |
| UI / headings   | `system-ui, -apple-system, sans-serif` | Clean contrast to body. Used for nav, headings, labels, meta. |

### Type scale

Base size: `18px` (set on `html`). All other sizes are relative (`rem`).

| Element     | Size       | Weight | Font    |
|-------------|------------|--------|---------|
| `h1`        | `1.9rem`   | 700    | UI      |
| `h2`        | `1.25rem`  | 700    | UI      |
| `h3`        | `1.05rem`  | 700    | UI      |
| Post title  | `1.1rem`   | 600    | UI      |
| Body        | `1rem`     | 400    | Body    |
| Meta / tags | `0.8rem`   | 400    | UI      |
| Footnotes   | `0.875rem` | 400    | Body    |

Line height: `1.75` for body prose, `1.2` for headings.

On screens narrower than `480px`, the base size drops to `16px` and `h1` scales to `1.6rem`.

---

## Layout

Single-column, centered. Max width `680px`. Horizontal padding `1.25rem` on both sides.

The container has no top padding — the masthead (`site-header`) handles vertical rhythm at the top of each page.

---

## Components

### Masthead

```
3px solid --ink   ← top rule
  HOME   BLOG   PROJECTS   RSS   ← nav, uppercase, 0.875rem
1px solid --rule  ← bottom rule
```

The top and bottom rules together create the masthead effect. Nav items are uppercase via `text-transform`, 500 weight, no underline (the uppercase treatment makes the interactive context clear).

### H1

Every page `h1` gets a `1px solid --rule` bottom border to anchor it on the page. This acts as a section divider between the page title and its content. Remove `border-bottom: none` on `article .post-header h1` preserves this in article headers.

### Post list

Items are separated by `1px solid --rule` top and bottom borders. No bullets. The post title is a visible underlined link. The description is `--ink-muted` serif, smaller than the title.

### Tags

Minimal: small uppercase text, `1px solid --rule` border, no background fill. Tags communicate taxonomy without drawing attention.

### Footer

Mirrors the masthead: `3px solid --ink` top rule, creating a frame around the page content. Footer text and links use `--ink-muted`.

---

## Accessibility

- **Skip link:** Hidden off-screen until focused. Becomes visible on keyboard tab, jumps to `#main`. Styled with `--ink` background and `--paper` text.
- **Focus styles:** All interactive elements use `outline: 2px solid var(--ink); outline-offset: 3px` on `:focus-visible`. This is keyboard-only — mouse users don't see it.
- **Landmarks:** `<header>`, `<nav aria-label="Main navigation">`, `<main id="main">`, `<footer>` are all present on every page.
- **Images:** All `<img>` elements in posts must include descriptive `alt` text.
- **External links:** All external links use `target="_blank" rel="noopener"` to prevent tab-napping.
- **Contrast:** See palette table above. All text passes WCAG AA at minimum.

---

## Favicon

Generated via [favicon.io](https://favicon.io/favicon-generator/) from text:

| Setting          | Value      |
|------------------|------------|
| Text             | AM         |
| Font             | Roboto     |
| Font color       | `#FFFFFF`  |
| Background color | `#1a1a1a`  |
| Background shape | Rounded    |

Files in `public/`: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`.

---

## What not to do

- Don't use color for emphasis — use weight or size instead.
- Don't add `border-radius` to anything.
- Don't suppress `text-decoration` on body links.
- Don't add new hex values directly — extend the `:root` variables if a new role is needed.
- Don't use JavaScript for anything that can be done in HTML or CSS.
