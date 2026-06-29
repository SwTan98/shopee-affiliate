<template>
  <input
    :id="id"
    :value="modelValue"
    type="url"
    :placeholder="placeholder"
    class="w-full bg-surface border border-wire rounded-[10px] py-[13px] px-4 text-base font-mono text-sand caret-amber outline-none transition-colors duration-150 placeholder:text-sand-2 focus:border-wire-hi focus:bg-surface-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
    :class="{ 'border-wire-hi': modelValue }"
    autocomplete="off"
    spellcheck="false"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @keydown.enter="$emit('submit')"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  id?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()
</script>
