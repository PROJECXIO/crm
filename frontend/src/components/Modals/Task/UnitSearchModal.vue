<template>
	<div class="grid grid-cols-2 gap-3">
		<!-- search criteria -->
		<div class="col-span-2 mb-3">
			<h3 class="text-subheading font-semibold text-2xl">{{ __('Search Criteria') }}:</h3>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium"
				>{{ __('City') }} <span class="text-red-500">*</span></label
			>
			<Link
				variant="outline"
				doctype="CRM Territory"
				class="!mt-1.5"
				size="lg"
				v-model="data.city"
				:placeholder="__('Enter city')"
			/>
			<span v-if="error.city" class="text-red-600 text-sm mt-2">{{ error.city }}</span>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Community') }} <span class="text-red-500">*</span></label
			>
			<Link
				variant="outline"
				doctype="Community"
				class="!mt-1.5"
				size="lg"
				v-model="data.community"
				:placeholder="__('Enter community')"
			/>
			<span v-if="error.community" class="text-red-600 text-sm mt-2">{{
				error.community
			}}</span>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Sub Community') }}</label>
			<Link
				variant="outline"
				doctype="Sub Community"
				class="!mt-1.5"
				size="lg"
				v-model="data.sub_community"
				:placeholder="__('Enter sub community')"
			/>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Unit Number') }}</label>
			<Link
				variant="outline"
				doctype="CRM Unit"
				class="!mt-1.5"
				size="lg"
				v-model="data.unit"
				:placeholder="__('Select')"
			/>
		</div>

		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Property Type') }}</label>
			<Link
				variant="outline"
				doctype="Property Type"
				class="!mt-1.5"
				size="lg"
				v-model="data.property_type"
				:placeholder="__('Enter property type')"
			/>
		</div>

		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Furniture') }}</label>
			<Autocomplete
				v-model="data.furniture"
				variant="outline"
				size="lg"
				class="!mt-1.5"
				:options="[
					{
						label: 'Unfurnished',
						value: 'Unfurnished',
					},
					{ label: 'Partly furnished', value: 'Partly Furnished' },
					{ label: 'Furnished', value: 'Furnished' },
				]"
				:placeholder="__('Select furniture')"
			/>
		</div>

		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{
				__('Number of bedrooms')
			}}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="number"
				v-model="data.beds"
				:placeholder="__('Enter number of bedroom')"
			/>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{
				__('Number of bathrooms')
			}}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="number"
				:positive="false"
				v-model="data.baths"
				:placeholder="__('Enter number of bathroom')"
			/>
		</div>

		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium"
				>{{ __('Property Purpose') }} <span class="text-red-500">*</span></label
			>
			<Autocomplete
				v-model="data.property_purpose"
				variant="outline"
				size="lg"
				class="!mt-1.5"
				:options="[
					{
						label: 'Sale',
						value: 'Sale',
					},
					{ label: 'Rent', value: 'Rent' },
				]"
				:placeholder="__('Select property purpose')"
			/>
			<span v-if="error.property_purpose" class="text-red-600 text-sm mt-2">{{
				error.property_purpose
			}}</span>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Budget Range') }}</label>
			<div class="flex items-center gap-2">
				<TextInput
					variant="outline"
					size="lg"
					type="number"
					v-model="data.max_price"
					:placeholder="__('MaxPrice')"
				/>
				<span>:</span>
				<TextInput
					variant="outline"
					size="xl"
					type="number"
					v-model="data.min_price"
					:placeholder="__('MinPrice')"
				/>
			</div>
			<div class="flex flex-col gap-1">
				<span v-if="error.max_price" class="text-red-600 text-sm">{{
					error.max_price
				}}</span>
				<span v-if="error.min_price" class="text-red-600 text-sm">{{
					error.min_price
				}}</span>
			</div>
		</div>

		<!-- client info -->
		<div :class="['my-3', isMobileView ? 'col-span-2': 'col-span-1']">
			<h3 class="text-subheading font-semibold text-2xl">{{ __('Client Info') }}:</h3>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Full Name') }}</label>
			<Link
				variant="outline"
				doctype="CRM Lead"
				class="!mt-1.5"
				size="lg"
				v-model="data.lead"
				:placeholder="__('Select client')"
			/>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Phone Number') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="tel"
				class="form-control flex-1 truncate text-lg rounded-md h-10 py-1.5"
				v-model="data.phone_number"
				:placeholder="__('Enter phone number')"
			>
				<template #prefix>
					<FeatherIcon class="w-4" name="phone" />
				</template>
			</TextInput>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Email Address') }}</label>
			<TextInput
				variant="outline"
				size="lg"
				type="email"
				class="form-control flex-1 truncate text-lg rounded-md h-10 py-1.5"
				v-model="data.email_address"
				:placeholder="__('Enter email address')"
				><template #prefix>
					<FeatherIcon class="w-4" name="mail" />
				</template>
			</TextInput>
			<span v-if="error.email_address" class="text-red-600 text-sm mt-2">{{
				error.email_address
			}}</span>
		</div>
		<!-- internal extras -->
		<div class="col-span-2 my-3">
			<h3 class="text-subheading font-semibold text-2xl">{{ __('Internal Extras') }}:</h3>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Assign To') }}</label>
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
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Internal Urgency') }}</label>
			<Link
				variant="outline"
				doctype="User"
				hideMe
				class="!mt-1.5"
				size="lg"
				v-model="data.internal_urgency"
				:placeholder="__('Internal Urgency')"
			/>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Notes') }}</label>
			<Textarea
				variant="outline"
				size="lg"
				type="textarea"
				v-model="data.notes"
				class="resize-none"
				:placeholder="__('Enter notes')"
			/>
		</div>
		<div :class="['space-y-2', isMobileView ? 'col-span-2': 'col-span-1']">
			<label class="text-subheading text-lg font-medium">{{ __('Attachments') }}</label>
			<CustomUploadArea ref="uploadArea" doctype="CRM Task" :docname="null" />
		</div>
		<!-- actions -->
		<div :class="[isMobileView ? 'flex-col': 'flex-row', 'col-span-2  flex w-full items-center gap-2 mt-8 ']">
			<AddAction
				:class="[isMobileView ? 'min-h-[44px] w-full': '']"
				:label="editMode ? 'Update' : 'Save'"
				@click="saveTask"
				:loading="loading"
				:disabled="disabled || loading"
			/>
			<CancelAction :class="[isMobileView ? 'min-h-[44px] w-full': '']" label="Cancel" @click="$emit('close')" />
		</div>
	</div>
