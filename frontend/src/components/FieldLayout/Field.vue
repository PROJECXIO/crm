<template>
	<div
		v-if="field.visible"
		:class="[
			fieldForDoctype && 'flex items-center gap-4',
			'field',

			[
				'Table',
				'Text',
				'Long Text',
				'Text Editor',
				'Attach',
				'Attach Image',
				'Geolocation',
			].includes(field.fieldtype) && 'flex-col !items-start justify-start',
		]"
	>
		<!-- v-if="field.fieldtype != 'Check'" -->
		<div
			:class="[
				fieldForDoctype && 'md:text-xl w-1/3',
				'mb-2 text-base md:text-lg text-[#666666] font-semibold md:font-bold',
				[
					'Table',
					'Text',
					'Long Text',
					'Text Editor',
					'Attach',
					'Attach Image',
					'Geolocation',
				].includes(field.fieldtype) && 'w-full',
			]"
		>
			<div
				v-if="['Attach', 'Attach Image'].includes(field.fieldtype)"
				class="flex items-center justify-between"
			>
				<div>
					{{ __(field.label) }}
				</div>
				<div class="flex items-center gap-3">
					<!-- upload btn -->
					<FileUploader
						:file-types="getFileTypes(field.fieldtype)"
						:upload-args="{
							doctype: isNewDocModal ? '' : doctype,
							docname: data?.name || '', // isNewDocModal already handled
						}"
						@success="
							(f) => {
								fieldChange(f.file_url, field)
							}
						"
						@failure="() => toast.error('Error uploading file')"					
					>
						<template #default="{ openFileSelector }">
							<Button
								size="md"
								class="px-3 text-base !font-bold"
								theme="green"
								variant="solid"
								:label="__('Upload')"
								@click="openFileSelector()"
								:disabled="Boolean(field.read_only)"
							/>
						</template>
					</FileUploader>
					<!-- download btn -->
					<Button
						v-if="data[field.fieldname]"
						size="md"
						variant="subtle"
						theme="blue"
						icon="download"
						@click="downloadFile(data[field.fieldname])"
						class="!p-1"
					/>
					<!-- remove btn -->
					<Button
						:disabled="!data[field.fieldname] || Boolean(field.read_only)"
						theme="green"
						size="md"
						variant="subtle"
						:icon="TrashIcon"
						@click="
							() => {
								data[field.fieldname] = ''
							}
						"
					/>
				</div>
			</div>
			<div v-else>
				{{ __(field.label) }}
				<span
					v-if="
						field.reqd ||
						(field.mandatory_depends_on && field.mandatory_via_depends_on)
					"
					class="text-ink-red-2"
					>*</span
				>
			</div>
		</div>
		<!-- <FormControl
			v-if="
				field.read_only &&
				!['Int', 'Float', 'Currency', 'Percent', 'Check'].includes(field.fieldtype)
			"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			:placeholder="getPlaceholder(field)"
			v-model="data[field.fieldname]"
			:disabled="true"
			:description="field.description"
			class="flex-1"
		/> -->
		<div v-if="field.fieldtype === 'Table'" class="flex flex-1 w-full flex-col gap-3">
			<Switch
				v-if="getImages(field.fieldname).length > 0"
				v-model="isTablePreview"
				size="md"
				:label="isTablePreview ? 'Table' : 'Carousel'"
				:disabled="getImages(field.fieldname).length === 0"
			/>
			<Grid
				v-if="isTablePreview"
				v-model="data[field.fieldname]"
				v-model:parent="data"
				:doctype="field.options"
				:parentDoctype="doctype"
				:parentFieldname="field.fieldname"
				:tableReadOnly="Boolean(field.read_only)"
			/>
			<div
				v-if="getImages(field.fieldname).length > 0 && !isTablePreview"
				class="rounded-sm overflow-hidden"
			>
				<Carousel
					:images="getImages(field.fieldname)"
					:config="{
						height: 254,
						itemsToShow: 2.5,
						gap: 20,
						autoplay: 4000,
						wrapAround: true,
						pauseAutoplayOnHover: true,
					}"
				/>
			</div>
		</div>
		<FormControl
			v-else-if="field.fieldtype === 'Select'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="select"
			class="form-control !flex-1"
			:class="field.prefix ? 'prefix' : ''"
			:options="field.options"
			v-model="data[field.fieldname]"
			:placeholder="getPlaceholder(field)"
			:description="field.description"
			:disabled="Boolean(field.read_only)"
		>
			<template v-if="field.prefix" #prefix>
				<IndicatorIcon :class="field.prefix" />
			</template>
		</FormControl>
		<div v-else-if="field.fieldtype == 'Check'" class="flex items-center gap-2 flex-1">
			<CustomSwitch
				class="flex-1 justify-end"
				:current-value="!!data[field.fieldname]"
				@change="(v) => fieldChange(v, field)"
			/>
		</div>
		<div
			class="flex flex-1 gap-1"
			v-else-if="['Link', 'Dynamic Link'].includes(field.fieldtype)"
		>
			<Link
				variant="outline"
				:size="fieldForDoctype ? (isMobileView ? 'sm' : 'xl') : size"
				class="form-control rounded-md flex-1 truncate"
				:value="data[field.fieldname]"
				:doctype="field.fieldtype == 'Link' ? field.options : data[field.options]"
				:filters="field.filters"
				@change="(v) => fieldChange(v, field)"
				:placeholder="getPlaceholder(field)"
				:onCreate="field.create"
			/>
			<Button
				v-if="data[field.fieldname] && field.edit"
				class="shrink-0"
				:label="__('Edit')"
				@click="field.edit(data[field.fieldname])"
			>
				<template #prefix>
					<EditIcon class="h-4 w-4" />
				</template>
			</Button>
		</div>

		<TableMultiselectInput
			v-else-if="field.fieldtype === 'Table MultiSelect'"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			class="flex-1"
			v-model="data[field.fieldname]"
			:doctype="field.options"
			@change="(v) => fieldChange(v, field)"
			:onCreate="field.create"
		/>

		<Link
			v-else-if="field.fieldtype === 'User'"
			variant="ghost"
			class="form-control border rounded-md flex-1"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			:value="data[field.fieldname] && getUser(data[field.fieldname]).full_name"
			:doctype="field.options"
			:filters="field.filters"
			@change="(v) => fieldChange(v, field)"
			:placeholder="getPlaceholder(field)"
			:hideMe="true"
		>
			<template #prefix>
				<UserAvatar
					v-if="data[field.fieldname]"
					class="mr-2"
					:user="data[field.fieldname]"
					size="sm"
				/>
			</template>
			<template #item-prefix="{ option }">
				<UserAvatar class="mr-2" :user="option.value" size="sm" />
			</template>
			<template #item-label="{ option }">
				<Tooltip :text="option.value">
					<div class="cursor-pointer">
						{{ getUser(option.value).full_name }}
					</div>
				</Tooltip>
			</template>
		</Link>
		<div v-else-if="field.fieldtype === 'Datetime'" class="flex-1">
			<DateTimePicker
				variant="outline"
				:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
				:value="data[field.fieldname]"
				icon-left="clock"
				:formatter="(date) => getFormat(date, '', true, true)"
				:placeholder="getPlaceholder(field)"
				input-class="border-none "
				@change="(v) => fieldChange(v, field)"
			/>
		</div>
		<div v-else-if="field.fieldtype === 'Date'" class="flex-1">
			<DatePicker
				variant="outline"
				:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
				icon-left="calendar"
				:placeholder="getPlaceholder(field)"
				input-class="border-none"
				@change="(val) => (data[field.fieldname] = dayjs(val).format('YYYY-MM-DD'))"
				:value="data[field.fieldname]"
				:disabled="Boolean(field.read_only)"
			/>
			<!-- :value="data[field.fieldname]" -->
			<!-- @change="(v) => fieldChange(v, field)" -->
		</div>
		<FormControl
			v-else-if="['Small Text', 'Text', 'Long Text', 'Code'].includes(field.fieldtype)"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="textarea"
			class="!flex-1 w-full"
			:value="data[field.fieldname]"
			:placeholder="getPlaceholder(field)"
			:description="field.description"
			@change="fieldChange($event.target.value, field)"
		/>
		<FormControl
			v-else-if="field.fieldtype === 'Int'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="number"
			class="flex-1"
			:placeholder="getPlaceholder(field)"
			@change="(e) => (data[field.fieldname] = e.target.value)"
			:value="data[field.fieldname]"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
		/>
		<!-- @change="fieldChange($event.target.value, field)" -->
		<FormattedInput
			v-else-if="field.fieldtype === 'Percent'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:value="getFormattedPercent(field.fieldname, data)"
			:placeholder="getPlaceholder(field)"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
			@change="fieldChange(flt($event.target.value), field)"
		/>
		<FormattedInput
			v-else-if="field.fieldtype === 'Float'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:value="getFormattedFloat(field.fieldname, data)"
			:placeholder="getPlaceholder(field)"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
			@change="fieldChange(flt($event.target.value), field)"
		/>
		<FormattedInput
			v-else-if="field.fieldtype === 'Currency'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:value="getFormattedCurrency(field.fieldname, data, parentDoc)"
			:placeholder="getPlaceholder(field)"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
			@change="(e) => (data[field.fieldname] = flt(e.target.value))"
		/>
		<!-- TODO:: handle attach to name when use this field in createDocument Modal it work fine in data tabs in all details pages -->
		<div
			v-else-if="['Attach', 'Attach Image'].includes(field.fieldtype)"
			class="flex items-center gap-2 flex-1 w-full min-h-44"
		>
			<div
				v-if="data[field.fieldname]"
				class="flex flex-1 flex-col items-center gap-1 h-full"
			>
				<template v-if="field.fieldtype === 'Attach Image'">
					<img
						v-if="data[field.fieldname]"
						:src="data[field.fieldname]"
						:alt="data[field.fieldname]"
						class="h-[178px] w-full object-cover"
					/>
				</template>
				<div v-if="field.fieldtype === 'Attach'" class="h-[178px] w-full">
					<img
						v-if="isImageUrl(data[field.fieldname])"
						:src="data[field.fieldname]"
						:alt="data[field.fieldname]"
						class="h-full w-full object-contain"
					/>
					<iframe
						v-else-if="isPdfUrl(data[field.fieldname])"
						:src="data[field.fieldname]"
						className="w-full h-full border rounded "
						title="PDF Preview"
					/>
					<div v-else class="flex items-center gap-5 flex-col h-full">
						<FileIcon
							:class="[
								'size-full',
								data[field.fieldname] ? 'text-[#666]' : 'text-[#ccc]',
							]"
						/>
						<a
							:href="data[field.fieldname]"
							target="_blank"
							rel="noopener"
							class="underline truncate max-w-60 text-ink-gray-8"
						>
							{{ data[field.fieldname].split('/').pop() }}
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- add v-model attr-> the value and @change not working for onCreate props for links fields -->
		<FormControl
			v-else-if="field.fieldtype === 'Data' && ['Email', 'Phone'].includes(field.options)"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:placeholder="getPlaceholder(field)"
			:value="data?.[field.fieldname]"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
			@change="fieldChange($event.target.value, field)"
			v-model="data[field.fieldname]"
		>
			<template #prefix>
				<FeatherIcon class="w-4" :name="field.options === 'Email' ? 'mail' : 'phone'" />
			</template>
		</FormControl>
		<div
			v-else-if="field.fieldtype === 'Geolocation'"
			class="flex-1 w-full rounded-md overflow-hidden"
		>
			<!-- <GoogleMap
				v-if="googleSettings.doc?.api_key && mapApiPromise"
				:api-key="googleSettings.doc.api_key"
				:api-promise="mapApiPromise"
				mapId="YOUR_VECTOR_MAP_ID"
				style="width: 100%; height: 178px"
				:center="center"
				:zoom="8"
				@click="(e) => updatePosition(e)"
			>
				<AdvancedMarker
					v-if="center.lat && center.lng"
					:options="{ position: center, gmpDraggable: true }"
					@dragend="(e) => updatePosition(e)"
				/>
			</GoogleMap> -->
			<!-- <div v-else class="flex items-center justify-center h-full">
				<p class="text-red-500 text-lg font-semibold">
					{{ __('Please configure Google Maps API key to use this feature.') }}
				</p>
			</div> -->
		</div>
		<div v-else-if="field.fieldtype === 'Text Editor'" class="flex-1 w-full overflow-hidden">
			<TextEditor
				:editor-class="[
					'min-h-[8rem] border rounded-b-lg border-t-0 p-2 w-full flex-1',
					isMobileView ? 'prose-md' : 'prose-lg',
				]"
				:content="data[field.fieldname]"
				:placeholder="getPlaceholder(field)"
				@change="(val) => (data[field.fieldname] = val)"
				:bubbleMenu="true"
				:fixed-menu="true"
			/>
		</div>
		<FormControl
			v-else-if="field.fieldtype === 'Read Only'"
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:placeholder="getPlaceholder(field)"
			:value="data?.[field.fieldname]"
			:disabled="true"
			:description="field.description"
		/>
		<FormControl
			v-else
			variant="outline"
			:size="fieldForDoctype ? (isMobileView ? 'md' : 'xl') : size"
			type="text"
			class="flex-1"
			:placeholder="getPlaceholder(field)"
			:value="data?.[field.fieldname]"
			:disabled="Boolean(field.read_only)"
			:description="field.description"
			@change="(e) => (data[field.fieldname] = e.target.value)"
		/>
	</div>
