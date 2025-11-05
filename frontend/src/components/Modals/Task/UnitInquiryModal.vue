<template>
	<div class="grid grid-cols-2 gap-3">
		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Assigned To') }}</label>
			<Link
				variant="outline"
				doctype="User"
				class="!mt-1.5"
				size="lg"
				hideMe
				v-model="data.assigned_to"
				:placeholder="__('Select user')"
			/>
		</div>

		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Lead') }} <span class="text-red-500">*</span></label
			>
			<Link
				variant="outline"
				doctype="CRM Lead"
				class="!mt-1.5"
				size="lg"
				v-model="data.lead"
				:placeholder="__('Select lead')"
			/>
			<span v-if="error.lead" class="text-red-600 text-sm mt-2">{{ error.lead }}</span>
		</div>
		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium">{{
				__('Lead Contact Method')
			}}</label>
			<Autocomplete
				v-model="data.contact_method"
				variant="outline"
				size="lg"
				class="mt-1.5"
				:options="leadContactMethodOptions()"
				:placeholder="__('Select')"
			/>
		</div>

		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Unit') }} <span class="text-red-500">*</span></label
			>
			<Link
				variant="outline"
				doctype="CRM Unit"
				class="!mt-1.5"
				size="lg"
				v-model="data.unit"
				:placeholder="__('Select unit')"
			/>
			<span v-if="error.unit" class="text-red-600 text-sm mt-2">{{ error.unit }}</span>
		</div>
		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Description') }}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.description"
				class="resize-none"
				:placeholder="__('Enter description')"
			/>
			<span v-if="error.description" class="text-red-600 text-sm mt-2">{{
				error.description
			}}</span>
			<span class="text-sm text-ink-gray-5 flex items-center gap-1">
				<FeatherIcon name="info" class="h-3 w-3" />
				{{ __('max 250 characters') }}
			</span>
		</div>
		<div class="col-span-2 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Attachments') }}</label>
			<CustomUploadArea ref="uploadArea" doctype="CRM Task" :docname="null" />
		</div>
		<!-- actions -->
		<div :class="[isMobileView ? 'flex-col': ' flex-row', 'col-span-2 flex items-center gap-2 mt-8 w-full']">
			<AddAction
				:class="[isMobileView ? 'min-h-[44px] w-full': '']"
				:label="editMode ? 'Update' : 'Save'"
				@click="saveTask"
				:loading="loading"
				:disabled="disabled || loading || !isDirty"
			/>
			<CancelAction :class="[isMobileView ? 'min-h-[44px] w-full': '']" label="Cancel" @click="$emit('close')" />
		</div>
	</div>
</template>

<script setup>
// imports
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import { toast, Textarea } from 'frappe-ui'
import Link from '@/components/Controls/Link.vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { computed, inject, reactive, ref } from 'vue'
import CustomUploadArea from '@/components/CustomUploadArea.vue'
import {isMobileView} from "@/composables/settings";

// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')
// refs
const loading = ref(false)
const disabled = computed(() => !data.lead || !data.unit || data.description.length > 250)
const isDirty = computed(
	() =>
		data.unit !== task.value.unit ||
		data.lead !== task.value.reference_docname ||
		data.description !== task.value.description ||
		data.assigned_to !== task.value.assigned_to?.name,
)
const uploadArea = ref(null)
const error = reactive({
	lead: '',
	unit: '',
	description: '',
})
const data = reactive({
	assigned_to: task.value.assigned_to?.name || '',
	lead: task.value.reference_docname || '',
	unit: task.value.unit || '',
	description: task.value.description || '',
	task_type: 'Unit Inquiry',
})

// methods
async function saveTask() {
	loading.value = true
	// assign ref to new value -> it lose the reactive value when check the res.success
	const uploadAreaRef = uploadArea.value

	try {
		validate()
		const res = editMode.value
			? await updateTask({ ...data, name: task.value.name })
			: await createTask(data)
		if (res.success) {
			const taskName = res.data.name
			// If there are files to upload
			if (uploadAreaRef.files.length > 0) {
				await uploadAreaRef.uploadFilesWithDocname(taskName)
			}
			toast.success(__('Task created successfully'))
		} else {
			toast.error(res?.data?.messages?.join('\n') || 'Error while creating task')
		}
	} catch (error) {
		toast.error(error?.messages?.join('\n') || 'Something went wrong, try again')
	} finally {
		loading.value = false
	}
}

function validate() {
	let hasError = false
	if (!data.lead.trim()) {
		error.lead = __('Lead is required')
		hasError = true
	}
	if (!data.unit.trim()) {
		error.unit = __('Unit is required')
		hasError = true
	}
	if (!data.description.trim().length > 250) {
		error.description = __('Description should be less than 250 characters')
		hasError = true
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}

function leadContactMethodOptions() {
	return [
		{ label: 'Whatsapp', value: 'Whatsapp' },
		{ label: 'Email', value: 'Email' },
		{ label: 'Phone', value: 'Phone' },
	]
}
</script>
