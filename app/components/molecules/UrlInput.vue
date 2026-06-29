<template>
  <div class="flex flex-col gap-2">
    <label class="text-[11px] tracking-[0.12em] uppercase text-sand-2 font-medium" for="url-input">
      Paste a Shopee link
    </label>
    <BaseInput
      id="url-input"
      :model-value="modelValue"
      placeholder="https://my.shp.ee/… or https://shopee.com.my/…"
      @update:model-value="$emit('update:modelValue', $event)"
      @submit="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
}>()
</script>
