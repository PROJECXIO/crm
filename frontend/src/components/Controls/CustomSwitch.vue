<template>
	<div class="flex items-center flex-1 w-full">
		<Button
			:class="[
				current === 'no'
					? '!bg-bg-green text-white !font-bold hover:!bg-bg-hover'
					: 'bg-gray-50 text-subheading',
				sizeClasses,
				'px-4 rounded-e-none font-medium',
			]"
			:disabled="disabled"
			@click="current = 'no'"
			:size="size"
			:label="__('No')"
		/>
		<Button
			:class="[
				current === 'yes'
					? '!bg-bg-green text-white !font-bold hover:!bg-hover'
					: 'bg-gray-50 text-subheading ',
				sizeClasses,
				'px-4 rounded-s-none font-medium',
			]"
			:disabled="disabled"
			@click="current = 'yes'"
			:size="size"
			:label="__('Yes')"
		/>
	</div>
</template>

<script setup lang="ts">
// @ts-nocheck
import Button from '@/components/frappe-ui/Button.vue'
import { isMobileView } from '@/composables/settings'
import { ref, watch, computed } from 'vue'

interface Props {
	currentValue?: true | false
	disabled?: boolean
	size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	currentValue: false,
	size: 'md',
})

const emit = defineEmits<{
	(e: 'change', v: boolean): void
}>()

const current = ref<'yes' | 'no'>(props.currentValue ? 'yes' : 'no')

const sizeClasses = computed(() => {
	return (
		{
			sm: 'min-w-16 min-h-7 text-sm',
			md: 'min-w-20 min-h-8 text-base',
			lg: 'min-w-24 min-h-9 text-lg',
			xl: 'min-w-28 min-h-10 text-xl',
		}[props.size] || 'min-w-20 min-h-8 text-base'
	)
})

watch(
	() => current.value,
	(v) => {
		emit('change', v === 'yes')
	},
)
</script>
