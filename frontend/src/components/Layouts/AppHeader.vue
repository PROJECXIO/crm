<template>
  <div
    class="flex"
    :style="{
      boxShadow: '0px 4px 40px 0px #00000021',
      backgroundColor:
        currentTheme === 'light' ? styles.doc?.header_bg : '#212121',
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
import { useTheme } from 'frappe-ui'
import { inject } from 'vue'
const styles = inject('$styles')

const { currentTheme } = useTheme()
</script>