</template>
<script setup>
// import { GoogleMap, Marker, AdvancedMarker } from 'vue3-google-map'
// import { Loader } from '@googlemaps/js-api-loader'
import FormattedInput from '@/components/Controls/FormattedInput.vue'
import FormControl from '@/components/frappe-ui/FormControl.vue'
import EditIcon from '@/components/Icons/EditIcon.vue'
import IndicatorIcon from '@/components/Icons/IndicatorIcon.vue'
import Switch from '@/components/frappe-ui/Switch.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import TableMultiselectInput from '@/components/Controls/TableMultiselectInput.vue'
import Link from '@/components/Controls/Link.vue'
import Grid from '@/components/Controls/Grid.vue'
import { createDocument } from '@/composables/document'
import {
	getFormat,
	evaluateDependsOnValue,
	extractCoordinates,
	// initializeGoogleMaps,
} from '@/utils'
import { flt } from '@/utils/numberFormat.js'
import { getMeta } from '@/stores/meta'
import { usersStore } from '@/stores/users'
import { useDocument } from '@/data/document'
import {
	DatePicker,
	DateTimePicker,
	FileUploader,
	call,
	dayjs,
	toast,
	TextEditor,
} from 'frappe-ui'
import Tooltip from '@/components/frappe-ui/Tooltip.vue'
import { computed, provide, inject, ref, onMounted, watch } from 'vue'
import { isMobileView } from '@/composables/settings'
import Carousel from '@/components/Carousel.vue'
import CustomSwitch from '@/components/Controls/CustomSwitch.vue'
import FileIcon from '@/components/Icons/FileIcon.vue'
import TrashIcon from '@/components/Icons/TrashIcon.vue'

