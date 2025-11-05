<template>
	<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
		<!-- basic info -->
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', ' my-3']">
			<h3 class="text-subheading font-semibold text-2xl">{{ __('Basic Info') }}:</h3>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Title') }} <span class="text-red-600">*</span></label
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
				>{{ __('Unit ID') }} <span class="text-red-600">*</span></label
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
			<label class="text-subheading text-lg font-medium flex items-center gap-2">
				<span> {{ __('Priority') }} </span>
				<TaskPriorityIcon :priority="data.priority?.value" />
			</label>
			<Autocomplete
				v-model="data.priority"
				variant="outline"
				size="lg"
				class="border rounded !h-10 mt-3.5"
				:options="[
					{ label: 'Low', value: 'Low' },
					{ label: 'Medium', value: 'Medium' },
					{ label: 'High', value: 'High' },
				]"
				:placeholder="__('Select')"
			/>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Unit Number') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="text"
				v-model="data.unit_number"
				disabled
				:placeholder="__('Enter unit number')"
			/>
			<span v-if="error.unit_number" class="text-red-600 text-sm mt-2">{{
				error.unit_number
			}}</span>
		</div>
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', ' space-y-2 mt-2']">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Lead/Client') }} <span class="text-red-600">*</span></label
			>
			<Link
				variant="outline"
				doctype="CRM Lead"
				class="!mt-1.5"
				size="lg"
				v-model="data.lead"
				:placeholder="__('Select')"
			/>
			<span v-if="error.lead" class="text-red-600 text-sm mt-2">{{ error.lead }}</span>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Phone Number') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="tel"
				v-model="data.client_number"
				disabled
				:placeholder="__('Enter phone number')"
			>
				<template #prefix>
					<FeatherIcon class="w-4" name="phone" />
				</template>
			</TextInput>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium">{{ __('Email Address') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="email"
				class="form-control flex-1 truncate text-lg rounded-md h-10 py-1.5"
				v-model="data.client_email"
				disabled
				:placeholder="__('Enter email address')"
			>
				<template #prefix>
					<FeatherIcon class="w-4" name="mail" />
				</template>
			</TextInput>
		</div>

		<!-- Preferred Schedules -->
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', ' my-3']">
			<h3 class="text-subheading font-semibold text-2xl">
				{{ __('Preferred Schedules') }}:
			</h3>
		</div>

		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Date') }} <span class="text-red-600">*</span></label
			>
			<TextInput :type="'date'" size="lg" variant="outline" v-model="data.date" />
			<span v-if="error.date" class="text-red-600 text-sm mt-2">{{ error.date }}</span>
		</div>
		<div class="col-span-1 space-y-2">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Time') }} <span class="text-red-600">*</span></label
			>
			<TextInput :type="'time'" size="lg" variant="outline" v-model="data.time" />
			<span v-if="error.time" class="text-red-600 text-sm mt-2">{{ error.time }}</span>
		</div>
		<!-- Viewing Type-->
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Viewing Type') }}</label>
			<Autocomplete
				v-model="data.viewing_type"
				variant="outline"
				size="xl"
				class="border rounded !h-10"
				:options="[
					{ label: 'Virtual', value: 'Virtual' },
					{ label: 'In Personal', value: 'In Personal' },
				]"
				:placeholder="__('Select')"
			/>
		</div>
		<!-- Notes & Context -->
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'my-3']">
			<h3 class="text-subheading font-semibold text-2xl">{{ __('Notes & Context') }}:</h3>
		</div>
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Description') }}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.description"
				resize-mode="none"
				class="!resize-none"
				:placeholder="__('Enter description')"
			/>
			<span v-if="error.description" class="text-red-600 text-sm mt-2">{{
				error.description
			}}</span>
		</div>

		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
			<label class="text-subheading text-lg font-medium">{{
				__('Reason for Viewing')
			}}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.description"
				resize-mode="none"
				class="!resize-none"
				:placeholder="__('Enter the reason')"
			/>
		</div>
		<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', ' space-y-2']">
			<label class="text-subheading text-lg font-medium">{{ __('Attachments') }}</label>
			<CustomUploadArea ref="uploadArea" doctype="CRM Task" :docname="null" />
		</div>
		<!-- actions -->
		<div
			v-if="!editMode"
			:class="[isMobileView ? 'col-span-1' : 'col-span-2', 'flex items-center gap-2 mt-8']"
		>
			<AddAction
				class="flex-1"
				label="Save"
				@click="saveTask"
				:loading="loading"
				:disabled="disabled || loading"
			/>
			<CancelAction class="flex-1" label="Cancel" @click="$emit('close')" />
		</div>
		<div
			v-else
			:class="[isMobileView ? 'col-span-1' : 'col-span-2', 'flex items-center gap-2 mt-8']"
		>
			<AddAction
				class="flex-1"
				label="Approve"
				@click="() => rescheduleViewing('approve')"
				:loading="loading"
				:disabled="loading"
			/>
			<AddAction
				class="flex-1"
				label="Decline"
				variant="outline"
				theme="green"
				@click="
					() => {
						decline = true
						scrollToDeclineSection()
					}
				"
			/>
		</div>
		<div
			v-if="decline"
			:class="[isMobileView ? 'col-span-1' : 'col-span-2', 'border-t']"
			id="declined-section"
		>
			<div class="flex items-center justify-end mt-4">
				<CancelAction
					class="w-5 h-5 max-w-5"
					theme="red"
					variant="solid"
					label="x"
					@click="
						() => {
							decline = false
							rescheduleData.date = ''
							rescheduleData.time = ''
						}
					"
				/>
			</div>
			<div
				:class="[
					'grid  gap-3 mt-4',
					isMobileView ? 'col-span-1 grid-cols-1' : 'col-span-2 grid-cols-2',
				]"
			>
				<div class="col-span-1 space-y-2">
					<label class="text-subheading text-lg font-medium"
						>{{ __('Suggested Date') }}<span class="text-red-600">*</span></label
					>
					<TextInput
						:type="'date'"
						size="lg"
						variant="outline"
						v-model="rescheduleData.date"
						:required="decline = true"
					/>
				</div>
				<div class="col-span-1 space-y-2">
					<label class="text-subheading text-lg font-medium"
						>{{ __('Suggested Time') }} <span class="text-red-600">*</span></label
					>
					<TextInput
						:type="'time'"
						size="lg"
						variant="outline"
						v-model="rescheduleData.time"
						:required="decline = true"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
					<label class="text-subheading text-lg font-medium"
						>{{ __('Reject Reason') }}<span class="text-red-600">*</span></label
					>
					<Textarea
						variant="outline"
						size="lg"
						type="textarea"
						v-model="rescheduleData.reject_reason"
						resize-mode="none"
						class="!resize-none"
						:placeholder="__('Enter the reason')"
					/>
				</div>
			</div>
			<div class="flex-1 items-center gap-2 mt-8 space-y-2">
				<AddAction
					class="w-full"
					label="Propose Time"
					@click="() => rescheduleViewing('reject')"
					:disabled="
						!rescheduleData.date ||
						!rescheduleData.time ||
						!rescheduleData.reject_reason
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
// imports
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import TaskPriorityIcon from '@/components/Icons/TaskPriorityIcon.vue'

