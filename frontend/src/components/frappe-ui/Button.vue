<template>
  <button
    v-bind="$attrs"
    :class="buttonClasses"
    @click="handleClick"
    :disabled="isDisabled"
    :ariaLabel="ariaLabel"
    :style="handleStyles()"
  >
    <LoadingIndicator
      v-if="loading"
      :class="{
        'h-3 w-3': size == 'sm',
        'h-[13.5px] w-[13.5px]': size == 'md',
        'h-[15px] w-[15px]': size == 'lg',
        'h-4.5 w-4.5': size == 'xl' || size == '2xl',
      }"
    />
    <slot name="prefix" v-else-if="$slots['prefix'] || iconLeft">
      <FeatherIcon
        v-if="iconLeft && typeof iconLeft === 'string'"
        :name="iconLeft"
        :class="slotClasses"
        aria-hidden="true"
      />
      <component v-else-if="iconLeft" :is="iconLeft" :class="slotClasses" />
    </slot>

    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="isIconButton && !loading">
      <FeatherIcon
        v-if="icon && typeof icon === 'string'"
        :name="icon"
        :class="slotClasses"
        :aria-label="label"
      />
      <component v-else-if="icon" :is="icon" :class="slotClasses" />
      <slot name="icon" v-else-if="$slots.icon" />
    </template>
    <span v-else :class="{ 'sr-only': isIconButton }">
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <FeatherIcon
        v-if="iconRight && typeof iconRight === 'string'"
        :name="iconRight"
        :class="slotClasses"
        aria-hidden="true"
      />
      <component v-else-if="iconRight" :is="iconRight" :class="slotClasses" />
    </slot>
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, useSlots, type Component } from 'vue'
// import FeatherIcon from 'frappe-ui'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import { useRouter, type RouteLocation } from 'vue-router'

const styles = inject('$styles')

type Theme = 'gray' | 'blue' | 'green' | 'red' | 'purple'
type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type Variant = 'solid' | 'subtle' | 'outline' | 'ghost'

export interface ButtonProps {
  theme?: Theme
  size?: Size
  variant?: Variant
  label?: string
  icon?: string | Component
  iconLeft?: string | Component
  iconRight?: string | Component
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  route?: RouteLocation
  link?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  theme: 'gray',
  size: 'md',
  variant: 'subtle',
  loading: false,
  disabled: false,
})

const slots = useSlots()
const router = useRouter()

