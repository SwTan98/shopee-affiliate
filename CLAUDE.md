# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:3000)
npm run build     # production build
npm run generate  # static site generation
npm run preview   # preview production build
npm test          # run unit tests (vitest)
```

## Environment

Copy `.env.example` to `.env` and set your Shopee Affiliate ID:

```
NUXT_PUBLIC_AFFILIATE_ID=your_affiliate_id_here
```

The affiliate ID is exposed to the browser via Nuxt's `runtimeConfig.public`. It is injected as a query param (`affiliate_id`) when building the affiliate redirect URL.

## Architecture

This is a minimal **Nuxt 4 SPA** (`ssr: false`) with a single server API route. The UI is organized using atomic design: atoms → molecules → organisms, with business logic extracted into composables and utils.

```
app/
  app.vue                        # thin root: aria-live region + layout shells
  utils/
    shopee.ts                    # pure functions: parseShopeeUrl, buildAffiliateLink, isShortUrl
  composables/
    useAffiliateLink.ts          # rawUrl, result, error, loading, liveMessage, generate()
    useClipboard.ts              # copied, copy(text) with textarea fallback
  components/
    atoms/
      AppLogo.vue                # SVG chain-link icon (single source for header + favicon)
      BaseButton.vue             # polymorphic button/a with variant='default'|'primary'
      BaseInput.vue              # url input with shared styles
    molecules/
      CopyButton.vue             # BaseButton + SVG icon toggle + useClipboard
      ProductIds.vue             # shop/item ID row (self-hides when both null)
      TaggedLinkDisplay.vue      # focusable monospace result box
      TransformDivider.vue       # hr + affiliate badge + hr
      UrlInput.vue               # label + BaseInput
    organisms/
      AppFooter.vue              # affiliate_id display
      AppHeader.vue              # logo + wordmark
      ResultPanel.vue            # Transition + result UI
      UrlForm.vue                # UrlInput + generate button + error alert
server/
  api/
    resolve.ts                   # follows short-link redirects server-side
tests/
  affiliate.test.ts              # unit tests for shopee.ts pure functions
public/
  favicon.svg                    # rounded-square badge reusing AppLogo paths
```

### Link resolution flow

1. User pastes a URL; state is managed by `useAffiliateLink()` in `app/composables/useAffiliateLink.ts`.
2. `isShortUrl()` in `app/utils/shopee.ts` checks for `shp.ee` / `shope.ee` hosts.
3. If short, the client calls `GET /api/resolve?url=<short-url>`; `server/api/resolve.ts` follows redirects server-side (bypassing CORS) and returns the resolved `shopee.com.my` URL.
4. `parseShopeeUrl()` extracts `shopId` and `itemId` via regex (`/shopee\.com\.my\/[^?#]*[/.-](\d{6,})\.(\d{8,})/`).
5. `buildAffiliateLink()` strips the query string, then constructs `https://s.shopee.com.my/an_redir?origin_link=<clean-url>&affiliate_id=<id>`.

The server route exists solely to resolve short URLs — direct `shopee.com.my` links are handled entirely client-side without a network round trip.

### Styling

Styling uses Tailwind utility classes across component files. `tailwind.config.js` extends the default theme with a custom dark-mode color palette — `base`, `surface` (+ `hi`), `wire` (+ `hi`), `sand` (+ `2`/`3`), `amber` (+ `dim`/`bg`/`border`), `green`, `red` (each with `bg`/`border` variants), plus an unused legacy `shopee` palette. When adding new UI, reuse these token names rather than introducing raw hex values or new ad-hoc colors.

Hand-written CSS is minimal:
- `.reveal-*` transition classes (with `prefers-reduced-motion` override) live in `ResultPanel.vue`'s scoped `<style>` block.
- A global `html, body` background-color rule lives in `app.vue`'s unscoped `<style>` block (kept in sync with `theme-color` in `nuxt.config.ts`) to avoid a flash of mismatched browser chrome on Safari mobile.

### Favicon and logo

`AppLogo.vue` is the single source of truth for the chain-link icon SVG paths. `public/favicon.svg` reuses the same paths wrapped in a rounded-square background (`fill="#1e1710"`) so it reads on any browser chrome. `nuxt.config.ts` registers it via `app.head.link`.

### Accessibility conventions

These patterns are encoded in the atom components — follow them when extending the UI:
- `BaseButton.vue` and `BaseInput.vue` include `focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2` so all interactive elements have a consistent amber focus ring.
- An `aria-live="polite"` region (`liveMessage`) in `app.vue` announces loading/result state changes; update `useAffiliateLink.ts` when adding new async states.
- `BaseButton` passes `:aria-busy` through to the element; the `primary` variant applies `disabled:opacity-[0.35] disabled:cursor-not-allowed` rather than hiding controls.
- Text/background color pairs are chosen to meet WCAG AA contrast (4.5:1) — check contrast before introducing new color combinations from the palette.

### Testing

Pure business-logic functions in `app/utils/shopee.ts` are covered by `tests/affiliate.test.ts` using Vitest (no Nuxt runtime required). Run with `npm test`.
