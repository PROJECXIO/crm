<template>
  <div
    class="flex dark:bg-dark"
    :style="{
      boxShadow: '0px 4px 40px 0px #00000021',
      backgroundColor: styles.header_bg,
    }"
  >
    <div id="app-header" class="flex-1"></div>
    <div class="flex items-center justify-center">
      <CallUI />
    </div>
  </div>
</template>

<script setup>
import CallUI from '@/components/Telephony/CallUI.vue'
import { ThemeCustomization } from '@/composables/settings'
import { computed } from 'vue'
const styles = computed(() => ThemeCustomization.doc || '#fff')
</script>
