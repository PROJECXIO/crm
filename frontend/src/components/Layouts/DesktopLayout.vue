<template>
  <div class="flex h-screen w-screen relative">
    <div
      class="h-full border-r dark:border-r-gray-50/30"
      :style="{
        backgroundColor:
          currentTheme === 'light' ? styles.doc?.sidebar_bg : '#212121',
      }"
    >
      <AppSidebar />
    </div>
    <div
      class="flex-1 flex flex-col h-full overflow-auto"
      :style="{
        backgroundColor:
          currentTheme === 'light' ? styles.doc?.main_bg : '#212121',
      }"
    >
      <AppHeader />
      <slot />
    </div>
    <GlobalModals />
    <Notifications />
  </div>
</template>
<script setup>
import AppSidebar from '@/components/Layouts/AppSidebar.vue'
import AppHeader from '@/components/Layouts/AppHeader.vue'
import GlobalModals from '@/components/Modals/GlobalModals.vue'
import Notifications from '@/components/Notifications.vue'
import { inject } from 'vue'
import { useTheme } from 'frappe-ui'

const { currentTheme } = useTheme()

const styles = inject('$styles')
</script>
