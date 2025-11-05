<template>
	<Button
		variant="outline"
		theme="green"
		:size="isMobileView ? 'md' : 'lg'"
		:title="__(label)"
		class="h-12 w-12 !font-bold !gap-1"
		icon="plus"
	/>
</template>

<script setup>
import { isMobileView } from '@/composables/settings'

defineProps({
	label: {
		type: String,
		required: true,
	},
})
</script>