const props = defineProps({
	field: Object,
	size: {
		type: String,
		default: 'lg',
	},
})

const data = inject('data')
const doctype = inject('doctype')
const preview = inject('preview')
const isGridRow = inject('isGridRow')
// to change displaying label of field to be aligned with input
const fieldForDoctype = inject('fieldForDoctype', false)

const { getFormattedPercent, getFormattedFloat, getFormattedCurrency } = getMeta(doctype)

const { getUser } = usersStore()
const { document: googleSettings } = useDocument('Google Settings', 'Google Settings')
const isNewDocModal = inject('isNewDocModal', false)

// file upload helpers
function getFileTypes(fieldtype) {
	if (fieldtype === 'Attach Image') return 'image/*'
	return [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'text/plain',
		'.pdf',
		'.doc',
		'.docx',
		'.xls',
		'.xlsx',
		'.txt',
	]
}

function isImageUrl(url) {
	return /\.(png|jpe?g|gif|webp|svg)$/i.test(url || '')
}

function isPdfUrl(url) {
	return /\.pdf$/i.test(url || '')
}

let triggerOnChange
let parentDoc

if (!isGridRow) {
	const {
		triggerOnChange: trigger,
		triggerOnRowAdd,
		triggerOnRowRemove,
	} = useDocument(doctype, data.value?.name)
	triggerOnChange = trigger

	provide('triggerOnChange', triggerOnChange)
	provide('triggerOnRowAdd', triggerOnRowAdd)
	provide('triggerOnRowRemove', triggerOnRowRemove)
} else {
	triggerOnChange = inject('triggerOnChange')
	parentDoc = inject('parentDoc')
}

