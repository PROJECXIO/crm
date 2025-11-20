<template>
  <div
    class="inline-flex items-center space-x-2 rounded transition border-red-500"
    :class="{
      'px-2.5 py-1.5': padding && size === 'sm',
      'px-3 py-2': padding && size === 'md',
      'focus-within:bg-surface-gray-2 focus-within:ring-2 focus-within:ring-outline-gray-3 hover:bg-surface-gray-3 active:bg-surface-gray-4':
        padding && !disabled,
    }"
  >
    <input
      class="rounded-sm"
      :class="inputClasses"
      type="checkbox"
      :disabled="disabled"
      :id="htmlId"
      :checked="Boolean(modelValue)"
      @change="
        (e) =>
          $emit('update:modelValue', (e.target as HTMLInputElement).checked)
      "
      v-bind="attrs"
    />
    <label class="block" :class="labelClasses" v-if="label" :for="htmlId">
      {{ label }}
    </label>
  </div>
</template>
<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { useId } from './utils'

interface CheckboxProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  checked?: boolean
  disabled?: boolean
  padding?: boolean
  modelValue?: boolean | 1 | 0
  id?: string
}
const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'sm',
  padding: false,
})

const attrs = useAttrs()

const htmlId = props.id ?? useId()

const labelClasses = computed(() => {
  return [
    {
      sm: 'text-base font-medium',
      md: 'text-lg font-medium',
      lg: 'text-xl font-medium',
    }[props.size],
    props.disabled ? 'text-ink-gray-4' : 'text-subheading',
    'select-none',
  ]
})

const inputClasses = computed(() => {
  let baseClasses = props.disabled
    ? 'border-outline-gray-2 bg-surface-menu-bar text-ink-gray-3'
    : 'border-bg-green text-text-green focus:ring-offset-0 active:border-gray-700 transition'

  let interactionClasses = props.disabled
    ? ''
    : props.padding
      ? 'focus:ring-0'
      : 'hover:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3 active:bg-surface-gray-2'

  let sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[props.size]

  return [baseClasses, interactionClasses, sizeClasses]
})
</script>
