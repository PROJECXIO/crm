<template>
	<Dialog v-model="show" :options="{ size: '6xl' }">
		<template #body-title>
			<h3 class="text-2xl font-semibold text-subheading text-center">
				{{ __(`Generate & Download ${title} File`) }}
			</h3>
		</template>
		<template #body-content>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Left side - Editable Fields -->
				<div class="space-y-4 col-span-1 md:col-span-1 w-full">
					<div class="space-y-2">
						<label class="text-subheading text-lg font-medium">{{
							__('Select Print Format')
						}}</label>
						<Autocomplete
							:options="printFormats.data"
							variant="outline"
							size="xl"
							v-model="payload.selectedPrintFormat"
							:placeholder="__('...')"
						/>
					</div>
					<!-- unit verification fields print format -->
					<template
						v-if="
							['Unit Verification Form', 'Unit Details'].includes(
								payload.selectedPrintFormat?.value,
							)
						"
					>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('City')
							}}</label>
							<Link
								variant="outline"
								size="xl"
								doctype="CRM Territory"
								v-model="payload.city"
								:placeholder="__('City')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Community')
							}}</label>
							<Link
								variant="outline"
								size="xl"
								doctype="Community"
								v-model="payload.community"
								:placeholder="__('Community')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('No. of Bedrooms')
							}}</label>
							<TextInput
								:type="'number'"
								variant="outline"
								size="xl"
								v-model="payload.beds"
								:placeholder="__('Number of Bedrooms')"
								class="w-full"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('No. of Bathrooms')
							}}</label>
							<TextInput
								:type="'number'"
								variant="outline"
								size="xl"
								v-model="payload.baths"
								:placeholder="__('Number of Bathrooms')"
							/>
						</div>
					</template>
					<template
						v-if="payload.selectedPrintFormat?.value === 'Unit Verification Form'"
					>
					<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Listed Price')
							}}</label>
					<FormattedInput
						variant="outline"
						size="xl"
						type="text"
						class="flex-1"
						:value="getFormattedCurrency('total_price_amount', payload, 'CRM Unit')"
						:placeholder="__('Listed Price')"
						@change="(e) => payload.total_price_amount = flt(e.target.value)"
					/>
					</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Unit No.')
							}}</label>
							<TextInput
								variant="outline"
								size="xl"
								v-model="payload.unit_number"
								:placeholder="__('Unit No.')"
								class="w-full"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Property Type')
							}}</label>
							<Link
								variant="outline"
								size="xl"
								doctype="Property Type"
								v-model="payload.property_type"
								:placeholder="__('Property Type')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Title Deed No.')
							}}</label>
							<TextInput
								variant="outline"
								size="xl"
								v-model="payload.title_deed_no"
								:placeholder="__('Title Deed No.')"
								class="w-full"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Built Up Area')
							}}</label>
							<TextInput
								type="number"
								variant="outline"
								size="xl"
								v-model="payload.built_up_area"
								:placeholder="__('Built Up Area')"
								class="w-full"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Contract Start Date')
							}}</label>
							<DatePickerField
								variant="outline"
								size="xl"
								icon-left="calendar"
								:placeholder="__('dd/mm/yyyy')"
								input-class="border-none h-12 mt-0.5"
								@change="
									(val) =>
										(payload.contract_start_date =
											dayjs(val).format('YYYY-MM-DD'))
								"
								:value="payload.contract_start_date"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-subheading text-lg font-medium">{{
								__('Contract End Date')
							}}</label>
							<DatePickerField
								variant="outline"
								size="xl"
								icon-left="calendar"
								:placeholder="__('dd/mm/yyyy')"
								input-class="border-none h-12 mt-0.5"
								@change="
									(val) =>
										(payload.contract_end_date =
											dayjs(val).format('YYYY-MM-DD'))
								"
								:value="payload.contract_end_date"
							/>
						</div>
					</template>
					<div class="!mt-8">
						<Button
							theme="green"
							variant="solid"
							size="lg"
							:loading="saving"
							:disabled="!payload.selectedPrintFormat"
							@click="() => handleSubmit()"
						>
							<template #prefix>
								<FeatherIcon name="save" class="w-4 h-4" />
							</template>
							{{ __('Save & Generate Preview') }}
						</Button>
					</div>
				</div>

				<!-- Right side - File Preview -->
				<div
					:class="[
						'flex flex-col col-span-1 md:col-span-2 !h-[25rem] w-full mt-8 md:mt-0',
						payload.selectedPrintFormat?.value !== 'Unit Verification Form'
							? 'md:!h-[40rem]'
							: 'md:!h-[55rem]',
					]"
				>
					<div class="flex-1 bg-gray-50 rounded-lg p-4">
						<div v-if="loading" class="flex items-center justify-center h-full">
							<FeatherIcon
								name="loader"
								class="h-15 w-15 animate-spin text-text-green"
							/>
						</div>
						<div
							v-else-if="error"
							class="flex items-center justify-center h-full text-red-500"
						>
							{{ error }}
						</div>
						<div v-else-if="previewUrl" class="h-full">
							<iframe
								:src="previewUrl"
								class="w-full h-full rounded-lg"
								frameborder="0"
							></iframe>
						</div>
					</div>
					<div class="flex items-center justify-end mt-4">
						<Button
							:label="__('Download')"
							theme="green"
							variant="solid"
							size="lg"
							icon-left="download"
							@click="downloadFile()"
							:disabled="!previewUrl"
							:class="[!previewUrl && 'hidden']"
						/>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { flt } from '@/utils/numberFormat.js'