import CustomUploadArea from '@/components/CustomUploadArea.vue'
import { call, toast, TextInput, Textarea, DateTimePicker, createListResource } from 'frappe-ui'
import Link from '@/components/Controls/Link.vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { inject, reactive, ref, computed, watch, onBeforeUnmount } from 'vue'
import { usersStore } from '@/stores/users'
import { isMobileView } from '@/composables/settings'

// stores
const { getUser } = usersStore()
const { is_call_center, name: userName } = getUser()
// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')

// refs
const decline = ref(false)
const timerId = ref(null)
const loading = ref(false)
const uploadArea = ref(null)
const disabled = computed(() => !data.unit || !data.lead || !data.date || !data.time)
const error = ref({
	title: '',
	unit: '',
	lead: '',
	date: '',
	time: '',
	reschedule_date: '',
	reschedule_time: '',
})
const data = reactive({
	title: '',
	unit: '',
	unit_number: '',
	lead: '',
	client_number: '',
	client_email: '',
	date: '',
	time: '',
	// viewing_type: '',
	priority: { label: task?.value?.priority || 'Low', value: task?.value?.priority || 'Low' },
	description: task?.value?.description || '',
	task_type: 'Viewing Request',
})
const rescheduleData = reactive({
	date: '',
	time: '',
	reject_reason: '',
})
// methods
async function saveTask() {
	loading.value = true
	// assign ref to new value -> it lose the reactive value when check the res.success
	const uploadAreaRef = uploadArea.value
	try {
		validate()
		let res = null
		if (editMode.value) {
			res = await updateTask({
				...data,
				name: task?.value?.name,
				due_date: `${data.date} ${data.time}`,
			})
			await updateViewingRequest(viewingData.value.name)
		} else {
			res = await createTask(data)
		}
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
		console.log(error)
		toast.error(error?.messages?.join('\n') || 'Something went wrong, try again')
	} finally {
		loading.value = false
	}
}

