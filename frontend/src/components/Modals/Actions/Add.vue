<template>
	<Button
		variant="solid"
		class="flex-1 text-lg font-bold"
		theme="green"
		size="lg"
		:label="__(label)"
		:loading="loading"
	/>
</template>

<script setup>
import Button from '@/components/frappe-ui/Button.vue'

defineProps({
	loading: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: 'Add',
	},
})
</script>
