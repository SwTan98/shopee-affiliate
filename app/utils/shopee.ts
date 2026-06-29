export function parseShopeeUrl(url: string): { shopId: string | null; itemId: string | null } {
  const match = url.match(/shopee\.com\.my\/[^?#]*[/.-](\d{6,})\.(\d{8,})/)
  if (match) return { shopId: match[1], itemId: match[2] }
  return { shopId: null, itemId: null }
}

export function buildAffiliateLink(productUrl: string, affiliateId: string): string {
  const url = new URL(productUrl)
  url.search = ''
  const params = new URLSearchParams({ origin_link: url.toString() })
  if (affiliateId) params.set('affiliate_id', affiliateId)
  return `https://s.shopee.com.my/an_redir?${params.toString()}`
}

export function isShortUrl(url: string): boolean {
  return /shp\.ee|shope\.ee/.test(url)
}
