<template>
  <Button
    variant="outline"
    class="flex-1 shadow-sm"
    size="lg"
    :label="__(label)"
  />
</template>

<script setup>
import Button from '@/components/frappe-ui/Button.vue'

defineProps({
  label: {
    type: String,
    default: 'Cancel',
  },
})
</script>
