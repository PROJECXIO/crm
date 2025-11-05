import { ref, reactive, toRaw } from 'vue'
import FilesUploadHandler from '@/components/FilesUploader/filesUploaderHandler'

export const useFileUpload = (props, emit) => {
	const files = ref([])
	const dragging = ref(false)
	const fileInput = ref(null)
	const uploaders = ref(new Map())

	// File type configuration
	const acceptedExtensions = ['image/*', '.pdf', '.xlsx', '.xls', '.csv'].join(',')
	const maxFileSize = 25 * 1024 * 1024 // 25MB

	// Current document name for uploads
	const currentDocname = ref(props.docname)

	const createFileObject = (file, index) => {
		const isImage = file.type?.startsWith('image')
		const sizeKb = file.size / 1024

		return reactive({
			filename: '',
			file_url: '',
			rv_file_title: '',
			id: `${file.name}-${Date.now()}-${index}`,
			index,
			src: isImage ? URL.createObjectURL(file) : null,
			fileObj: file,
			cropperFile: file,
			cropBoxData: null,
			type: file.type,
			optimize: sizeKb > 200 && isImage && !file.type?.includes('svg'),
			name: file.name,
			size: file.size,
			doc: currentDocname.value,
			progress: 0,
			total: 0,
			failed: false,
			requestSucceeded: false,
			errorMessage: null,
			uploading: false,
			completed: false,
		})
	}

	const validateFile = (file) => {
		const errors = []

		// Check file size
		if (file.size > maxFileSize) {
			errors.push(`File size exceeds 25MB limit`)
		}

		// Check file type
		const allowedTypes = [
			'image/',
			'application/pdf',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/csv',
		]
		const isValidType = allowedTypes.some((type) => file.type.startsWith(type))

		if (!isValidType) {
			errors.push(`File type not supported`)
		}

		return errors
	}

	const processFiles = (fileList) => {
		const newFiles = Array.from(fileList)
			.map((file, index) => {
				const validationErrors = validateFile(file)
				const fileObj = createFileObject(file, index)

				if (validationErrors.length > 0) {
					fileObj.failed = true
					fileObj.errorMessage = validationErrors.join(', ')
				}

				return fileObj
			})
			.filter((file) => !file.failed || file.errorMessage) // Keep files with errors to show them

		files.value = files.value.concat(newFiles)
	}

	const removeFile = (fileId) => {
		const fileIndex = files.value.findIndex((f) => f.id === fileId)
		if (fileIndex !== -1) {
			const file = files.value[fileIndex]

			// Clean up object URL if it exists
			if (file.src && file.src.startsWith('blob:')) {
				URL.revokeObjectURL(file.src)
			}

			// Cancel upload if in progress
			if (file.uploading && uploaders.value.has(fileId)) {
				const uploader = uploaders.value.get(fileId)
				// Note: FilesUploadHandler doesn't seem to have a cancel method
				// Consider adding one to handle upload cancellation
			}

			files.value.splice(fileIndex, 1)
			uploaders.value.delete(fileId)
		}
	}

	const uploadFile = (file) => {
		if (!currentDocname.value || file.failed || file.uploading || file.completed) {
			return Promise.resolve()
		}
		return new Promise((resolve, reject) => {
			const uploader = new FilesUploadHandler()
			uploaders.value.set(file.id, uploader)
			const args = {
				fileObj: file.fileObj,
				type: file.type,
				rv_file_title: file.rv_file_title,
				private: file.private,
				fileUrl: file.fileUrl,
				folder: 'Home/Attachments',
				doctype: props.doctype,
				docname: currentDocname.value,
			}

			uploader.on('start', () => {
				file.uploading = true
				file.failed = false
				file.errorMessage = null
			})

			uploader.on('progress', (data) => {
				file.progress = data.uploaded
				file.total = data.total
			})

			uploader.on('error', (error) => {
				file.uploading = false
				file.failed = true
				file.errorMessage = error || 'Error Uploading File'
				uploaders.value.delete(file.id)
				reject(error)
			})

			uploader.on('finish', () => {
				file.uploading = false
				file.completed = true
				uploaders.value.delete(file.id)
				// resolve(file)
			})

			uploader
				.upload(file.fileObj, args)
				.then((result) => {
					file.completed = true
					file.file_url = result.file_url
					resolve(result)
				})
				.catch((error) => {
					file.uploading = false
					file.failed = true

					let errorMessage = 'Error Uploading File'
					if (error?._server_messages) {
						errorMessage = JSON.parse(JSON.parse(error._server_messages)[0]).message
					} else if (error?.exc) {
						errorMessage = JSON.parse(error.exc)[0].split('\n').slice(-2, -1)[0]
					} else if (typeof error === 'string') {
						errorMessage = error
					}

					file.errorMessage = errorMessage
					uploaders.value.delete(file.id)
					reject(error)
				})
		})
	}

	const uploadAllFiles = async () => {
		const validFiles = files.value.filter((f) => !f.failed && !f.completed)
		if (validFiles.length === 0) return

		try {
			// Upload files concurrently
			const uploadPromises = validFiles.map((file) => uploadFile(file))
			const result = await Promise.allSettled(uploadPromises)
			if (props.rowFieldname) {
				emit(
					'upload-success',
					result.map((res) => ({
						[props.rowFieldname]: res.value.file_url,
					})),
				)
			}

			// Check if all files completed successfully
			const allCompleted = files.value.every((f) => f.completed || f.failed)
			if (allCompleted) {
				const successfulUploads = files.value.filter((f) => f.completed)
				if (successfulUploads.length > 0) {
					emit('reload')
					// Clear successful uploads after a delay to show success state
					setTimeout(() => {
						files.value = files.value.filter((f) => f.failed)
					}, 2000)
				}
			}
		} catch (error) {
			console.error('Upload error:', error)
		}
	}

	const uploadFilesWithDocname = async (docname) => {
		if (!docname || files.value.length === 0) return
		currentDocname.value = docname
		await uploadAllFiles()
	}

	const retryFile = (fileId) => {
		const file = files.value.find((f) => f.id === fileId)
		if (file && file.failed) {
			file.failed = false
			file.errorMessage = null
			uploadFile(file)
		}
	}

	const getUploadProgress = () => {
		const totalFiles = files.value.length
		const completedFiles = files.value.filter((f) => f.completed).length
		const failedFiles = files.value.filter((f) => f.failed).length
		const uploadingFiles = files.value.filter((f) => f.uploading).length

		return {
			total: totalFiles,
			completed: completedFiles,
			failed: failedFiles,
			uploading: uploadingFiles,
			pending: totalFiles - completedFiles - failedFiles - uploadingFiles,
			overallProgress: totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0,
		}
	}

	// Drag and drop handlers
	const handleDragOver = (e) => {
		e.preventDefault()
		dragging.value = true
	}

	const handleDragLeave = () => {
		dragging.value = false
	}

	const handleDrop = (e) => {
		e.preventDefault()
		dragging.value = false
		processFiles(e.dataTransfer.files)
	}

	const openFilePicker = () => {
		fileInput.value?.click()
	}

	const handleFileSelect = (e) => {
		processFiles([...e.target.files])
		e.target.value = null // Reset input
	}

	return {
		files,
		dragging,
		fileInput,
		acceptedExtensions,
		currentDocname,
		processFiles,
		removeFile,
		uploadFile,
		uploadAllFiles,
		uploadFilesWithDocname,
		retryFile,
		getUploadProgress,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		openFilePicker,
		handleFileSelect,
	}
}
