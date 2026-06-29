# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:3000)
npm run build     # production build
npm run generate  # static site generation
npm run preview   # preview production build
```

There are no test or lint scripts defined.

## Environment

Copy `.env.example` to `.env` and set your Shopee Affiliate ID:

```
NUXT_PUBLIC_AFFILIATE_ID=your_affiliate_id_here
```

The affiliate ID is exposed to the browser via Nuxt's `runtimeConfig.public`. It is injected as a query param (`affiliate_id`) when building the affiliate redirect URL.

## Architecture

This is a minimal **Nuxt 4 SPA** (`ssr: false`) with a single server API route. There are no pages — the entire UI lives in `app/app.vue` as one self-contained component.

### Link resolution flow

1. User pastes a URL into `app/app.vue`.
2. If the URL is a Shopee short link (`shp.ee` / `shope.ee`), the client calls `GET /api/resolve?url=<short-url>`.
3. `server/api/resolve.ts` follows redirects server-side (bypassing CORS) and returns the resolved `shopee.com.my` URL.
4. Back on the client, `parseShopeeUrl()` extracts `shopId` and `itemId` from the resolved URL via regex (`/shopee\.com\.my\/[^?#]*[/.-](\d{6,})\.(\d{8,})/`).
5. `buildAffiliateLink()` strips the query string, then constructs `https://s.shopee.com.my/an_redir?origin_link=<clean-url>&affiliate_id=<id>`.

The server route exists solely to resolve short URLs — direct `shopee.com.my` links are handled entirely client-side without a network round trip.

### Styling

Styling is done with Tailwind utility classes directly in `app/app.vue` templates (e.g. `bg-base`, `text-sand`, `border-wire`, `bg-surface-hi`). `tailwind.config.js` extends the default theme with a custom dark-mode color palette — `base`, `surface` (+ `hi`), `wire` (+ `hi`), `sand` (+ `2`/`3`), `amber` (+ `dim`/`bg`/`border`), `green`, `red` (each with `bg`/`border` variants), plus an unused legacy `shopee` palette. When adding new UI, reuse these token names rather than introducing raw hex values or new ad-hoc colors.

The only hand-written CSS lives in two unscoped/scoped `<style>` blocks at the bottom of `app.vue`: the `.reveal-*` transition classes for the result reveal animation (with a `prefers-reduced-motion` override), and a global `html, body` background-color rule (kept in sync with `theme-color` in `nuxt.config.ts`) to avoid a flash of mismatched browser chrome on Safari mobile.

### Accessibility conventions

Recent commits hardened `app.vue` for accessibility — follow these patterns when extending the UI:
- Interactive elements use `focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2` instead of relying on default browser focus styles.
- An `aria-live="polite"` region (`liveMessage`) announces loading/result state changes for screen readers; update it when adding new async states.
- Buttons that trigger async work set `:aria-busy="loading"`; disabled states use `disabled:opacity-[0.35] disabled:cursor-not-allowed` rather than hiding controls.
- Text/background color pairs are chosen to meet WCAG AA contrast (4.5:1) — check contrast before introducing new color combinations from the palette.
