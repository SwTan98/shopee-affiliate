<template>
  <div class="min-h-screen flex flex-col bg-base text-sand">
    <div aria-live="polite" aria-atomic="true" class="sr-only">{{ liveMessage }}</div>
    <AppHeader />
    <main class="flex-1 flex items-center justify-center px-6 pt-12 pb-16">
      <div class="w-full max-w-[480px] flex flex-col gap-4">
        <UrlForm v-model="rawUrl" :loading="loading" :error="error" @generate="generate" />
        <ResultPanel v-if="result" :result="result" />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { rawUrl, error, loading, result, liveMessage, generate } = useAffiliateLink()
</script>

<style>
html, body {
  background-color: #0f0e0d;
  margin: 0;
}
</style>