</template>

<script setup>
// imports
import AddAction from '@/components/Modals/Actions/Add.vue'
import CancelAction from '@/components/Modals/Actions/Cancel.vue'
import CustomUploadArea from '@/components/CustomUploadArea.vue'
import {isMobileView} from "@/composables/settings";

import { toast, TextInput, Textarea, createListResource, call } from 'frappe-ui'
import Link from '@/components/Controls/Link.vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import { validateEmail } from '@/utils'

// inject
const task = inject('currentTask', {})
const editMode = inject('editMode', false)
const createTask = inject('createTask')
const updateTask = inject('updateTask')

// emits
const emits = defineEmits(['close'])
// refs
const loading = ref(false)
const disabled = computed(() => !data.city || !data.community || !data.property_purpose)
// const isDirty = computed(
// 	() =>
// 		// data.city !== searchRequest.data?.[0].city ||
// 		// data.community !== searchRequest.data?.[0].community ||
// 		// data.property_purpose !== searchRequest.data?.[0].property_purpose ||
// 		// data.lead !== searchRequest.data?.[0].lead ||
// 		// data.notes !== searchRequest.data?.[0].notes,
// 	// data.phone_number !== searchRequest.data?.[0].phone_number ||
// 	// data.email_address !== searchRequest.data?.[0].email_address ||
// )
const uploadArea = ref(null)
const error = ref({
	city: '',
	community: '',
	property_purpose: '',
	email_address: '',
})
const data = reactive({
	city: '',
	community: '',
	sub_community: '',
	unit: task.value.unit_id || '',
	property_type: '',
	furniture: '',
	beds: '',
	baths: '',
	property_purpose: '',
	min_price: '',
	max_price: '',
	lead: '',
	phone_number: '',
	email_address: '',
	assigned_to: task.value.assigned_to?.name || '',
	internal_urgency: '',
	notes: '',
	task_type: 'Search Request',
})

// methods
async function saveTask() {
	loading.value = true
	// assign ref to new value -> it lose the reactive value when check the res.success
	const uploadAreaRef = uploadArea.value
	try {
		validate()
		let res
		if (editMode.value) {
			const promises = [
				updateTask({
					...data,
					name: task.value.name,
					reference_docname: data.lead,
				}),
				updateSearchRequest(searchRequestData.value.name),
			]
			res = await Promise.all(promises)
		} else {
			res = await createTask(data)
		}
		if (res.success) {
			const taskName = task.value?.name || res.data.name
			// If there are files to upload
			if (uploadAreaRef.files.length > 0) {
				await uploadAreaRef.uploadFilesWithDocname(taskName)
			}
			emits('close')
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
	if (!data.city) {
		error.value.city = __('City is required')
		hasError = true
	}
	if (!data.community) {
		error.value.community = __('Community is required')
		hasError = true
	}
	if (!data.property_purpose) {
		error.value.property_purpose = __('Property purpose is required')
		hasError = true
	}
	if (data.email_address) {
		if (!validateEmail(data.email_address)) {
			error.value.email_address = __('Email is invalid')
			hasError = true
		}
	}
	if (hasError) {
		throw new Error('Validation failed')
	}
}
function handlePayload() {
	return {
		city: data.city,
		community: data.community,
		sub_community: data.sub_community,
		property_type: data.property_type,
		furniture: data.furniture,
		beds: data.beds,
		baths: data.baths,
		property_purpose: data.property_purpose,
		min_price: data.min_price,
		max_price: data.max_price,
		lead: data.lead,
		notes: data.notes,
	}
}

async function updateSearchRequest(name) {
	loading.value = true
	try {
		const res = await call('frappe.client.set_value', {
			doctype: 'Unit Search Request',
			name,
			fieldname: handlePayload(),
		})
	} catch (error) {
		toast.error(error?.messages?.join('\n') || 'Something went wrong, try again')
	} finally {
		loading.value = false
	}
}

const searchRequest = createListResource({
	doctype: 'Unit Search Request',
	filters: { task: task.value.name },
	cache: ['unitSearchRequest', task.value.name],
	fields: [
		'city',
		'community',
		'sub_community',
		'property_type',
		'furniture',
		'beds',
		'baths',
		'property_purpose',
		'min_price',
		'max_price',
		'lead',
		'notes',
	],
	limit: 1,
	auto: true,
})
const searchRequestData = computed(() => searchRequest.data?.[0])
watch(
	() => searchRequestData.value,
	(value) => {
		if (value && editMode.value) {
			Object.assign(data, value)
		}
	},
)
</script>
