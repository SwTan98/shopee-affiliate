<template>
  <Transition name="reveal" appear>
    <div class="flex flex-col gap-4">
      <TransformDivider />
      <TaggedLinkDisplay :link="result.affiliateLink" />
      <div class="flex gap-2">
        <CopyButton :text="result.affiliateLink" />
        <BaseButton
          class="flex-[0.6]"
          :href="result.affiliateLink"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open affiliate link in new tab"
        >
          Open
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </BaseButton>
      </div>
      <ProductIds :shop-id="result.shopId" :item-id="result.itemId" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { AffiliateResult } from '~/composables/useAffiliateLink'

defineProps<{ result: AffiliateResult }>()
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
