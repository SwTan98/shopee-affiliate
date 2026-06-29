export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    public: {
      affiliateId: "",
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
      ],
    },
  },
});
