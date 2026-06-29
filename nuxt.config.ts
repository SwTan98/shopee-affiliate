export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/tailwindcss"],
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      affiliateId: process.env.NUXT_PUBLIC_AFFILIATE_ID || '',
    },
  },
  app: {
    head: {
      title: "Shopee Affiliate Link Generator",
      meta: [
        {
          name: "description",
          content: "Generate Shopee affiliate links from any product URL",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0f0e0d" },
      ],
    },
  },
});
