# Site UI/UX audit (UI/UX Pro Max lens)

_Audit date: Mar 2026 · Stack: static HTML/CSS/JS, Decap CMS JSON_

This document maps the installed **UI/UX Pro Max** priority table to **jordan-croome-freelance** and lists suggested changes. Items are ordered by impact.

---

## 1. Accessibility (CRITICAL)

| Finding | Severity | Suggestion |
|--------|----------|------------|
| **Homepage `cursor: none`** + custom dot/ring | High | Custom cursor hides system cursor; confusing for many users and can imply broken UI. **Respect `prefers-reduced-motion`**: restore default cursor and hide custom cursor when reduced motion is on; or remove custom cursor sitewide for simpler a11y. |
| **No skip link** | Medium | Add visually hidden “Skip to main content” as first focusable element; target `#main` or first `<main>` / `#hero` on home. |
| **Focus visibility** | Medium | Ensure `:focus-visible` outlines on links, buttons, inputs (2px+ contrast). Custom cursor sites often strip focus rings—audit `outline: none` usage. |
| **Decorative `alt=""` on logos** | Low | OK when parent link has `aria-label="Jordan Croome home"`. Keep pattern consistent. |
| **Project/cover images with empty `alt`** | Medium | Work grid and case media: use **client + project title** in `alt` when image conveys content (skill: meaningful alt). |
| **Heading hierarchy** | Low | Contact: `h1` top band, `h2` form—good. Case studies: confirm single `h1` per view after JS render. |
| **`prefers-reduced-motion`** | High | Marquee, reveal-on-scroll, loader, hero animations should reduce or disable motion (WCAG 2.2). |

---

## 2. Touch & interaction (CRITICAL)

| Finding | Suggestion |
|--------|------------|
| **Hamburger icon** | Three 1px lines—hit target may be &lt; 44×44px. Increase tap area (`min-width`/`min-height` 44px, padding). |
| **Hover-only affordances** | Work cards expose title on hover—on touch, ensure same info is visible or tappable (e.g. always show title on mobile or after tap). |
| **Contact form submit** | Formspree path: button disables during fetch—good. Mailto fallback: no in-page success state—consider inline note after `mailto:` opens. |
| **`touch-action: manipulation`** | Optional on primary scroll/tap regions to reduce 300ms tap delay on older mobile WebKit. |

---

## 3. Performance (HIGH)

| Finding | Suggestion |
|--------|------------|
| **Hero WebGL (Unicorn)** | Heavy LCP risk; ensure poster/fallback and lazy strategy; document “reduce motion” to skip or static poster. |
| **Images** | Prefer explicit `width`/`height` or aspect-ratio to limit CLS; lazy-load below-fold project images (many already `loading="lazy"`). |
| **Font loading** | `preconnect` to Google Fonts is good; consider `font-display: swap` via link params if not already. |

---

## 4. Style & consistency (HIGH)

| Finding | Suggestion |
|--------|------------|
| **Duplicated CSS** | Same nav/footer tokens repeated per page—long-term: one `site.css` or build step to avoid drift (Services vs Contact already aligned once). |
| **Dual contact journeys** | Home `#contact` + `/contact` + footer CTA—clear but redundant; consider one primary CTA copy everywhere. |

---

## 5. Layout & responsive (HIGH)

| Finding | Suggestion |
|--------|------------|
| **Viewport** | Meta viewport present on pages checked—keep `maximum-scale` unrestricted unless required. |
| **Horizontal scroll** | `overflow-x: hidden` on body (home)—verify no clipped focus rings. |
| **Work list** | Full-bleed stacks—strong on desktop; confirm readable type scale on small phones (filters, titles). |

---

## 6. Typography & color (MEDIUM)

| Finding | Suggestion |
|--------|------------|
| **Space Mono at 300** | Distinctive but dense for long reading; consider 400 for body on article-like blocks only, or keep for brand consistency. |
| **Orange on beige** | Spot-check contrast on small caps labels (`#c45a00`, `#b84f00`) vs `#f0ede8` for WCAG AA (≥4.5:1 for 12–14px). |
| **Design tokens** | Centralize in `:root` shared sheet to match **design-system** skill direction (semantic tokens). |

---

## 7. Animation (MEDIUM)

| Finding | Suggestion |
|--------|------------|
| **Reveal + marquee** | Durations ~0.9s / infinite marquee—add `@media (prefers-reduced-motion: reduce)` to set `animation: none` / instant opacity. |
| **Loader** | Respect reduced motion: shorter or no fake progress animation. |

---

## 8. Forms & feedback (MEDIUM)

| Finding | Suggestion |
|--------|------------|
| **Contact form** | Labels are visible—good. Add **inline validation** messages on blur for email format. |
| **Newsletter** | Client-only “success” state—document that it’s placeholder until Mailchimp/ConvertKit/etc. |
| **Form errors** | Formspree errors show generic message—optional: map common API errors to friendlier copy. |

---

## 9. Navigation (HIGH)

| Finding | Suggestion |
|--------|------------|
| **Active state** | Only some pages mark `active` nav item—apply consistently (e.g. Contact page highlight “Contact” if in nav). |
| **Deep links** | Home `#contact` works with `scroll-padding-top`—good. Document in footer for CMS editors. |
| **Case study back** | “Back to work” behavior—ensure keyboard and SR order is logical. |

---

## 10. Charts & data

_Not applicable_ (no dashboards).

---

## Quick wins (recommended order)

1. **`prefers-reduced-motion`** for marquee, reveals, loader, optional hero.  
2. **Larger hamburger touch target** on all pages.  
3. **Skip link** on home + inner pages.  
4. **`focus-visible`** styles for interactive elements.  
5. **Project image `alt`** from CMS title + client.  
6. **Homepage cursor**: disable custom cursor when `prefers-reduced-motion: reduce` or remove globally.  
7. **Extract shared CSS** when you next touch multiple pages.

---

## Skill installation (this repo)

- **`.cursor/skills/ui-ux-pro-max/SKILL.md`** — main skill (UI/UX Pro Max).  
- **Sub-skills**: `design/`, `brand/`, `design-system/`, `ui-styling/`, etc. — use for deeper token/brand work; script paths in those files may still reference `~/.claude/skills/` if you run CLI tools outside Cursor.
