<template>
  <div v-if="shopId || itemId" class="flex items-center gap-2 text-[11px] text-sand-2 py-0.5">
    <span v-if="shopId">shop <code class="font-mono text-[11px] text-sand-2">{{ shopId }}</code></span>
    <span v-if="shopId && itemId" class="text-wire-hi">·</span>
    <span v-if="itemId">item <code class="font-mono text-[11px] text-sand-2">{{ itemId }}</code></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  shopId: string | null
  itemId: string | null
}>()
</script>
