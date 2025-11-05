<template>
	<div :class="['grid gap-4 gap-y-5', isMobileView ? 'grid-cols-1':'grid-cols-2']">
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Title') }} <span class="text-red-500">*</span></label
			>
			<TextInput
				variant="outline"
				size="lg"
				type="text"
				:label="__('Title')"
				v-model="data.title"
				:placeholder="__('Enter the title')"
			/>
			<span v-if="error.title" class="text-red-500 text-sm">{{ error.title }}</span>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium flex items-center gap-2">
				{{ __('Category') }}
			</label>
			<Select
				:placeholder="__('Select Category')"
				size="lg"
				variant="outline"
				class="py-1.5 mt-1.5"
				:options="taskCategoryOptions()"
				v-model="data.category"
			/>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Date') }} <span class="text-red-500">*</span></label
			>
			<TextInput
				:type="'date'"
				size="lg"
				variant="outline"
				:placeholder="__('Select date')"
				v-model="data.date"
			/>
			<span v-if="error.date" class="text-red-500 text-sm">{{ error.date }}</span>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Time') }} <span class="text-red-500">*</span></label
			>
			<TextInput
				:type="'time'"
				size="lg"
				variant="outline"
				:placeholder="__('Pick time')"
				v-model="data.time"
			/>
			<span v-if="error.time" class="text-red-500 text-sm">{{ error.time }}</span>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium flex items-center gap-2">
				<span>{{ __('Priority') }}</span>
				<TaskPriorityIcon :priority="data.priority" />
			</label>
			<Select
				:placeholder="__('Select Priority')"
				size="lg"
				variant="outline"
				class="py-1.5 mt-1.5"
				:options="taskPriorityOptions()"
				v-model="data.priority"
			/>
		</div>
		<div class="col-span-1 space-y-2" v-if="data.reference_docname">
			<label class="text-subheading text-lg font-medium flex items-center gap-2 mt-1">
				{{ data.reference_doctype }}
			</label>
			<div
				class="border border-gray-300 rounded-lg px-3 h-[42px] flex items-center bg-white text-base cursor-pointer hover:bg-gray-50 text-blue-600 underline mt-2.5"
				@click="openReference"
			>
				{{ data.reference_docname }}
			</div>
		</div>

		<div :class="[' space-y-2', isMobileView ? 'col-span-1' :'col-span-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Assigned To') }}</label>
			<Link
				variant="outline"
				size="lg"
				class=""
				:value="getUser(data.assigned_to).full_name"
				doctype="User"
				@change="(option) => (data.assigned_to = option)"
				:placeholder="__('John Doe')"
				:hideMe="true"
			>
				<template #prefix>
					<UserAvatar class="mr-2 !h-4 !w-4" :user="data.assigned_to" />
				</template>
				<template #item-prefix="{ option }">
					<UserAvatar class="mr-2" :user="option.value" size="sm" />
				</template>
				<template #item-label="{ option }">
					<Tooltip :text="option.value">
						<div class="cursor-pointer text-ink-gray-9">
							{{ getUser(option.value).full_name }}
						</div>
					</Tooltip>
				</template>
			</Link>
		</div>
		<div :class="[' space-y-2', isMobileView ? 'col-span-1' :'col-span-2']">
			<Checkbox
				:label="__('Assign to me')"
				size="md"
				theme="green"
				variant="outline"
				labelClasses=" !text-sm !text-ink-gray-3"
				v-model="data.assign_to_me"
			/>
		</div>
		<div :class="[' space-y-2', isMobileView ? 'col-span-1' :'col-span-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Description') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				v-model="data.description"
				:placeholder="__('Enter task description')"
			/>
		</div>
		<div :class="[' space-y-2', isMobileView ? 'col-span-1' :'col-span-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Notes') }}</label>
			{{ task.notes }}
			<TextInput
				variant="outline"
				size="lg"
				v-model="data.notes"
				:placeholder="__('Enter your notes')"
			/>
		</div>
		<div :class="[' space-y-2', isMobileView ? 'col-span-1' :'col-span-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Attachments') }}</label>
			<CustomUploadArea ref="uploadArea" doctype="CRM Task" :docname="null" />
		</div>
		<!-- actions -->
		<div class="flex items-center gap-2 mt-8"
			 :class="[ isMobileView ? 'col-span-1' :'col-span-2']"
		>
			<AddAction
				class="flex-1"
				:label="editMode ? 'Update' : 'Save'"
				@click="saveTask"
				:loading="loading"
				:disabled="disabled || loading"
			/>
			<CancelAction class="flex-1" label="Cancel" @click="$emit('close')" />
		</div>
	</div>
