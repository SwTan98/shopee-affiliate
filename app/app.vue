<template>
  <div class="page">

    <header class="header">
      <div class="header-inner">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c47c2a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
        <span class="header-title">shopee affiliate</span>
      </div>
    </header>

    <main class="main">
      <div class="col">

        <!-- Screen-reader live region -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">{{ liveMessage }}</div>

        <!-- Input -->
        <div class="section">
          <label class="eyebrow" for="url-input">Paste a Shopee link</label>
          <input
            id="url-input"
            v-model="rawUrl"
            type="url"
            placeholder="https://my.shp.ee/… or https://shopee.com.my/…"
            class="url-input"
            :class="{ 'url-input--filled': rawUrl }"
            autocomplete="off"
            spellcheck="false"
            @keydown.enter="generate"
          />
        </div>

        <button
          class="cta"
          :class="{ 'cta--disabled': !rawUrl.trim() || loading }"
          :disabled="!rawUrl.trim() || loading"
          :aria-busy="loading"
          @click="generate"
        >
          {{ loading ? 'Resolving…' : 'Add affiliate tag' }}
        </button>

        <!-- Error -->
        <p v-if="error" class="error-msg" role="alert">{{ error }}</p>

        <!-- Transform result -->
        <Transition name="reveal">
          <div v-if="result" class="result">

            <!-- Transform bridge -->
            <div class="bridge" aria-hidden="true">
              <div class="bridge-line" />
              <div class="bridge-tag">
                Affiliate ID: <strong>{{ affiliateId }}</strong>
              </div>
              <div class="bridge-line" />
            </div>

            <!-- Output -->
            <div class="section">
              <p id="tagged-link-label" class="eyebrow">Tagged link</p>
              <div
                class="output-url"
                aria-labelledby="tagged-link-label"
                tabindex="0"
              >{{ result.affiliateLink }}</div>
            </div>

            <div class="actions">
              <button
                class="action-btn"
                :class="{ 'action-btn--copied': copied }"
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
                class="action-btn action-btn--open"
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
            <div v-if="result.shopId || result.itemId" class="meta">
              <span v-if="result.shopId">shop <code>{{ result.shopId }}</code></span>
              <span v-if="result.shopId && result.itemId" class="meta-sep">·</span>
              <span v-if="result.itemId">item <code>{{ result.itemId }}</code></span>
            </div>

          </div>
        </Transition>

      </div>
    </main>

    <footer class="footer">
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
/* ── Palette + Layout ── */
.page {
  --bg:          #0f0e0d;
  --surface:     #171614;
  --surface-2:   #1e1c19;
  --border:      #2e2b25;
  --border-2:    #3e3b33;
  --text:        #d4c5a9;
  --text-2:      #8d7d6d;   /* bumped from #7a7065 — ~5:1 on bg */
  --text-3:      #5e5650;   /* bumped from #4a4840 — decorative use only */
  --amber:       #c47c2a;
  --amber-dim:   #7a4e1a;
  --amber-bg:    #1e1710;
  --amber-border:#3d2e18;
  --green:       #6aaa80;
  --green-bg:    #111e15;
  --green-border:#1e3d28;
  --red:         #a06050;
  --red-bg:      #1a1010;
  --red-border:  #3d2018;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

/* ── Utility ── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  font-family: ui-monospace, monospace;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 64px;
}

.col {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer {
  text-align: center;
  padding: 0 0 24px;
  font-size: 11px;
  font-family: ui-monospace, monospace;
  color: var(--text-3);
  letter-spacing: 0.05em;
}

/* ── Form ── */
.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-2);
  font-weight: 500;
  margin: 0;
}

.url-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 13px;
  font-family: ui-monospace, monospace;
  color: var(--text);
  caret-color: var(--amber);
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}

.url-input::placeholder {
  color: var(--text-3);
}

.url-input:focus {
  border-color: var(--border-2);
  background: var(--surface-2);
}

.url-input:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}

.url-input--filled {
  border-color: var(--border-2);
}

.cta {
  width: 100%;
  padding: 13px;
  border-radius: 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  letter-spacing: 0.02em;
}

.cta:hover:not(.cta--disabled) {
  background: var(--border);
  color: var(--text);
  border-color: var(--border-2);
}

.cta:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}

.cta--disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.error-msg {
  font-size: 12px;
  color: var(--red);
  background: var(--red-bg);
  border: 1px solid var(--red-border);
  border-radius: 8px;
  padding: 10px 14px;
  margin: 0;
}

/* ── Transform bridge ── */
.bridge {
  display: flex;
  align-items: center;
  gap: 12px;
}

.result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bridge-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.bridge-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--amber-bg);
  border: 1px solid var(--amber-border);
  border-radius: 100px;
  padding: 5px 12px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: var(--amber);
  white-space: nowrap;
}

/* ── Output ── */
.output-url {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 13px;
  font-family: ui-monospace, monospace;
  color: var(--text-2);
  word-break: break-all;
  line-height: 1.6;
  cursor: text;
  user-select: all;
}

.output-url:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}

/* ── Actions ── */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 16px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  text-decoration: none;
}

.action-btn:hover {
  background: var(--border);
  color: var(--text);
  border-color: var(--border-2);
}

.action-btn:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
}

.action-btn--copied {
  background: var(--green-bg) !important;
  border-color: var(--green-border) !important;
  color: var(--green) !important;
}

.action-btn--open {
  flex: 0.6;
}

/* ── Meta ── */
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-3);
  padding: 2px 0;
}

.meta code {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: var(--text-2);
}

.meta-sep {
  color: var(--border-2);
}

/* ── Transition ── */
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
