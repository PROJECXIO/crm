<template>
  <div class="flex h-screen w-screen relative">
    <div class="h-full border-r bg-sidebar-bg dark:bg-dark dark:border-r-gray-50/30">
      <AppSidebar />
    </div>
    <div class="flex-1 flex flex-col h-full overflow-auto bg-[#F1F2F3] dark:bg-dark">
      <AppHeader />
        <slot />
    </div>
    <GlobalModals />
  </div>
</template>
<script setup>
import AppSidebar from '@/components/Layouts/AppSidebar.vue'
import AppHeader from '@/components/Layouts/AppHeader.vue'
import GlobalModals from '@/components/Modals/GlobalModals.vue'
</script>
