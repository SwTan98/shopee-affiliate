import { describe, it, expect } from 'vitest'
import { parseShopeeUrl, buildAffiliateLink, isShortUrl, unwrapAffiliateLink } from '../app/utils/shopee'

describe('parseShopeeUrl', () => {
  it('extracts shopId and itemId from a standard product URL', () => {
    const url = 'https://shopee.com.my/product-name-i.123456.12345678'
    expect(parseShopeeUrl(url)).toEqual({ shopId: '123456', itemId: '12345678' })
  })

  it('extracts from a resolved short-link URL with query string', () => {
    const url = 'https://shopee.com.my/shop-name/product-i.654321.98765432?some=param'
    expect(parseShopeeUrl(url)).toEqual({ shopId: '654321', itemId: '98765432' })
  })

  it('handles URLs with slash separator between IDs', () => {
    const url = 'https://shopee.com.my/shop.123456/item/987654321'
    const result = parseShopeeUrl(url)
    // The regex requires 6+ digit shopId and 8+ digit itemId with [/.-] separator
    expect(result.shopId).toBeNull()
    expect(result.itemId).toBeNull()
  })

  it('returns nulls for a non-product shopee URL', () => {
    const url = 'https://shopee.com.my/home'
    expect(parseShopeeUrl(url)).toEqual({ shopId: null, itemId: null })
  })

  it('returns nulls for a non-shopee URL', () => {
    const url = 'https://example.com/123456.12345678'
    expect(parseShopeeUrl(url)).toEqual({ shopId: null, itemId: null })
  })

  it('requires 8+ digit itemId', () => {
    // itemId only 7 digits — should not match
    const url = 'https://shopee.com.my/product-i.123456.1234567'
    expect(parseShopeeUrl(url)).toEqual({ shopId: null, itemId: null })
  })

  it('extracts shopId and itemId directly from a raw, still-wrapped affiliate URL', () => {
    const affiliateLink = 'https://s.shopee.com.my/an_redir?origin_link=https%3A%2F%2Fshopee.com.my%2Fproduct-i.123456.12345678&affiliate_id=aff123'
    expect(parseShopeeUrl(affiliateLink)).toEqual({ shopId: '123456', itemId: '12345678' })
  })

  it('falls back to matching the raw string on malformed percent-encoding', () => {
    const url = 'https://shopee.com.my/50%-off-i.123456.12345678'
    expect(parseShopeeUrl(url)).toEqual({ shopId: '123456', itemId: '12345678' })
  })
})

describe('buildAffiliateLink', () => {
  it('strips query string and appends origin_link and affiliate_id', () => {
    const link = buildAffiliateLink('https://shopee.com.my/product-i.123456.12345678?ref=test', 'aff123')
    expect(link).toBe(
      'https://s.shopee.com.my/an_redir?origin_link=https%3A%2F%2Fshopee.com.my%2Fproduct-i.123456.12345678&affiliate_id=aff123'
    )
  })

  it('omits affiliate_id param when affiliateId is empty', () => {
    const link = buildAffiliateLink('https://shopee.com.my/product-i.123456.12345678', '')
    expect(link).not.toContain('affiliate_id')
    expect(link).toContain('origin_link=')
  })

  it('shaves off the descriptive title slug, keeping only domain + product-i.{shopId}.{itemId}', () => {
    const url = 'https://shopee.com.my/Tefal-Home-Chef-Smart-Multicooker-(6L)-Free-SS-Inner-Pot-CY601-XA622D-i.23746946.23471758432'
    const link = buildAffiliateLink(url, 'aff123')
    expect(link).toBe(
      'https://s.shopee.com.my/an_redir?origin_link=https%3A%2F%2Fshopee.com.my%2Fproduct-i.23746946.23471758432&affiliate_id=aff123'
    )
  })

  it('falls back to the full stripped URL when no product IDs are found', () => {
    const link = buildAffiliateLink('https://shopee.com.my/some-category-page?x=1', 'aff123')
    expect(link).toContain(encodeURIComponent('https://shopee.com.my/some-category-page'))
  })

  it('always points to the s.shopee.com.my redirect endpoint', () => {
    const link = buildAffiliateLink('https://shopee.com.my/product-i.123456.12345678', 'x')
    expect(link.startsWith('https://s.shopee.com.my/an_redir?')).toBe(true)
  })
})

describe('unwrapAffiliateLink', () => {
  it('extracts origin_link from a valid affiliate redirect URL', () => {
    const affiliateLink = 'https://s.shopee.com.my/an_redir?origin_link=https%3A%2F%2Fshopee.com.my%2Fproduct-i.123456.12345678&affiliate_id=aff123'
    expect(unwrapAffiliateLink(affiliateLink)).toBe('https://shopee.com.my/product-i.123456.12345678')
  })

  it('passes through a regular shopee.com.my product URL unchanged', () => {
    const url = 'https://shopee.com.my/product-i.123456.12345678'
    expect(unwrapAffiliateLink(url)).toBe(url)
  })

  it('passes through an unrelated URL unchanged', () => {
    const url = 'https://example.com/some-page'
    expect(unwrapAffiliateLink(url)).toBe(url)
  })

  it('returns original when affiliate URL has no origin_link param', () => {
    const url = 'https://s.shopee.com.my/an_redir?affiliate_id=aff123'
    expect(unwrapAffiliateLink(url)).toBe(url)
  })

  it('is idempotent: round-trip through buildAffiliateLink then back', () => {
    const productUrl = 'https://shopee.com.my/product-i.123456.12345678'
    const affiliate = buildAffiliateLink(productUrl, 'aff123')
    expect(unwrapAffiliateLink(affiliate)).toBe(productUrl)
  })
})

describe('isShortUrl', () => {
  it('returns true for shp.ee URLs', () => {
    expect(isShortUrl('https://shp.ee/abc123')).toBe(true)
  })

  it('returns true for shope.ee URLs', () => {
    expect(isShortUrl('https://shope.ee/xyz')).toBe(true)
  })

  it('returns false for shopee.com.my URLs', () => {
    expect(isShortUrl('https://shopee.com.my/product-i.123456.12345678')).toBe(false)
  })

  it('returns false for other URLs', () => {
    expect(isShortUrl('https://example.com')).toBe(false)
  })
})
