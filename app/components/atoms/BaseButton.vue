<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="target"
    :rel="rel"
    :disabled="disabled"
    :aria-busy="ariaBusy || undefined"
    :aria-label="ariaLabel"
    :class="[baseClasses, href && 'no-underline', variantClasses]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  href?: string
  target?: string
  rel?: string
  variant?: 'default' | 'primary'
  disabled?: boolean
  ariaBusy?: boolean
  ariaLabel?: string
}>(), {
  variant: 'default',
})

const baseClasses = 'flex items-center justify-center gap-[6px] bg-surface-hi border border-wire text-sand-2 text-[13px] font-medium cursor-pointer transition-colors duration-150 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2'

const variantClasses = computed(() =>
  props.variant === 'primary'
    ? 'w-full rounded-[10px] py-[13px] tracking-[0.02em] hover:enabled:bg-wire hover:enabled:text-sand hover:enabled:border-wire-hi disabled:opacity-[0.35] disabled:cursor-not-allowed'
    : 'rounded-lg py-[11px] px-4 hover:bg-wire hover:text-sand hover:border-wire-hi'
)
</script>
