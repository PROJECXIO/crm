<template>
	<Dialog v-model="show" :options="{ size: '3xl' }" :disable-outside-click-to-close="true">
		<template #body-title>
			{{ null }}
		</template>
		<template #body-content>
			<div>
				<div class="w-full space-y-4">
					<div class="space-y-4">
						<h3 class="text-subheading font-semibold text-2xl">
							{{ __('Unit Details') }}
						</h3>
						<div
							:class="['grid  gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']"
						>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium"
									>{{ __('Unit Title') }}
									<span class="text-red-500">*</span>
								</label>
								<TextInput
									variant="outline"
									size="xl"
									type="text"
									v-model="unitData.title"
									:placeholder="__('Enter unit title')"
									:class="[error.title && 'border border-red-500 rounded-md']"
								/>
								<ErrorMessage v-if="error.title" :message="error.title" />
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium"
									>{{ __('Listing Type') }}
									<span class="text-red-500">*</span>
								</label>
								<Autocomplete
									variant="outline"
									size="xl"
									:class="[
										error.property_purpose &&
											'border !border-red-500 rounded-md',
									]"
									v-model="unitData.property_purpose"
									:placeholder="__('Enter listing type')"
									:options="[
										{ label: 'Sale', value: 'Sale' },
										{ label: 'Rent', value: 'Rent' },
									]"
								/>
								<ErrorMessage
									v-if="error.property_purpose"
									:message="error.property_purpose"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Total Price')
								}}</label>

								<TextInput
									type="number"
									variant="outline"
									size="xl"
									v-model="unitData.total_price_amount"
									:placeholder="__('Enter total price')"
								/>
							</div>
							<div class="col-span-1 space-y-1.5">
								<label class="text-subheading text-lg font-medium">{{
									__(' Unit Type ')
								}}</label>
								<Link
									doctype="Property Type"
									variant="outline"
									size="xl"
									v-model="unitData.property_type"
									:placeholder="__('Enter unit type')"
									:onCreate="
										(value, close) => {
											createDocument(
												'Property Type',
												unitData,
												close,
												handleCreateCallback('property_type'),
											)
										}
									"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Unit Number')
								}}</label>
								<TextInput
									variant="outline"
									size="xl"
									type="text"
									v-model="unitData.unit_number"
									:placeholder="__('Enter unit number')"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Number of Bedrooms')
								}}</label>

								<TextInput
									type="number"
									variant="outline"
									size="xl"
									v-model="unitData.beds"
									:placeholder="__('Enter number of bedrooms')"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Number of Bathrooms')
								}}</label>

								<TextInput
									type="number"
									variant="outline"
									size="xl"
									v-model="unitData.baths"
									:placeholder="__('Enter number of bathrooms')"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Built up Area')
								}}</label>

								<TextInput
									type="number"
									variant="outline"
									size="xl"
									v-model="unitData.built_up_area"
									:placeholder="__('Enter built up area')"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Plot Size')
								}}</label>

								<TextInput
									type="number"
									variant="outline"
									size="xl"
									v-model="unitData.plot_size"
									:placeholder="__('Enter plot size')"
								/>
							</div>
							<div class="col-span-1 space-y-1.5">
								<label class="text-subheading text-lg font-medium"
									>{{ __('City') }}
									<span class="text-red-500">*</span>
								</label>
								<Link
									variant="outline"
									size="xl"
									doctype="CRM Territory"
									:class="[error.city && 'border !border-red-500 rounded-md']"
									v-model="unitData.city"
									@input="unitData.city = $event"
									:placeholder="__('Enter city')"
									:onCreate="
										(value, close) => {
											createDocument(
												'CRM Territory',
												unitData,
												close,
												handleCreateCallback('city'),
											)
										}
									"
								/>
								<ErrorMessage v-if="error.city" :message="error.city" />
							</div>
							<div class="col-span-1 space-y-1.5">
								<label class="text-subheading text-lg font-medium"
									>{{ __('Community') }}
									<span class="text-red-500">*</span>
								</label>
								<Link
									variant="outline"
									size="xl"
									doctype="Community"
									:class="[
										error.community && 'border border-red-500 rounded-md',
									]"
									v-model="unitData.community"
									@input="unitData.community = $event"
									:placeholder="__('Enter community')"
									:onCreate="
										(value, close) => {
											createDocument(
												'Community',
												unitData,
												close,
												handleCreateCallback('community'),
											)
										}
									"
								/>
								<ErrorMessage v-if="error.community" :message="error.community" />
							</div>
							<div class="col-span-1 space-y-1.5">
								<label class="text-subheading text-lg font-medium">{{
									__('Sub Community')
								}}</label>
								<Link
									variant="outline"
									size="xl"
									doctype="Sub Community"
									v-model="unitData.sub_community"
									@input="unitData.sub_community = $event"
									:placeholder="__('Enter sub community')"
									:onCreate="
										(value, close) => {
											createDocument(
												'Sub Community',
												unitData,
												close,
												handleCreateCallback('sub_community'),
											)
										}
									"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Building')
								}}</label>
								<Link
									variant="outline"
									size="xl"
									doctype="Building"
									v-model="unitData.building"
									@input="unitData.building = $event"
									:placeholder="__('Enter building')"
									:onCreate="
										(value, close) => {
											createDocument(
												'Building',
												unitData,
												close,
												handleCreateCallback('building'),
											)
										}
									"
								/>
							</div>
							<div class="col-span-1 space-y-2.5">
								<label class="text-subheading text-lg font-medium">{{
									__('Furnished Status ')
								}}</label>
								<Autocomplete
									variant="outline"
									size="xl"
									v-model="unitData.furniture"
									:placeholder="__('Enter furnished status')"
									:options="[
										{ label: 'Not Specified', value: 'Not Specified' },
										{ label: 'Unfurnished', value: 'Unfurnished' },
										{ label: 'Partly furnished', value: 'Partly Furnished' },
										{ label: 'Furnished', value: 'Furnished' },
									]"
								/>
							</div>
							<div
								:class="['space-y-2', isMobileView ? 'col-span-1' : 'col-span-2']"
							>
								<label class="text-subheading text-lg font-medium">{{
									__('Location ')
								}}</label>
								<GoogleMap
									:api-key="apiKey"
									style="width: 100%; height: 200px"
									:center="{ lat, lng }"
									:zoom="7"
									@click="updatePosition"
								>
									<Marker
										v-if="lat !== null && lng !== null"
										:options="{ position: { lat, lng }, draggable: true }"
										label="📍"
										title="Drag me!"
										@dragend="updatePosition"
									/>
								</GoogleMap>
							</div>
						</div>
					</div>
					<hr />
					<!-- Owner Details  -->
					<div class="space-y-4">
						<h3 class="text-subheading font-semibold text-2xl">
							{{ __('Owner Details ') }}
						</h3>
						<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Owner’s Full Name ')
								}}</label>
								<Link
									variant="outline"
									size="xl"
									doctype="Contact"
									v-model="unitData.owner_contact"
									:placeholder="__('Select owner')"
									:onCreate="
										(value, close) => {
											createDocument(
												'Contact',
												unitData,
												close,
												handleCreateCallback('owner_contact'),
											)
										}
									"
								/>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Owner ID')
								}}</label>
								<FileUploader
									:fileTypes="['image/*']"
									:validateFile="validateFile"
									@success="
										(file) => {
											unitData.id_file = file
										}
									"
								>
									<template #default="{ uploading, progress, openFileSelector }">
										<div
											class="flex items-center border rounded cursor-pointer px-2"
											@click="openFileSelector"
										>
											<FeatherIcon name="plus" class="h-8 text-[#464F60]" />
											<Button
												:loading="uploading"
												size="xl"
												variant="ghost"
												class="w-full text-sm font-medium text-gray-900 dark:text-white hover:!bg-transparent"
											>
												<template #suffix>
													{{ unitData.id_file?.file_name }}
												</template>
											</Button>
										</div>
									</template>
								</FileUploader>
							</div>
							<div class="col-span-1 space-y-2">
								<label class="text-subheading text-lg font-medium">{{
									__('Title Deed')
								}}</label>
								<FileUploader
									:fileTypes="['image/*']"
									:validateFile="validateFile"
									@success="
										(file) => {
											unitData.title_deed = file
										}
									"
								>
									<template #default="{ uploading, progress, openFileSelector }">
										<div
											class="flex items-center border rounded cursor-pointer px-2"
											@click="openFileSelector"
										>
											<FeatherIcon name="plus" class="h-8 text-[#464F60]" />
											<Button
												:loading="uploading"
												size="xl"
												variant="ghost"
												class="w-full text-sm font-medium text-gray-900 dark:text-white hover:!bg-transparent"
											>
												<template #suffix>
													{{ unitData.title_deed?.file_name }}
												</template>
											</Button>
										</div>
									</template>
								</FileUploader>
							</div>
							<div
								:class="[' space-y-2', isMobileView ? 'col-span-1' : 'col-span-2']"
							>
								<label class="text-subheading text-lg font-medium">{{
									__('Comments & Notes')
								}}</label>
								<Textarea
									variant="outline"
									size="xl"
									type="textarea"
									v-model="unitData.notes"
									:placeholder="__('Enter notes')"
								/>
							</div>
						</div>
					</div>
				</div>
				<!-- <div v-if="error" class="bg-red-300 my-2 text-center py-2">
					<ErrorMessage :message="error" />
				</div> -->
			</div>
		</template>
		<template #actions>
			<div class="px-4 pb-7 pt-4 sm:px-6">
				<div
					:class="[
						isMobileView ? 'col-span-1 flex-col' : 'col-span-2 flex-row',
						'flex items-center gap-2 mt-8 ',
					]"
				>
					<Add
						label="Add Unit"
						:loading="isUnitCreating"
						@click="createNewUnit"
						:disabled="isUnitCreating"
						:class="[isMobileView ? 'min-h-[44px] w-full' : '']"
					/>
					<Cancel
						label="Cancel"
						@click="emits('cancel')"
						:class="[isMobileView ? 'min-h-[44px] w-full' : '']"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import Add from '@/components/Modals/Actions/Add.vue'
