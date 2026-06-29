<template>
  <div class="min-h-screen flex flex-col bg-base text-sand">

    <header class="px-6 pt-5 pb-4 border-b border-wire">
      <div class="max-w-[480px] mx-auto flex items-center gap-2.5">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c47c2a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
        <span class="font-mono text-xs tracking-[0.14em] uppercase text-sand-2">shopee affiliate</span>
      </div>
    </header>

    <main class="flex-1 flex items-center justify-center px-6 pt-12 pb-16">
      <div class="w-full max-w-[480px] flex flex-col gap-4">

        <!-- Screen-reader live region -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">{{ liveMessage }}</div>

        <!-- Input -->
        <div class="flex flex-col gap-2">
          <label class="text-[11px] tracking-[0.12em] uppercase text-sand-2 font-medium" for="url-input">Paste a Shopee link</label>
          <input
            id="url-input"
            v-model="rawUrl"
            type="url"
            placeholder="https://my.shp.ee/… or https://shopee.com.my/…"
            class="w-full bg-surface border border-wire rounded-[10px] py-[13px] px-4 text-base font-mono text-sand caret-amber outline-none transition-colors duration-150 placeholder:text-sand-2 focus:border-wire-hi focus:bg-surface-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            :class="{ 'border-wire-hi': rawUrl }"
            autocomplete="off"
            spellcheck="false"
            @keydown.enter="generate"
          />
        </div>

        <button
          class="w-full py-[13px] rounded-[10px] bg-surface-hi border border-wire text-sand-2 text-[13px] font-medium cursor-pointer transition-colors duration-150 tracking-[0.02em] outline-none hover:enabled:bg-wire hover:enabled:text-sand hover:enabled:border-wire-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 disabled:opacity-[0.35] disabled:cursor-not-allowed"
          :disabled="!rawUrl.trim() || loading"
          :aria-busy="loading"
          @click="generate"
        >
          {{ loading ? 'Resolving…' : 'Add affiliate tag' }}
        </button>

        <!-- Error -->
        <p v-if="error" class="text-xs text-red bg-red-bg border border-red-border rounded-lg py-[10px] px-[14px]" role="alert">{{ error }}</p>

        <!-- Transform result -->
        <Transition name="reveal">
          <div v-if="result" class="flex flex-col gap-4">

            <!-- Transform bridge -->
            <div class="flex items-center gap-3" aria-hidden="true">
              <div class="flex-1 h-px bg-wire" />
              <div class="flex items-center gap-[5px] bg-amber-bg border border-amber-border rounded-full px-3 py-[5px] font-mono text-[11px] text-amber whitespace-nowrap">
                Affiliate ID: <strong>{{ affiliateId }}</strong>
              </div>
              <div class="flex-1 h-px bg-wire" />
            </div>

            <!-- Output -->
            <div class="flex flex-col gap-2">
              <p id="tagged-link-label" class="text-[11px] tracking-[0.12em] uppercase text-sand-2 font-medium">Tagged link</p>
              <div
                class="bg-surface border border-wire rounded-[10px] py-[13px] px-4 text-[13px] font-mono text-sand-2 break-all leading-[1.6] cursor-text select-all outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                aria-labelledby="tagged-link-label"
                tabindex="0"
              >{{ result.affiliateLink }}</div>
            </div>

            <div class="flex gap-2">
              <button
                class="flex-1 flex items-center justify-center gap-[6px] py-[11px] px-4 rounded-lg bg-surface-hi border border-wire text-sand-2 text-[13px] font-medium cursor-pointer transition-colors duration-150 outline-none hover:bg-wire hover:text-sand hover:border-wire-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                :class="copied ? ['!bg-green-bg', '!border-green-border', '!text-green'] : []"
                :aria-label="copied ? 'Link copied to clipboard' : 'Copy link'"
                @click="copy"
              >
                <svg v-if="copied" aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
              <a
                :href="result.affiliateLink"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-[0.6] flex items-center justify-center gap-[6px] py-[11px] px-4 rounded-lg bg-surface-hi border border-wire text-sand-2 text-[13px] font-medium no-underline transition-colors duration-150 outline-none hover:bg-wire hover:text-sand hover:border-wire-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                aria-label="Open affiliate link in new tab"
              >
                Open
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>

            <!-- Product IDs -->
            <div v-if="result.shopId || result.itemId" class="flex items-center gap-2 text-[11px] text-sand-2 py-0.5">
              <span v-if="result.shopId">shop <code class="font-mono text-[11px] text-sand-2">{{ result.shopId }}</code></span>
              <span v-if="result.shopId && result.itemId" class="text-wire-hi">·</span>
              <span v-if="result.itemId">item <code class="font-mono text-[11px] text-sand-2">{{ result.itemId }}</code></span>
            </div>

          </div>
        </Transition>

      </div>
    </main>

    <footer class="text-center pb-6 font-mono text-[11px] text-sand-2 tracking-[0.05em]">
      affiliate_id={{ affiliateId || '—' }}
    </footer>

  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const affiliateId = config.public.affiliateId as string

const rawUrl = ref('')
const error = ref('')
const copied = ref(false)
const loading = ref(false)

interface Result {
  shopId: string | null
  itemId: string | null
  affiliateLink: string
}

const result = ref<Result | null>(null)

const liveMessage = computed(() => {
  if (loading.value) return 'Generating affiliate link…'
  if (result.value) return 'Affiliate link ready.'
  return ''
})

function parseShopeeUrl(url: string): { shopId: string | null; itemId: string | null } {
  const match = url.match(/shopee\.com\.my\/[^?#]*[/.-](\d{6,})\.(\d{8,})/)
  if (match) return { shopId: match[1], itemId: match[2] }
  return { shopId: null, itemId: null }
}

function buildAffiliateLink(productUrl: string): string {
  const url = new URL(productUrl)
  url.search = ''
  const params = new URLSearchParams({ origin_link: url.toString() })
  if (affiliateId) params.set('affiliate_id', affiliateId)
  return `https://s.shopee.com.my/an_redir?${params.toString()}`
}

function isShortUrl(url: string) {
  return /shp\.ee|shope\.ee/.test(url)
}

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
    const affiliateLink = buildAffiliateLink(resolvedUrl)
    result.value = { shopId, itemId, affiliateLink }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid URL — paste a full shopee.com.my product URL.'
  } finally {
    loading.value = false
  }
}

async function copy() {
  if (!result.value) return
  try {
    await navigator.clipboard.writeText(result.value.affiliateLink)
  } catch {
    const el = document.createElement('textarea')
    el.value = result.value.affiliateLink
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<style scoped>
.reveal-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.reveal-enter-to {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal-enter-active {
    transition: none;
  }
}
</style>

<style>
html, body {
  background-color: #0f0e0d;
  margin: 0;
}
</style>
