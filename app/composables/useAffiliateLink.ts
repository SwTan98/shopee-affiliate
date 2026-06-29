import { parseShopeeUrl, buildAffiliateLink, isShortUrl } from '~/utils/shopee'

export interface AffiliateResult {
  shopId: string | null
  itemId: string | null
  affiliateLink: string
}

export function useAffiliateLink() {
  const config = useRuntimeConfig()
  const affiliateId = config.public.affiliateId as string

  const rawUrl = ref('')
  const error = ref('')
  const loading = ref(false)
  const result = ref<AffiliateResult | null>(null)

  const liveMessage = computed(() => {
    if (loading.value) return 'Generating affiliate link…'
    if (result.value) return 'Affiliate link ready.'
    return ''
  })

  async function resolveShortUrl(url: string): Promise<string> {
    const data = await $fetch<{ url: string }>('/api/resolve', { query: { url } })
    return data.url
  }

  async function generate() {
    const url = rawUrl.value.trim()
    if (!url) return

    error.value = ''
    result.value = null
    loading.value = true

    try {
      const resolvedUrl = isShortUrl(url) ? await resolveShortUrl(url) : url
      const { shopId, itemId } = parseShopeeUrl(resolvedUrl)
      const affiliateLink = buildAffiliateLink(resolvedUrl, affiliateId)
      result.value = { shopId, itemId, affiliateLink }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Invalid URL — paste a full shopee.com.my product URL.'
    } finally {
      loading.value = false
    }
  }

  return { rawUrl, error, loading, result, liveMessage, generate }
}
