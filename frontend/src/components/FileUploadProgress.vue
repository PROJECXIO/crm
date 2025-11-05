<template>
	<div
		class="file-upload-item border border-gray-200 rounded-lg p-3 mb-2 transition-all duration-200"
	>
		<!-- File info header -->
		<div class="flex items-center justify-between mb-2">
			<div class="flex items-start gap-3">
				<!-- File preview/icon -->
				<div class="flex-shrink-0">
					<img
						v-if="file.src"
						:src="file.src"
						class="w-10 h-10 rounded object-cover"
						:alt="file.name"
					/>
					<div
						v-else
						class="w-10 h-10 bg-gray-100 rounded flex items-center justify-center"
					>
						<FeatherIcon name="file" class="w-5 h-5 text-gray-500" />
					</div>
				</div>

				<!-- File details -->
				<div class="flex-1 flex flex-col min-w-0 gap-2">
					<div class="flex flex-col gap-1 text-xs font-medium text-subheading truncate">
						{{ file.name }}
						<div class="text-[#666]">
							{{ formatFileSize(file.size) }}
						</div>
					</div>
					<div class="transition-all duration-1000">
						<Button
							v-if="!showFileNameInput"
							@click="showFileNameInput = true"
							:label="__('Add File Name')"
							theme="green"
							variant="ghost"
							class="font-bold !p-0 hover:bg-transparent focus:!bg-transparent"
						/>
						<Transition
							enter-active-class="transition duration-300 ease-out"
							enter-from-class="transform opacity-0"
							enter-to-class="transform opacity-100"
							leave-active-class="transition duration-300 ease-in w-96"
							leave-from-class="transform opacity-100 w-96"
							leave-to-class="transform opacity-0"
						>
							<FormControl
								v-if="showFileNameInput"
								variant="outline"
								size="lg"
								:placeholder="__('Add file name')"
								class="w-96 focus:outline-none"
								v-model="file.rv_file_title"
							/>
						</Transition>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-2">
				<!-- Retry button for failed uploads -->
				<Button
					v-if="file.failed"
					variant="outline"
					theme="red"
					size="sm"
					@click="$emit('retry', file.id)"
					class="!h-6 !px-2"
				>
					<FeatherIcon name="rotate-ccw" class="w-3 h-3" />
				</Button>

				<!-- Remove button -->
				<Button
					variant="outline"
					theme="red"
					@click="$emit('remove', file.id)"
					class="!h-6 !w-6 !p-0 rounded-full"
				>
					<FeatherIcon name="x" class="w-3 h-3" />
				</Button>
			</div>
		</div>

		<!-- Progress bar -->
		<div v-if="file.uploading || file.completed" class="mb-2">
			<div class="flex items-center justify-between text-xs mb-1">
				<span class="text-gray-600">
					{{ file.uploading ? 'Uploading...' : 'Completed' }}
				</span>
				<span class="text-gray-500"> {{ Math.round(progressPercentage) }}% </span>
			</div>

			<div class="w-full bg-gray-200 rounded-full h-1.5">
				<div
					class="h-1.5 rounded-full transition-all duration-300"
					:class="{
						'bg-blue-500': file.uploading,
						'bg-green-500': file.completed,
					}"
					:style="{ width: `${progressPercentage}%` }"
				></div>
			</div>

			<!-- Upload speed/ETA (for uploading files) -->
			<div v-if="file.uploading && file.total > 0" class="text-xs text-gray-500 mt-1">
				{{ formatFileSize(file.progress) }} / {{ formatFileSize(file.total) }}
			</div>
		</div>

		<!-- Error message -->
		<div v-if="file.failed && file.errorMessage" class="mt-2">
			<div class="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
				<FeatherIcon name="alert-circle" class="w-4 h-4 flex-shrink-0" />
				<span class="truncate">{{ file.errorMessage }}</span>
			</div>
		</div>

		<!-- Success indicator -->
		<div v-if="file.completed" class="mt-2">
			<div class="flex items-center gap-2 text-green-600 text-sm">
				<FeatherIcon name="check-circle" class="w-4 h-4" />
				<span>{{ __('Upload completed successfully') }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
	file: {
		type: Object,
		required: true,
	},
})

const emit = defineEmits(['remove', 'retry'])

const showFileNameInput = ref(false)

const progressPercentage = computed(() => {
	if (props.file.completed) return 100
	if (props.file.total > 0) {
		return (props.file.progress / props.file.total) * 100
	}
	return 0
})

const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.file-upload-item {
	background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.file-upload-item:hover {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
