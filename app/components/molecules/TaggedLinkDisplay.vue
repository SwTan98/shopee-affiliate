<template>
  <div class="flex flex-col gap-2">
    <p id="tagged-link-label" class="text-[11px] tracking-[0.12em] uppercase text-sand-2 font-medium">Tagged link</p>
    <div
      class="bg-surface border border-wire rounded-[10px] py-[13px] px-4 text-[13px] font-mono text-sand-2 break-all leading-[1.6] cursor-text select-all outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
      aria-labelledby="tagged-link-label"
      tabindex="0"
    >{{ link }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ link: string }>()
</script>
