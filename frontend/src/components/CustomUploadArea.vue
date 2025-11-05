<template>
	<div class="upload-container">
		<!-- Drop zone -->
		<FileDropZone
			:is-dragging="dragging"
			:accepted-extensions="acceptedExtensions"
			@click="enhancedOpenFilePicker"
			@dragover="handleDragOver"
			@dragleave="handleDragLeave"
			@drop="handleDrop"
			@file-select="handleFileSelect"
			ref="dropZoneRef"
		/>

		<!-- Upload Progress Summary -->
		<UploadProgressSummary
			:progress="uploadProgress"
			:can-upload="!!props.docname"
			@retry-failed="retryFailedFiles"
			@upload-pending="uploadAllFiles"
		/>

		<!-- File list with individual progress -->
		<div v-if="files.length > 0" class="mt-4">
			<FileUploadProgress
				v-for="file in files"
				:key="file.id"
				:file="file"
				@remove="removeFile"
				@retry="retryFile"
			/>
		</div>

		<!-- Upload button for manual trigger -->
		<!-- <div
			v-if="props.docname && files.length > 0 && !uploadProgress.uploading"
			class="mt-4 flex justify-end"
		>
			<Button
				@click="uploadAllFiles"
				variant="solid"
				theme="green"
				:disabled="files.every((f) => f.completed || f.failed)"
				class="flex items-center gap-2"
				icon-left="upload"
			>
				{{ __('Upload Files') }} ({{ uploadProgress.pending }})
			</Button>
		</div> -->
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'
import FileDropZone from '@/components/FileDropZone.vue'
import FileUploadProgress from '@/components/FileUploadProgress.vue'
import UploadProgressSummary from '@/components/UploadProgressSummary.vue'

const props = defineProps({
	doctype: {
		type: String,
		default: 'CRM Lead',
	},
	docname: {
		type: String,
		required: false,
	},
	rowFieldname: {
		type: String,
		required: false,
	},
})

const emit = defineEmits(['reload', 'upload-success'])

// Use the file upload composable
const {
	files,
	dragging,
	fileInput,
	acceptedExtensions,
	currentDocname,
	removeFile,
	uploadAllFiles,
	uploadFilesWithDocname,
	retryFile,
	getUploadProgress,
	handleDragOver,
	handleDragLeave,
	handleDrop,
	openFilePicker,
	handleFileSelect,
} = useFileUpload(props, emit)

// Computed property for upload progress
const uploadProgress = computed(() => getUploadProgress())

// Ref for the drop zone component
const dropZoneRef = ref(null)

// Handle retry failed files
const retryFailedFiles = () => {
	const failedFiles = files.value.filter((f) => f.failed)
	failedFiles.forEach((file) => retryFile(file.id))
}

// Override the openFilePicker to use the drop zone ref
const openFilePickerFromDropZone = () => {
	if (dropZoneRef.value?.fileInput) {
		dropZoneRef.value.fileInput.click()
	}
}

// Update the openFilePicker to use the drop zone ref
const originalOpenFilePicker = openFilePicker
const enhancedOpenFilePicker = () => {
	openFilePickerFromDropZone() || originalOpenFilePicker()
}

defineExpose({
	uploadFilesWithDocname,
	files,
	uploadProgress,
	retryFailedFiles,
})
</script>

<style scoped>
.upload-container {
	font-family: 'Inter', sans-serif;
}

.drop-zone {
	border: 2px dashed #cbd5e1;
	border-radius: 8px;
	padding: 0.5rem;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
}

.drop-zone.dragging-over {
	border-color: #3b82f6;
	background-color: #eff6ff;
}

.drop-content {
	margin: 0 auto;
}

/* Image preview styling */
.aspect-square {
	position: relative;
	width: 100%;
	padding-bottom: 100%;
}

.aspect-square > * {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
