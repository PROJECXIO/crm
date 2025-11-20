<template>
  <TabPanels class="flex flex-1 overflow-y-auto">
    <TabPanel
      class="flex flex-1 flex-col focus:outline-none dark:bg-[#313131] overflow-auto pt-0"
      :class="isMobileView ? 'px-0' : 'p-8'"
      v-for="(tab, i) in t.tabs"
      :key="i"
    >
      <slot v-bind="{ tab }" />
    </TabPanel>
  </TabPanels>
</template>
<script setup>
import { TabPanels, TabPanel } from '@headlessui/vue'
import { inject } from 'vue'
import { isMobileView } from '@/composables/settings'

const t = inject('tab')
</script>
