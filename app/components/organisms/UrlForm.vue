<template>
  <div class="flex flex-col gap-4">
    <UrlInput
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      @submit="$emit('generate')"
    />
    <BaseButton
      variant="primary"
      :disabled="!modelValue.trim() || loading"
      :aria-busy="loading"
      @click="$emit('generate')"
    >
      {{ loading ? 'Resolving…' : 'Add affiliate tag' }}
    </BaseButton>
    <p v-if="error" class="text-xs text-red bg-red-bg border border-red-border rounded-lg py-[10px] px-[14px]" role="alert">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  loading: boolean
  error: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'generate': []
}>()
</script>
