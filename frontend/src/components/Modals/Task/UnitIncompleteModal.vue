<template>
	<div :class="['grid gap-3', isMobileView ? 'grid-cols-1': 'grid-cols-2']">
		<div :class="['space-y-2', isMobileView ? 'col-span-1': 'col-span-2']">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Title') }} <span class="text-red-500">*</span></label
			>
			<TextInput
				variant="outline"
				size="lg"
				type="text"
				v-model="data.title"
				:placeholder="__('Enter title')"
			/>
			<span v-if="error.title" class="text-red-600 text-sm mt-2">{{ error.title }}</span>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Unit ID') }} <span class="text-red-500">*</span></label
			>
			<Link
				variant="outline"
				doctype="CRM Unit"
				class="!mt-1.5"
				size="lg"
				v-model="data.unit"
				:placeholder="__('Select')"
			/>
			<span v-if="error.unit" class="text-red-600 text-sm mt-2">{{ error.unit }}</span>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Issue Type') }}</label>
			<Autocomplete
				v-model="data.issue_type"
				variant="outline"
				size="lg"
				class=""
				:options="issueTypeOptions()"
				:placeholder="__('Select')"
			/>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Date') }}</label>
			<TextInput :type="'date'" size="lg" variant="outline" v-model="data.date" />
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Time') }}</label>
			<TextInput :type="'time'" size="lg" variant="outline" v-model="data.time" />
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Assigned To') }}</label>
			<Link
				variant="outline"
				doctype="User"
				hideMe
				class="!mt-1.5"
				size="lg"
				v-model="data.assigned_to"
				:placeholder="__('Select user')"
			/>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium flex items-center gap-1">
				<span>{{ __('Priority') }}</span>
				<TaskPriorityIcon :priority="data.priority" />
			</label>
			<Select
				v-model="data.priority"
				variant="outline"
				size="lg"
				class="mt-1.5"
				:options="[
					{ label: 'Low', value: 'Low' },
					{ label: 'Medium', value: 'Medium' },
					{ label: 'High', value: 'High' },
				]"
				:placeholder="__('Select priority')"
			/>
		</div>

		<div :class="[isMobileView ? 'col-span-1': 'col-span-2' , 'space-y-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Description') }}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.description"
				class="resize-none"
				:placeholder="__('Enter description')"
			/>
			<span v-if="error.description" class="text-red-600 text-sm mt-2">
				{{ error.description }}
			</span>
			<span class="text-sm text-ink-gray-5 flex items-center gap-1">
				<FeatherIcon name="info" class="h-3 w-3" />
				{{ __('max 250 characters') }}
			</span>
		</div>

		<!-- actions -->
		<div :class="[isMobileView ? 'col-span-1 flex-col': 'col-span-2 flex-row', 'flex items-center gap-2 mt-8 ']">
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
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import { toast, TextInput, Textarea, Select } from 'frappe-ui'
import Link from '@/components/Controls/Link.vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { computed, inject, reactive, ref } from 'vue'
import {isMobileView} from "@/composables/settings";

// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')

// refs
const loading = ref(false)
const disabled = computed(() => !data.title || !data.unit || data.description.length > 250)
const isDirty = computed(
	() =>
		task.value.title !== data.title ||
		task.value.description !== data.description ||
		task.value.assigned_to?.name !== data.assigned_to ||
		task.value.priority !== data.priority ||
		task.value.due_date !== `${data.date} ${data.time}`,
)
const error = ref({
	title: '',
	unit: '',
	description: '',
})
const data = reactive({
	title: task.value?.title || '',
	unit: task.value?.reference_docname || '',
	issue_type: '',
	date: task.value.due_date?.split(' ')[0] || '',
	time: task.value.due_date?.split(' ')[1] || '',
	assigned_to: task.value.assigned_to?.name || '',
	priority: task.value.priority || '',
	description: task.value.description || '',
	task_type: 'Unit Incomplete',
})
// methods
async function saveTask() {
	loading.value = true
	try {
		validate()
		const res = editMode.value
			? await updateTask({
					...data,
					name: task.value.name,
					reference_docname: data.unit,
					due_date: `${data.date} ${data.time}`,
				})
			: await createTask(data)
		if (res.success) {
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
	if (!data.title.trim()) {
		error.title = __('Title is required')
		hasError = true
	}
	if (!data.unit.trim()) {
		error.unit = __('Unit is required')
		hasError = true
	}
	if (data.description.length > 250) {
		error.description = __('Description should be less than 250 characters')
		hasError = true
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}

function issueTypeOptions() {
	return [
		{ label: 'Missing Images', value: 'Missing Images' },
		{ label: 'Wrong Price', value: 'Wrong Price' },
		{ label: 'Wrong Location', value: 'Wrong Location' },
	]
}
</script>
