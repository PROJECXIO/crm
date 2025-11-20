<template>
  <button
    class="flex px-3 h-12 cursor-pointer items-center rounded duration-300 ease-in-out focus:outline-none focus:transition-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-outline-gray-3 group"
    :style="[
      isActive
        ? {
            color: styles.doc?.sidebar_label_active_color || '#fff',
            backgroundColor:
              styles.doc?.sidebar_label_bg_color_active || '#eee',
          }
        : {
            color: styles.doc?.sidebar_label_inactive_color || '#eee',
            backgroundColor: 'inherit',
          },
    ]"
    @click="handleClick"
  >
    <div
      class="flex w-full items-center justify-between duration-300 ease-in-out"
      :class="[
        'flex w-full items-center duration-300 ease-in-out',
        isCollapsed ? 'justify-center p-1' : 'justify-between',
      ]"
    >
      <div
        :class="[
          'flex items-center truncate',
          isCollapsed && 'items-center justify-center',
        ]"
      >
        <Tooltip :text="label" placement="right" :disabled="!isCollapsed">
          <slot name="icon">
            <span class="grid flex-shrink-0 place-items-center">
              <FeatherIcon
                v-if="typeof icon == 'string'"
                :name="icon"
                :class="[
                  'size-5 ',
                  isActive
                    ? 'stroke-white text-white'
                    : 'stroke-[#666] text-[#666]',
                  activeSettingsPage === label
                    ? 'stroke-white text-white'
                    : 'stroke-[#666] text-[#666]',
                ]"
              />
              <component
                v-else
                :is="icon"
                :class="[
                  'size-5',
                  isActive
                    ? 'stroke-[#fff] text-white '
                    : 'text-[#666] stroke-[#666]',
                  activeSettingsPage === label
                    ? 'stroke-[#fff] text-white '
                    : 'text-[#666] stroke-[#666]',
                ]"
              />
            </span>
          </slot>
        </Tooltip>
        <Tooltip
          :text="label"
          placement="right"
          :disabled="isCollapsed"
          :hoverDelay="1.5"
        >
          <span
            class="flex-1 flex-shrink-0 truncate text-lg duration-300 ease-in-out"
            :class="[
              isCollapsed
                ? 'ml-0 w-0 overflow-hidden opacity-0'
                : 'ml-2 w-auto opacity-100 group-hover:mx-3',
              isActive ? 'font-bold' : '',
            ]"
            :style="[
              isActive
                ? {
                    color: styles.doc?.sidebar_label_active_color || '#fff',
                    backgroundColor:
                      styles.doc?.sidebar_label_bg_color_active || '#eee',
                  }
                : { color: styles.doc?.sidebar_label_inactive_color || '#eee' },
            ]"
          >
            {{ label }}
          </span>
        </Tooltip>
      </div>
      <slot name="right" />
    </div>
  </button>
</template>

<script setup>
import { Tooltip } from 'frappe-ui'
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isMobileView, mobileSidebarOpened } from '@/composables/settings'

const styles = inject('$styles')

const router = useRouter()
const route = useRoute()

const props = defineProps({
  icon: {
    type: [Object, String, Function],
  },
  label: {
    type: String,
    default: '',
  },
  to: {
    type: [Object, String],
    default: '',
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

function handleClick() {
  if (!props.to) return
  if (typeof props.to === 'object') {
    router.push(props.to)
  } else {
    router.push({ name: props.to })
  }
  if (isMobileView.value) {
    mobileSidebarOpened.value = false
  }
}

let isActive = computed(() => {
  if (route.query.view) {
    return route.query.view == props.to?.query?.view
  }
  if (props.to && route.params?.docId) {
    return String(props.to)?.includes(route.name)
  }

  return route.name === props.to
})
</script>
