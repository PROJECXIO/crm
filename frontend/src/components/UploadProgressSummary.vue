<template>
	<div
		v-if="showProgress"
		class="upload-progress-summary bg-green-50 border border-green-200 rounded-lg p-4 mb-4 mt-3"
	>
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-2">
				<FeatherIcon name="upload" class="w-5 h-5 text-green-600" />
				<h3 class="text-sm font-medium text-green-900">{{ __('Upload Progress') }}</h3>
			</div>
			<div class="text-sm text-green-700">
				{{ progress.completed + progress.failed }} / {{ progress.total }}
			</div>
		</div>

		<!-- Overall progress bar -->
		<div class="mb-3">
			<div class="flex items-center justify-between text-xs mb-1">
				<span class="text-green-700">{{ __('Overall Progress') }}</span>
				<span class="text-green-600 font-medium"
					>{{ Math.round(progress.overallProgress) }}%</span
				>
			</div>
			<div class="w-full bg-green-100 rounded-full h-2">
				<div
					class="bg-green-500 h-2 rounded-full transition-all duration-300"
					:style="{ width: `${progress.overallProgress}%` }"
				></div>
			</div>
		</div>

		<!-- Status summary -->
		<div class="grid grid-cols-4 gap-4 text-center">
			<!-- Completed -->
			<div v-if="progress.completed > 0" class="flex items-center gap-1">
				<div class="text-lg font-semibold text-green-600">{{ progress.completed }}</div>
				<div class="text-xs text-green-700">{{ __('Completed') }}</div>
			</div>

			<!-- Uploading -->
			<div v-if="progress.uploading > 0" class="text-center">
				<div
					class="text-lg font-semibold text-green-600 flex items-center justify-center gap-1"
				>
					{{ progress.uploading }}
					<div
						class="animate-spin w-3 h-3 border border-green-600 border-t-transparent rounded-full"
					></div>
				</div>
				<div class="text-xs text-green-700">{{ __('Uploading') }}</div>
			</div>

			<!-- Failed -->
			<div v-if="progress.failed > 0" class="flex items-center gap-1">
				<div class="text-lg font-semibold text-red-600">{{ progress.failed }}</div>
				<div class="text-xs text-red-700">{{ __('Failed') }}</div>
			</div>

			<!-- Pending -->
			<div v-if="progress.pending > 0" class="flex items-center gap-1">
				<div class="text-lg font-semibold text-gray-600">{{ progress.pending }}</div>
				<div class="text-xs text-gray-700">{{ __('Pending') }}</div>
			</div>
		</div>

		<!-- Action buttons -->
		<div v-if="progress.failed > 0 || progress.pending > 0" class="flex gap-2 mt-4">
			<Button
				v-if="progress.failed > 0"
				variant="outline"
				theme="red"
				size="md"
				@click="$emit('retryFailed')"
				class="flex items-center gap-1"
				:icon-left="'rotate-ccw'"
			>
				{{ __('Retry Failed') }} ({{ progress.failed }})
			</Button>

			<Button
				v-if="progress.pending > 0 && canUpload"
				variant="solid"
				theme="green"
				size="md"
				@click="$emit('uploadPending')"
				class="flex items-center gap-1"
				:icon-left="'upload'"
			>
				{{ __('Upload Remaining') }} ({{ progress.pending }})
			</Button>
		</div>

		<!-- Success message -->
		<div
			v-if="isAllCompleted"
			class="mt-3 p-2 py-4 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2"
		>
			<FeatherIcon name="check-circle" class="w-4 h-4 text-green-600" />
			{{ __('All files uploaded successfully!') }}
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	progress: {
		type: Object,
		required: true,
	},
	canUpload: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits(['retryFailed', 'uploadPending'])

const showProgress = computed(() => {
	return props.progress.total > 0
})

const isAllCompleted = computed(() => {
	return (
		props.progress.total > 0 &&
		props.progress.completed === props.progress.total &&
		props.progress.failed === 0
	)
})
</script>

<style scoped>
.upload-progress-summary {
	animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
