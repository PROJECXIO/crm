<template>
  <Popover
    placement="right-start"
    trigger="hover"
    :hoverDelay="0.1"
    :leaveDelay="0.1"
  >
    <template #target="{ togglePopover }">
      <button
        :class="[
          active ? 'bg-surface-gray-3' : 'text-ink-gray-6',
          'group w-full flex h-10 items-center justify-between rounded px-2 text-base hover:bg-bg-green group',
        ]"
        @click.prevent="togglePopover()"
      >
        <div class="flex gap-2">
          <AppsIcon class="size-4 group-hover:text-white" />
          <span class="whitespace-nowrap group-hover:text-white">
            {{ __('Apps') }}
          </span>
        </div>
        <FeatherIcon name="chevron-right" class="size-4 text-ink-gray-5 group-hover:text-white" />
      </button>
    </template>
    <template #body>
      <div
        class="flex w-fit mx-2 min-w-32 max-w-48 flex-col rounded-lg border border-outline-gray-2 bg-surface-white text-sm text-ink-gray-8 shadow-xl auto-fill-[100px]"
      >
        <a
          v-for="app in apps"
          :href="app.route"
          key="name"
          class="flex items-center gap-2 rounded p-1.5 hover:bg-bg-green group"
        >
          <img class="size-6" :src="app.logo" />
          <span class="max-w-18 w-full truncate group-hover:text-white">
            {{ app.title }}
          </span>
        </a>
      </div>
    </template>
  </Popover>
</template>
<script setup>
import AppsIcon from '@/components/Icons/AppsIcon.vue'
import { Popover, createResource } from 'frappe-ui'
import { onUnmounted, ref } from 'vue'
import { stopRecording } from '@/telemetry'

const props = defineProps({
  active: Boolean,
})

const apps = ref([
      {
        name: 'frappe',
        logo: '/assets/frappe/images/framework.png',
        title: __('Desk'),
        route: '/app',
      },
    ])

onUnmounted(() => {
  stopRecording()
})
</script>
