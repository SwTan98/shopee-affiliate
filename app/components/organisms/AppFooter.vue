<template>
  <footer class="text-center pb-6 font-mono text-[11px] text-sand-2 tracking-[0.05em]">
    affiliate_id={{ affiliateId || '—' }}
  </footer>
</template>

<script setup lang="ts">
const affiliateId = useRuntimeConfig().public.affiliateId as string
</script>
