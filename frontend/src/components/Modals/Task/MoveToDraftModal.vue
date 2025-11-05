<template>
	<div
		:class="['grid gap-3', isMobileView ? 'grid-cols-1' :'grid-cols-2']">
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Unit') }} <span class="text-red-500">*</span></label
			>
			{{ error.unit }}
			<Link
				variant="outline"
				doctype="CRM Unit"
				size="lg"
				class="!mt-1.5"
				v-model="data.unit"
				:placeholder="__('Select unit')"
			/>
			<span v-if="error.unit" class="text-red-600 text-sm mt-2">{{ error.unit }}</span>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Unit Number') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="text"
				v-model="data.unit_number"
				:placeholder="__('Unit number')"
				disabled
			/>
		</div>

		<div
			:class="['space-y-2', isMobileView ? 'col-span-1':'col-span-2']"
			>
			<label class="text-subheading text-lg font-medium flex items-center gap-2">
				{{ __('Draft Reason') }}
				<span class="text-red-500">*</span>
			</label>
			<Autocomplete
				:placeholder="__('Select')"
				size="md"
				variant="solid"
				class="border rounded-md w-full"
				:options="draftReasonOptions()"
				v-model="data.draft_reason"
			/>
			<span v-if="error.draft_reason" class="text-red-600 text-sm mt-2">{{
				error.draft_reason
			}}</span>
		</div>

		<div
			:class="['space-y-2', isMobileView ? 'col-span-1':'col-span-2']"
		>
			<label class="text-subheading text-lg font-medium">{{ __('Notes') }}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.notes"
				resize-mode="none"
				class="!resize-none"
				:placeholder="__('Enter notes')"
			/>
		</div>

		<div :class="['space-y-2', isMobileView ? 'col-span-1':'col-span-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Attachments') }}</label>
			<CustomUploadArea ref="uploadArea" doctype="CRM Unit" :docname="null" />
		</div>
		<!-- actions -->
		<div
			:class="['flex items-center gap-2 mt-8', isMobileView ? 'col-span-1 flex-col':'col-span-2 flex-row']">
			<AddAction
				:class="[isMobileView ? 'min-h-[44px] w-full': '']"
				:label="editMode ? 'Update' : 'Save to Draft'"
				@click="saveTask"
				:loading="loading"
				:disabled="disabled || loading || !isDirty"
			/>
			<CancelAction :class="[isMobileView ? 'min-h-[44px] w-full': '']" label="Cancel" @click="$emit('close')" />
		</div>
	</div>
</template>

<script setup>
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import { call, toast, TextInput, Textarea } from 'frappe-ui'
import Link from '@/components/Controls/Link.vue'
import { reactive, ref, watch, inject, computed } from 'vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import CustomUploadArea from '@/components/CustomUploadArea.vue'
import {isMobileView} from "@/composables/settings";
// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')
// refs
const loading = ref(false)
const disabled = computed(() => !data.unit || !data.draft_reason?.value) // without computed raise error the data #undefined
const isDirty = computed(
	() =>
		task.value.reference_docname !== data.unit ||
		task.value.notes !== data.notes ||
		task.value.draft_reason !== data.draft_reason.value,
)
const error = reactive({
	unit: '',
	draft_reason: '',
})

const uploadArea = ref(null)
const data = reactive({
	unit: task.value?.reference_docname || '',
	unit_number: '',
	notes: task.value?.notes || '',
	reference_doctype: 'CRM Unit',
	draft_reason: {
		label: task.value?.draft_reason || '',
		value: task.value?.draft_reason || '',
	},
	task_type: 'Move To Draft',
})

async function saveTask() {
	loading.value = true
	// assign ref to new value -> it lose the reactive value when check the res.success
	const uploadAreaRef = uploadArea.value
	try {
		validate()
		let res
		if (editMode.value) {
			res = await updateTask({
				...data,
				name: task.value.name,
				reference_docname: data.unit,
				draft_reason: data.draft_reason,
				notes: data.notes,
			})
		} else {
			res = await createTask(data)
		}

		if (res.success) {
			if (uploadAreaRef.files?.length > 0) {
				await uploadAreaRef.uploadFilesWithDocname(data.unit)
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
	if (!data.unit.trim()) {
		error.unit = __('Unit is required')
		hasError = true
	}
	if (!data.draft_reason?.value?.trim()) {
		error.draft_reason = __('Draft reason is required')
		hasError = true
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}

async function fetchUnitNumber(unit) {
	if (unit) {
		try {
			const response = await call('frappe.client.get_value', {
				doctype: 'CRM Unit',
				fieldname: ['ref', 'unit_number'],
				filters: {
					name: unit,
				},
			})
			data.unit_number = response.unit_number || response.ref
		} catch (error) {
			console.error('Error fetching unit details:', error)
		}
	} else {
		data.unit_number = ''
	}
}

function draftReasonOptions() {
	return [
		{ label: 'Waiting on documents', value: 'Waiting on documents' },
		{ label: 'Missing information', value: 'Missing information' },
	]
}

// watcher
watch(
	() => data.unit,
	(newVal) => {
		if (newVal) fetchUnitNumber(data.unit)
	},
)
</script>
