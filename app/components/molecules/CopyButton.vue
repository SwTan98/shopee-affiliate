<template>
  <BaseButton
    class="flex-1"
    :class="copied ? '!bg-green-bg !border-green-border !text-green' : ''"
    :aria-label="copied ? 'Link copied to clipboard' : 'Copy link'"
    @click="copy(text)"
  >
    <svg v-if="copied" aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <svg v-else aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
    {{ copied ? 'Copied' : 'Copy' }}
  </BaseButton>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
const { copied, copy } = useClipboard()
</script>