</template>

<script setup>
// imports
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import { TextInput, Select, toast } from 'frappe-ui'
import Tooltip from "@/components/frappe-ui/Tooltip.vue"
import Checkbox from '@/components/frappe-ui/Checkbox.vue'
import TaskPriorityIcon from '@/components/Icons/TaskPriorityIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import Link from '@/components/Controls/Link.vue'
import { taskPriorityOptions } from '@/utils'
import { usersStore } from '@/stores/users'
import { reactive, inject, ref, computed } from 'vue'
import CustomUploadArea from '@/components/CustomUploadArea.vue'
import { isMobileView } from '@/composables/settings'
const { getUser } = usersStore()

// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')
// refs
const loading = ref(false)
const disabled = computed(() => !data.title || !data.date || !data.time)
let date = ref(task.value?.due_date?.split(' ')?.[0] || '')
let time = ref(task.value?.due_date?.split(' ')?.[1])
const data = reactive({
	title: task.value?.title || '',
	category: task.value?.category || '',
	date: date.value,
	time: time.value,
	priority: task.value?.priority || 'Low',
	assigned_to: task.value?.assigned_to?.name || '',
	assign_to_me: task.value?.assigned_to?.name === getUser().name,
	description: task.value?.description || '',
	notes: task.value?.notes || '',
	task_type: 'Normal Task',	
	reference_doctype: task.value?.reference_doctype || '',
	reference_docname: task.value?.reference_docname || '',

})
const uploadArea = ref(null)
const error = reactive({
	title: '',
	date: '',
	time: '',
})
// methods
function taskCategoryOptions() {
	return [
		{ label: 'Internal', value: 'Internal' },
		{ label: 'Reminder', value: 'Reminder' },
		{ label: 'Follow-up', value: 'Follow-up' },
	]
}
function openReference() {
	if (!data.reference_doctype || !data.reference_docname) return

	const docname = data.reference_docname
	const routeMap = {
		'CRM Deal': 'deals',
		'CRM Lead': 'leads',
		'CRM Unit': 'units',
		'CRM Project': 'projects',
	}

	const folder = routeMap[data.reference_doctype] || data.reference_doctype.toLowerCase().replace(/ /g, '-')

	const route = `/crm/${folder}/${docname}#overview`

	window.open(route, '_blank')
}

async function saveTask() {
	loading.value = true
	// assign ref to new value -> it lose the reactive value when check the res.success
	const uploadAreaRef = uploadArea.value
	try {
		validate()
		const res = editMode.value
			? await updateTask({
					...data,
					name: task.value.name,
					task_type: 'Task',
					due_date: `${data.date} ${data.time}`,
				})
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
		console.log({error})
		toast.error(error?.messages?.join('\n') || 'Something went wrong, try again')
	} finally {
		loading.value = false
	}
}

function validate() {
	let hasError = false
	error.title = ''
	if (!data.title.trim()) {
		error.title = __('Title is required')
		hasError = true
	}
	if (!data.date.trim()) {
		error.date = __('Date is required')
		hasError = true
	}
	if (!data.time.trim()) {
		error.time = __('Time is required')
		hasError = true
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}
</script>