import Cancel from '@/components/Modals/Actions/Cancel.vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import Button from '@/components/frappe-ui/Button.vue'
import TextInput from '@/components/frappe-ui/TextInput.vue'
import { createResource, call, FileUploader, Textarea, toast } from 'frappe-ui'
import { GoogleMap, Marker } from 'vue3-google-map'
import Link from '@/components/Controls/Link.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDocCountStore } from '@/stores/doc-count'
import { createDocument } from '@/composables/document'
import { isMobileView } from '@/composables/settings.js'

const { increment } = useDocCountStore()
// props
const props = defineProps({
	unit: {
		type: Object,
		default: {},
	},
	fromAnotherModal: {
		// when call this modal by createNew links field, don't redirect user to details page
		type: Boolean,
		default: false,
	},
})
// emits
const emits = defineEmits(['cancel', 'after'])
const show = defineModel()
const showModal = defineModel('showModal')
// router
const router = useRouter()
// refs
const apiKey = ref('')
const lat = ref(23.4241)
const lng = ref(53.8478)
const isUnitCreating = ref(false)

const error = ref({
	title: '',
	property_purpose: '',
	city: '',
	community: '',
})
const unitData = reactive({
	title: '',
	property_purpose: '',
	total_price_amount: '',
	property_type: '',
	unit_number: '',
	beds: '',
	baths: '',
	built_up_area: '',
	plot_size: '',
	city: '',
	community: '',
	sub_community: '',
	building: '',
	furniture: '',
	geo_points: '',
	owner_contact: '',
	id_file: '',
	title_deed: '',
	notes: '',
})