async function rescheduleViewing(action) {
	if (getUser().name === 'Administrator') {
		toast.error(__("System user can't reschedule viewing request"))
		return
	}

	try {
		const response = await call(
			'revenyu.revenyu.doctype.crm_unit_viewing_appointment.crm_unit_viewing_appointment.reschedule_viewing',
			{
				viewing_id: task.value.viewing,
				action,
				new_schedule_date:
					action === 'approve'
						? `${rescheduleData.date} ${rescheduleData.time}`
						: `${data.date} ${data.time}`,
				reject_reason: rescheduleData.reject_reason,
			},
		)
		if (response?.success) {
			toast.success(__('Viewing rescheduled successfully'))
		} else {
			toast.error(__('Something went wrong, try again'))
		}
	} catch (error) {
		console.error(error)
		toast.error(__(error?.messages?.join('\n') || 'Viewing rescheduled successfully'))
	}
}
function validate() {
	let hasError = false
	// Required fields validation
	if (!data.title.trim()) {
		error.value.title = __('Title is mandatory')
		hasError = true
	}
	if (!data.unit.trim()) {
		error.value.unit = __('Unit is mandatory')
		hasError = true
	}
	if (!data.lead.trim()) {
		error.value.lead = __('Lead is mandatory')
		hasError = true
	}
	if (!data.date) {
		error.value.date = __('Date is mandatory')
		hasError = true
	}
	if (!data.time) {
		error.value.time = __('Time is mandatory')
		hasError = true
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}

function handlePayload() {
	return {
		...data,
		document_type: 'CRM Unit',
		document_id: data.unit,
		agent_time: !is_call_center ? data.viewing_date_time : '',
		owner_time: is_call_center ? data.viewing_date_time : '',
		last_one: is_call_center ? 'Call Center' : 'Agent',
	}
}
async function updateViewingRequest(name) {
	loading.value = true
	try {
		const res = await call('frappe.client.set_value', {
			doctype: 'Viewing',
			name,
			fieldname: handlePayload(),
		})
	} catch (error) {
		toast.error(error?.messages?.join('\n') || 'Something went wrong, try again')
	} finally {
		loading.value = false
	}
}

const viewingRequest = createListResource({
	doctype: 'CRM Unit Viewing Appointment',
	filters: { task: task?.value?.name },
	cache: ['viewingRequest', task?.value?.name],
	fields: [
		'name',
		'document_id as unit',
		'title',
		'lead',
		'agent_time',
		'owner_time',
		'call_center_time',
		'last_one',
	],
	limit: 1,
	auto: true,
})
const viewingData = computed(() => viewingRequest.data?.[0])

async function fetchUnitNumber(unit) {
	const res = await call('frappe.client.get_value', {
		doctype: 'CRM Unit',
		filters: { name: unit },
		fieldname: 'unit_number',
	})
	data.unit_number = res.unit_number
}
async function fetchLeadNumber(lead) {
	const res = await call('frappe.client.get_value', {
		doctype: 'CRM Lead',
		filters: { name: lead },
		fieldname: ['email', 'mobile_no'],
	})
	data.client_number = res.mobile_no || ''
	data.client_email = res.email || ''
}

function scrollToDeclineSection() {
	timerId.value = setTimeout(() => {
		document.getElementById('declined-section')?.scrollIntoView({ behavior: 'smooth' })
	}, 100)
}

onBeforeUnmount(() => {
	if (timerId.value) clearTimeout(timerId.value)
})

watch(
	() => viewingData.value,
	(value) => {
		// handle if value keys is null
		let currentDate = ''
		let currentTime = ''

		if (is_call_center) {
			currentDate = value?.owner_time?.split(' ')[0]
			currentTime = value?.owner_time?.split(' ')[1]
		} else {
			currentDate = value?.call_center_time?.split(' ')[0]
			currentTime = value?.call_center_time?.split(' ')[1]
		}

		if (value && editMode.value) {
			Object.assign(data, value)
		}
		data.date = currentDate
		data.time = currentTime
	},
)
watch(
	() => data.unit,
	(value) => {
		if (!value) data.unit_number = ''
		else fetchUnitNumber(value)
	},
)
watch(
	() => data.lead,
	(value) => {
		if (!value) {
			data.client_number = ''
			data.client_email = ''
		} else fetchLeadNumber(value)
	},
)
</script>