const field = computed(() => {
	let field = props.field
	if (field.fieldtype == 'Select' && typeof field.options === 'string') {
		field.options = field.options.split('\n').map((option) => {
			return { label: option, value: option }
		})

		if (field.options[0].value !== '') {
			field.options.unshift({ label: '', value: '' })
		}
	}

	if (field.fieldtype === 'Link' && field.options === 'User') {
		field.fieldtype = 'User'
	}

	if (['Link', 'Table MultiSelect'].includes(field.fieldtype) && field.options !== 'User') {
		if (!field.create) {
			let targetDoctype = field.options
			// for table multiselect field get the link field from the target doctype of multiselect
			// then get the options of the link field
			if (field.fieldtype === 'Table MultiSelect') {
				const { getFields } = getMeta(field.options)
				let linkField = getFields()?.filter((f) => f.fieldtype === 'Link')
				if (linkField?.length > 0) {
					targetDoctype = linkField[0].options
				}
			}
			field.create = (value, close) => {
				const callback = (d) => {
					if (d) fieldChange(d.name, field)
				}
				createDocument(targetDoctype, value, close, callback)
			}
		}
	}

	let _field = {
		...field,
		filters: field.link_filters && JSON.parse(field.link_filters),
		placeholder: field.placeholder || field.label,
		display_via_depends_on: evaluateDependsOnValue(field.depends_on, data.value),
		mandatory_via_depends_on: evaluateDependsOnValue(field.mandatory_depends_on, data.value),
	}

	_field.visible = isFieldVisible(_field)
	return _field
})
const geoLocationField = computed(() => {
	if (field.value.fieldtype === 'Geolocation') return field
})