import { getMeta } from '@/stores/meta'

import Button from '@/components/frappe-ui/Button.vue'
import Link from '@/components/Controls/Link.vue'
import TextInput from '@/components/frappe-ui/TextInput.vue'
import { call, createListResource, createResource, dayjs, toast } from 'frappe-ui'
import { autoDownloadFile } from '@/utils'
import { useDocument } from '@/data/document'
import DatePickerField from '@/components/frappe-ui/DateField/DatePickerField.vue'

// props
const props = defineProps({
	doctype: {
		type: String,
		default: 'CRM Unit',
	},
	unit: {
		type: Object,
		required: true,
	},
})

const show = defineModel()

const { document: settings } = useDocument('Real Estate Settings', 'Real Estate Settings')
const { getFormattedCurrency } = getMeta(props.doctype)

const title = computed(() =>
	props.doctype?.startsWith('CRM') ? props.doctype.split('CRM ')[1] : props.doctype,
)
const loading = ref(true)
const downloading = ref(false)
const saving = ref(false)
const error = ref('')
const previewUrl = ref('')

const payload = reactive({
	selectedPrintFormat: '',
	letterHead: '',
	doctype: props.doctype,
	docname: props.unit.name,
	// other filed data for both print formats
	unit_number: props.unit?.unit_number || '',
	city: props.unit?.city || '',
	community: props.unit?.community || '',
	beds: props.unit?.beds || '',
	baths: props.unit?.baths || '',
	total_price_amount: props.unit?.total_price_amount || '',
	// unit proposal print format fields
	title_deed_no: props.unit?.title_deed_no || '',
	built_up_area: props.unit?.built_up_area || '',
	property_type: props.unit?.property_type || '',
	contract_start_date: props.unit?.contract_start_date || '',
	contract_end_date: props.unit?.contract_end_date || '',
})

// get doctype's print formats
const printFormats = createListResource({
	doctype: 'Print Format',
	filters: {
		doc_type: props.doctype,
	},
	auto: true,
	cache: ['print-formats', props.doctype],
	transform: (data) => {
		let options = data.map((item) => ({ label: item.name, value: item.name }))
		return options
	},
})

// get preview files
async function getPreviewFile() {
	loading.value = true
	if (!payload.selectedPrintFormat?.value) return

	try {
		const response = await fetch(
			`/api/method/frappe.utils.print_format.download_pdf?doctype=${props.doctype}&name=${props.unit.name}&format=${payload.selectedPrintFormat?.value}&letterhead=${settings?.doc?.letter_head}`,
			{
				method: 'GET',
				headers: {
					Accept: 'application/pdf',
				},
				credentials: 'include',
			},
		)
		const pdfBlob = await response.blob()
		previewUrl.value = URL.createObjectURL(pdfBlob)
	} catch (error) {
		toast.error(__('Failed to get file'))
	} finally {
		loading.value = false
	}
}
// handle submit click
function handleSubmit() {
	const data = handlePayload()
	// update unit fields
	updateUnit.submit({
		doctype: props.doctype,
		name: props.unit.name,
		fieldname: { ...data },
	})
}
const updateUnit = createResource({
	url: 'frappe.client.set_value',
	onSuccess(doc) {
		// generate new preview for pdf file
		// no download yet
		getPreviewFile()
	},
	onError(err) {
		toast.error(err.messages.join('\n') || __('Error while updating unit'))
	},
})

function handlePayload() {
	return payload.selectedPrintFormat === 'Unit Details'
		? {
				city: payload.city,
				community: payload.community,
				beds: payload.beds,
				baths: payload.baths,
			}
		: {
				city: payload.city,
				community: payload.community,
				beds: payload.beds,
				baths: payload.baths,
				total_price_amount: payload.total_price_amount,
				title_deed_no: payload.title_deed_no,
				built_up_area: payload.built_up_area,
				property_type: payload.property_type?.value || payload.property_type,
				contract_start_date: payload.contract_start_date,
				contract_end_date: payload.contract_end_date,
				unit_number: payload.unit_number,
			}
}
async function downloadFile() {
	if (!previewUrl.value) {
		toast.error(__('No file available to download'))
		return
	}

	downloading.value = true
	try {
		// Get file name from URL
		const fileName = previewUrl.value.split('/').pop()
		autoDownloadFile(fileName, previewUrl.value)
	} catch (error) {
		toast.error(__('Error while downloading file'))
	} finally {
		downloading.value = false
	}
}

// watcher
watch(
	() => payload.selectedPrintFormat,
	(newVal) => {
		if (newVal) {
			getPreviewFile()
		}
	},
)
watch(
	() => payload.letterHead,
	(newVal) => {
		if (newVal) {
			getPreviewFile()
		}
	},
)
</script>
