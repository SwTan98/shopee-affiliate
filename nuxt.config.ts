export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      affiliateId: process.env.NUXT_PUBLIC_AFFILIATE_ID || '',
    },
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Shopee Affiliate Link Generator',
      meta: [
        { name: 'description', content: 'Generate Shopee affiliate links from any product URL' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
