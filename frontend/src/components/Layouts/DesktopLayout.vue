<template>
  <div class="flex h-screen w-screen relative">
    <div
      class="h-full border-r dark:!bg-dark dark:border-r-gray-50/30"
      :style="{ backgroundColor: styles.sidebar_bg || '#fff' }"
    >
      <AppSidebar />
    </div>
    <div
      class="flex-1 flex flex-col h-full overflow-auto dark:!bg-dark"
      :style="{ backgroundColor: styles.main_bg || '#fff' }"
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
import { ThemeCustomization } from '@/composables/settings'
import { computed } from 'vue'

const styles = computed(() => ThemeCustomization.doc)
</script>
