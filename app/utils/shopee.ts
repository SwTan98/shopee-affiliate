export function parseShopeeUrl(url: string): { shopId: string | null; itemId: string | null } {
  let decoded = url
  try {
    decoded = decodeURIComponent(url)
  } catch {
    // malformed percent-encoding (e.g. a literal "%" in the path) — fall back to raw string
  }
  const match = decoded.match(/shopee\.com\.my\/[^?#]*[/.-](\d{6,})\.(\d{8,})/)
  if (match) return { shopId: match[1], itemId: match[2] }
  return { shopId: null, itemId: null }
}

export function buildAffiliateLink(productUrl: string, affiliateId: string): string {
  const url = new URL(productUrl)
  url.search = ''
  const { shopId, itemId } = parseShopeeUrl(url.toString())
  const cleanUrl = shopId && itemId ? `${url.origin}/product-i.${shopId}.${itemId}` : url.toString()
  const params = new URLSearchParams({ origin_link: cleanUrl })
  if (affiliateId) params.set('affiliate_id', affiliateId)
  return `https://s.shopee.com.my/an_redir?${params.toString()}`
}

export function isShortUrl(url: string): boolean {
  return /shp\.ee|shope\.ee/.test(url)
}

export function unwrapAffiliateLink(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 's.shopee.com.my' && parsed.pathname === '/an_redir') {
      const originLink = parsed.searchParams.get('origin_link')
      if (originLink) return originLink
    }
  } catch {
    // not a valid URL, fall through
  }
  return url
}
