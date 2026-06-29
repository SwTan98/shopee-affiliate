<template>
  <div class="flex items-center gap-3" aria-hidden="true">
    <div class="flex-1 h-px bg-wire" />
    <div class="flex items-center gap-[5px] bg-amber-bg border border-amber-border rounded-full px-3 py-[5px] font-mono text-[11px] text-amber whitespace-nowrap">
      Affiliate ID: <strong>{{ affiliateId }}</strong>
    </div>
    <div class="flex-1 h-px bg-wire" />
  </div>
</template>

<script setup lang="ts">
const affiliateId = useRuntimeConfig().public.affiliateId as string
</script>
