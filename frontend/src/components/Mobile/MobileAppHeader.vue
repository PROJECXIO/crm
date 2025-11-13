<template>
  <div class="flex">
    <div class="z-20 pl-2 flex items-center justify-center bg-sidebar-bg">
      <Button
        size="md"
        variant="solid"
        theme="green"
        @click="sidebarOpened = !sidebarOpened"
      >
        <MenuIcon class="h-4 text-white" />
      </Button>
    </div>
    <div id="app-header" class="flex-1" />
  </div>
  <CallUI class="mr-3 mt-2" />
</template>

<script setup>
import MenuIcon from '@/components/Icons/MenuIcon.vue'
import CallUI from '@/components/Telephony/CallUI.vue'
import { mobileSidebarOpened as sidebarOpened } from '@/composables/settings'
</script>