const buttonClasses = computed(() => {
  let solidClasses = {
    gray: 'text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-800',
    blue: 'text-ink-white bg-blue-500 hover:bg-surface-blue-3 active:bg-blue-700',
    green: `text-[#fff] bg-[#00AA80] hover:bg-[#00AA80]/80 active:bg-[#00AA80]`,
    red: 'text-ink-white bg-surface-red-5 hover:bg-surface-red-6 active:bg-surface-red-7',
    purple:
      'text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 secondary-solid-btn',
  }[props.theme]

  let subtleClasses = {
    gray: 'text-ink-gray-8 bg-surface-gray-2 hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-blue-2 hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-green-2 hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-surface-red-2 hover:bg-surface-red-3 active:bg-surface-red-4',
    purple:
      'text-purple-700 bg-purple-100 hover:bg-purple-200 active:bg-purple-300',
  }[props.theme]

  let outlineClasses = {
    gray: 'text-[#00664D] bg-surface-white bg-surface-white border border-outline-gray-2 hover:border-outline-gray-3 active:border-outline-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-surface-white border border-outline-blue-1 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
    green:
      'text-green-800 bg-surface-white border border-outline-green-2 hover:border-green-500 active:border-green-500 active:bg-green-300 primary-outline-btn',
    red: 'text-red-700 bg-surface-white border border-outline-red-1 hover:border-outline-red-2 active:border-outline-red-2 active:bg-surface-red-3',
    purple:
      'text-purple-700 bg-surface-white border border-purple-200 hover:border-purple-400 active:border-purple-400 active:bg-purple-300 secondary-outline-btn',
  }[props.theme]

  let ghostClasses = {
    gray: 'text-ink-gray-8 bg-transparent hover:bg-surface-gray-3 active:bg-surface-gray-4',
    blue: 'text-ink-blue-3 bg-transparent hover:bg-blue-200 active:bg-blue-300',
    green:
      'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
    red: 'text-red-700 bg-transparent hover:bg-surface-red-3 active:bg-surface-red-4',
    purple:
      'text-purple-700 bg-transparent hover:bg-purple-100 active:bg-purple-200',
  }[props.theme]

  let focusClasses = {
    gray: 'focus-visible:ring focus-visible:ring-outline-gray-3',
    blue: 'focus-visible:ring focus-visible:ring-blue-400',
    green: 'focus-visible:ring focus-visible:ring-outline-green-2',
    red: 'focus-visible:ring focus-visible:ring-outline-red-2',
    purple: 'focus-visible:ring focus-visible:ring-purple-400',
  }[props.theme]

  let variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[props.variant]

  type ThemeVariant = `${Theme}-${Variant}`
  let themeVariant: ThemeVariant = `${props.theme}-${props.variant}`

  let disabledClassesMap: Record<ThemeVariant, string> = {
    'gray-solid': 'bg-surface-gray-2 text-ink-gray-4',
    'gray-subtle': 'bg-surface-gray-2 text-ink-gray-4',
    'gray-outline':
      'bg-surface-gray-2 text-ink-gray-4 border border-outline-gray-2',
    'gray-ghost': 'text-ink-gray-4',

    'blue-solid': 'bg-blue-300 text-ink-white',
    'blue-subtle': 'bg-surface-blue-2 text-ink-blue-link',
    'blue-outline':
      'bg-surface-blue-2 text-ink-blue-link border border-outline-blue-1',
    'blue-ghost': 'text-ink-blue-link',

    'green-solid': 'bg-surface-green-2 text-ink-green-2',
    'green-subtle': 'bg-surface-green-2 text-ink-green-2',
    'green-outline':
      'bg-surface-green-2 text-ink-green-2 border border-outline-green-2',
    'green-ghost': 'text-ink-green-2',

    'red-solid': 'bg-surface-red-2 text-ink-red-2',
    'red-subtle': 'bg-surface-red-2 text-ink-red-2',
    'red-outline':
      'bg-surface-red-2 text-ink-red-2 border border-outline-red-1',
    'red-ghost': 'text-ink-red-2',

    'purple-solid': 'bg-purple-300 text-white',
    'purple-subtle': 'bg-purple-100 text-purple-400',
    'purple-outline': 'bg-purple-100 text-purple-400 border border-purple-200',
    'purple-ghost': 'text-purple-400',
  }
  let disabledClasses = disabledClassesMap[themeVariant]

  let sizeClasses = {
    sm: 'h-7 text-base px-2 rounded',
    md: 'h-8 text-base font-medium px-2.5 rounded',
    lg: 'h-10 text-lg font-semibold px-2 rounded-md',
    xl: 'h-12 text-xl font-semibold px-3.5 rounded-lg',
    '2xl': 'h-13 text-2xl font-bold px-3.5 rounded-xl',
  }[props.size]

  if (isIconButton.value) {
    sizeClasses = {
      sm: 'h-7 w-7 rounded',
      md: 'h-8 w-8 rounded',
      lg: 'h-10 w-10 rounded-md',
      xl: 'h-11.5 w-11.5 rounded-lg',
      '2xl': 'h-13 w-13 rounded-xl',
    }[props.size]
  }

  return [
    'inline-flex items-center justify-center gap-2 transition-colors focus:outline-none',
    isDisabled.value ? disabledClasses : variantClasses,
    focusClasses,
    sizeClasses,
  ]
})

const slotClasses = computed(() => {
  let classes = {
    sm: 'h-4',
    md: 'h-4.5',
    lg: 'h-5',
    xl: 'h-6',
    '2xl': 'h-6',
  }[props.size]

  return classes
})

const isDisabled = computed(() => {
  return props.disabled || props.loading
})

const ariaLabel = computed(() => {
  return isIconButton.value ? props.label : null
})

const isIconButton = computed(() => {
  return props.icon || slots.icon
})

const handleClick = () => {
  if (props.route) {
    return router.push(props.route)
  } else if (props.link) {
    return window.open(props.link, '_blank')
  }
}

const handleStyles = () => {
  if (props.theme === 'green' && props.variant === 'solid') {
    return {
      backgroundColor: styles.doc?.primary_solid,
      color: styles.doc?.primary_solid_text,
    }
  } else if (props.theme === 'green' && props.variant === 'outline') {
    return {
      borderColor: styles.doc?.primary_outline,
      color: styles.doc?.primary_outline_text,
    }
  } else if (props.theme === 'blue' && props.variant === 'solid') {
    return {
      backgroundColor: styles.doc?.secondary_solid,
      color: styles.doc?.secondary_solid_text,
    }
  } else if (props.theme === 'blue' && props.variant === 'outline') {
    return {
      borderColor: styles.doc?.secondary_outline,
      color: styles.doc?.secondary_outline_text,
    }
  } else if (props.theme === 'purple' && props.variant === 'solid') {
    return {
      backgroundColor: styles.doc?.secondary_solid,
      color: styles.doc?.secondary_solid_text,
    }
  } else if (props.theme === 'purple' && props.variant === 'outline') {
    return {
      borderColor: styles.doc?.secondary_outline,
      color: styles.doc?.secondary_outline_text,
    }
  }
}
</script>
