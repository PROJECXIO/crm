<script setup lang="ts">
import { TooltipProps } from 'frappe-ui';
import {
  TooltipProvider,
  TooltipRoot,
  TooltipPortal,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from 'reka-ui'
import { computed } from 'vue'


defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  placement: 'top',
  hoverDelay: 0.5,
  arrowClass: 'fill-[#E6FAF5]',
  disabled: false,
})

const delayDuration = computed(() => props.hoverDelay * 1000)
</script>

<template>
  <slot v-if="disabled" />
  <TooltipProvider v-else :delayDuration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-if="props.text || $slots.body"
          :side="props.placement"
          :side-offset="4"
          class="z-[100]"
        >
          <slot name="body">
            <div
              class="rounded-sm bg-[#E6FAF5] px-3 py-2 text-xs font-medium text-subheading shadow-lg"
            >
              <div>{{ props.text }}</div>
            </div>
          </slot>
          <TooltipArrow :class="props.arrowClass" :width="12" :height="6" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
