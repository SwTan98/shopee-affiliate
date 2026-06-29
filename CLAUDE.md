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

All styles are scoped CSS in `app/app.vue` using CSS custom properties (design tokens defined on `.page`). Tailwind is installed but the app does not use Tailwind utility classes in `app.vue` — the custom token system is used directly. The Tailwind config extends the default theme with a `shopee` color palette but it is not currently used.
