<template>
	<div class="flex items-center flex-1">
		<Button
			:label="__('Upload')"
			iconLeft="upload"
			theme="green"
			variant="ghost"
			size="lg"
			@click="input.click()"
			class="!outline-none !border-none focus:!outline-none"
		/>
		<input
			ref="input"
			type="file"
			:accept="fileTypes"
			class="hidden"
			multiple
			@change="HandleFile"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps({
	uploadArgs: {
		type: Object,
		default: {},
	},
	fileTypes: {
		type: String,
		default: 'image/*,.pdf,.xlsx,.xls,.csv',
	},
	rowFieldname: {
		type: String,
		default: '',
	},
	docname: {
		type: String,
		default: '',
	},
	doctype: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['upload-success'])

const input = ref()

const { uploadAllFiles, handleFileSelect } = useFileUpload(props, emit)

async function HandleFile(e) {
	handleFileSelect(e)
	await uploadAllFiles()
}
</script>