// Google Map
async function getAPIKey() {
	try {
		const r = await call('frappe.client.get_value', {
			doctype: 'Google Settings',
			fieldname: 'api_key',
			cache: 'google_api_key',
		})
		apiKey.value = r.api_key
	} catch (error) {
		toast.error(__('Can not get location, Allow to access your location'))
		console.error('Failed to get api key:', error)
	}
}
const updatePosition = (event) => {
	if (event.latLng) {
		lat.value = event.latLng.lat()
		lng.value = event.latLng.lng()
		unitData.geo_points = `${lng.value}, ${lat.value}`
	}
}

onMounted(() => {
	if (!apiKey.value) getAPIKey()
})
const createUnit = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'CRM Unit',
				...values,
				furniture: values.furniture.value,
				property_purpose: values.property_purpose?.value,
			},
		}
	},
})

function createNewUnit() {
	createUnit.submit(unitData, {
		validate() {
			error.value = {}
			if (!unitData.title.trim()) {
				error.value.title = __('Title is mandatory')
				throw new Error('Title is mandatory')
			}
			if (!unitData.property_purpose?.value) {
				error.value.property_purpose = __('Listing type is mandatory')
				throw new Error('Listing type is mandatory')
			}
			if (!unitData.city) {
				error.value.city = __('City is mandatory')
				throw new Error('City is mandatory')
			}
			if (!unitData.community) {
				error.value.community = __('Community is mandatory')
				throw new Error('Community is mandatory')
			}
			isUnitCreating.value = true
		},
		onSuccess(data) {
			isUnitCreating.value = false
			emits('cancel')
			increment('unit')
			!props.fromAnotherModal && router.push({ name: 'Unit', params: { docId: data.name } })
			toast.success(__('Unit created successfully'))
			emits('after', data.name) // when called from lead modal
		},
		onError(err) {
			isUnitCreating.value = false
			toast.error(__(err?.messages?.[0] || 'Error creating unit'))
		},
	})
}

async function handleOwnerID(contactName) {
	if (!IDFile.value || !contactName) {
		return
	}
	try {
		await call('frappe.client.set_value', {
			doctype: 'File',
			name: IDFile.value.name,
			fieldname: {
				attached_to_name: contactName,
				attached_to_doctype: 'Contact',
				file_name: IDFile.value.file_name,
			},
		})
		await call('frappe.client.set_value', {
			doctype: 'Contact',
			name: contactName,
			fieldname: {
				custom_owner_id: IDFile.value.file_url,
			},
		})
	} catch (error) {
		console.error('Error attaching file:', error)
	}
}

function handleCreateCallback(field) {
	return function (doc) {
		if (doc && doc.name) {
			unitData[field] = doc.name
		}
		showModal.value = true // Ensure the modal is visible
	}
}
</script>