function isFieldVisible(field) {
	// handle crm deal case to show readonly fields also for preview
	if (
		preview.value ||
		(doctype === 'CRM Deal' && !field.display_via_depends_on && !field.depends_on)
	)
		return true
	return (
		(field.fieldtype == 'Check' ||
			(field.read_only && data.value[field.fieldname]) ||
			!field.read_only) &&
		(!field.depends_on || field.display_via_depends_on) &&
		!field.hidden
	)
}

const getPlaceholder = (field) => {
	if (field.placeholder) {
		return __(field.placeholder)
	}
	if (['Select', 'Link'].includes(field.fieldtype)) {
		return __('Select {0}', [__(field.label)])
	} else {
		return __('Enter {0}', [__(field.label)])
	}
}

function fieldChange(value, df) {
	if (isGridRow) {
		triggerOnChange(df.fieldname, value, data.value)
	} else {
		triggerOnChange(df.fieldname, value)
	}
}
function downloadFile(url) {
	const link = document.createElement('a')
	link.href = url
	link.download = url.split('/').pop()
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
// ### Carousel
const isTablePreview = ref(true)

function getImages(fieldname) {
	return (data.value[fieldname]?.map((row) => ({ url: row?.image })) || []).filter(
		(item) => item.url,
	)
}
// ### carousel
// ### google maps
const center = ref({ lat: 24.466667, lng: 54.366669 })
const mapApiPromise = ref(null)

// Initialize Google Maps API when component mounts
onMounted(async () => {
	// if (field.value.fieldtype === 'Geolocation') {
	// 	mapApiPromise.value = await initializeGoogleMaps()
	// 	// Update center with actual coordinates if available
	// 	const coords = handleCoordinates()
	// 	if (coords) {
	// 		center.value = coords
	// 	}
	// }
})

// Watch for changes in field data to update map center
watch(
	() => data?.value?.[field.value.fieldname],
	(newValue) => {
		if (newValue && field.value.fieldtype === 'Geolocation') {
			const coords = handleCoordinates()
			if (coords) {
				center.value = coords
			}
		}
	},
	{ deep: true },
)

function handleCoordinates() {
	if (!geoLocationField.value) return null
	const fieldValue = data?.value?.[geoLocationField.value.fieldname]
	if (!fieldValue) return null
	const { lat, lng } = extractCoordinates(fieldValue)
	return { lat, lng }
}

async function updatePosition(e) {
	const ll = e.detail?.latLng || e.latLng // wrapper vs native
	if (!ll) return
	const lat = typeof ll.lat === 'function' ? ll.lat() : ll.lat
	const lng = typeof ll.lng === 'function' ? ll.lng() : ll.lng

	try {
		const res = await call('revenyu.api.update_position', {
			doctype,
			docname: data.value.name,
			fieldname:
				geoLocationField.value.value?.fieldname || geoLocationField.value?.fieldname,
			lat,
			lng,
		})
		if (res.success) {
			toast.success('Position updated')
			center.value = { lat, lng }
		} else {
			toast.error(res?.message || 'Position not updated')
		}
	} catch (error) {
		toast.error(error.messages?.join('\n') || 'Position not updated')
	}
}
// ### google maps
</script>

<style scoped>
/* start text editor width */
:deep(.prose) {
	max-width: 100% !important;
}
/* end text editor  */
</style>
