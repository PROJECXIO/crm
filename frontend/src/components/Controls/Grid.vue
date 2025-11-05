<template>
	<div class="flex flex-col flex-1 text-base">
		<div v-if="label" class="mb-1.5 text-sm text-ink-gray-5">
			{{ __(label) }}
		</div>

		<div v-if="fields?.length" class="group relative">
			<!-- Header -->
			<div
				class="grid-header flex items-center bg-[#F1F2F4] text-[#666666] font-medium text-lg truncate py-2 h-9 text-center"
			>
				<div class="inline-flex items-center justify-center h-8 p-2 w-12">
					<Checkbox
						:disabled="tableReadOnly"
						class="cursor-pointer duration-300"
						:modelValue="allRowsSelected"
						@click.stop="toggleSelectAllRows($event.target.checked)"
					/>
				</div>
				<div class="inline-flex items-center justify-center py-2 px-1 w-12">
					<EllipseIcon />
				</div>
				<div class="inline-flex items-center justify-center py-2 px-1 w-12">
					{{ __('No') }}
				</div>
				<div
					class="grid w-full truncate"
					:style="{ gridTemplateColumns: gridTemplateColumns }"
				>
					<div
						v-for="field in fields"
						class="p-2 truncate"
						:key="field.fieldname"
						:title="field.label"
					>
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
				<div class="w-12">
					<Button
						class="flex w-full items-center justify-center rounded !bg-surface-gray-2 border-0"
						variant="outline"
						@click="showGridFieldsEditorModal = true"
					>
						<template #icon>
							<FeatherIcon name="settings" class="size-4 text-ink-gray-7" />
						</template>
					</Button>
				</div>
			</div>
			<!-- Rows -->
			<template v-if="rows?.length">
				<Draggable
					class="w-full"
					v-model="rows"
					:delay="isTouchScreenDevice() ? 200 : 0"
					group="rows"
					item-key="idx"
					@change="onSort"
				>
					<template #item="{ element: row, index }">
						<div
							class="grid-row flex cursor-pointer items-center border-b border-outline-gray-modals bg-surface-modals last:border-b h-11"
							@click.stop="
								() => {
									if (!gridSettings.editable_grid) {
										showRowList[index] = true
									}
								}
							"
						>
							<div
								class="grid-row-checkbox inline-flex h-9.5 items-center bg-surface-white justify-center border-r border-outline-gray-modals p-2 w-12"
							>
								<Checkbox
									:disabled="tableReadOnly"
									class="cursor-pointer duration-300"
									:modelValue="selectedRows.has(row.name)"
									@click.stop="toggleSelectRow(row)"
								/>
							</div>
							<div
								v-if="!tableReadOnly"
								class="flex h-9.5 items-center justify-center bg-surface-white border-r border-outline-gray-modals py-2 px-1 text-sm text-ink-gray-8 w-12"
							>
								<EllipseIcon />
							</div>
							<div
								class="flex h-9.5 items-center justify-center bg-surface-white border-r border-outline-gray-modals py-2 px-1 text-sm text-ink-gray-8 w-12"
							>
								{{ index + 1 }}
							</div>
							<div
								class="grid w-full h-9.5"
								:style="{ gridTemplateColumns: gridTemplateColumns }"
							>
								<div
									class="border-r border-outline-gray-modals h-full"
									v-for="field in fields"
									:key="field.fieldname"
								>
									<FormControl
										v-if="
											field.read_only &&
											![
												'Int',
												'Float',
												'Currency',
												'Percent',
												'Check',
											].includes(field.fieldtype)
										"
										size="lg"
										type="text"
										class="!text-center"
										:placeholder="field.placeholder"
										v-model="row[field.fieldname]"
										:disabled="true"
									/>
									<Link
										v-else-if="
											['Link', 'Dynamic Link'].includes(field.fieldtype)
										"
										size="lg"
										class="text-sm text-ink-gray-8"
										:doctype="
											field.fieldtype == 'Link'
												? field.options
												: row[field.options]
										"
										:filters="field.filters"
										:value="row[field.fieldname]"
										@change="(v) => fieldChange(v, field, row)"
										@update:modelValue="(v) => {}"
										:onCreate="
											(value, close) => field.create(v, field, row, close)
										"
										:disabled="tableReadOnly"
									/>
									<Link
										v-else-if="field.fieldtype === 'User'"
										size="lg"
										class="form-control"
										:value="getUser(row[field.fieldname]).full_name"
										:doctype="field.options"
										:filters="field.filters"
										@change="(v) => fieldChange(v, field, row)"
										:placeholder="field.placeholder"
										:hideMe="true"
										:disabled="tableReadOnly"
									>
										<template #prefix>
											<UserAvatar
												class="mr-2"
												:user="row[field.fieldname]"
												size="sm"
											/>
										</template>
										<template #item-prefix="{ option }">
											<UserAvatar
												class="mr-2"
												:user="option.value"
												size="sm"
											/>
										</template>
										<template #item-label="{ option }">
											<Tooltip :text="option.value">
												<div class="cursor-pointer">
													{{ getUser(option.value).full_name }}
												</div>
											</Tooltip>
										</template>
									</Link>
									<div
										v-else-if="field.fieldtype === 'Check'"
										class="flex h-full justify-center items-center"
									>
										<CustomSwitch
											:current-value="row[field.fieldname]"
											@change="(v) => (row[field.fieldname] = v)"
											class="cursor-pointer duration-300"
											:disabled="!gridSettings.editable_grid || tableReadOnly"
											:size="isMobileView ? 'sm' : 'md'"
										/>
										<!-- <Checkbox
											class="cursor-pointer duration-300"
											v-model="row[field.fieldname]"
											:disabled="!gridSettings.editable_grid"
											@change="
												(e) => fieldChange(e.target.checked, field, row)
											"
										/> -->
									</div>
									<DatePicker
										v-else-if="field.fieldtype === 'Date'"
										:value="row[field.fieldname]"
										icon-left=""
										variant="outline"
										:formatter="(date) => getFormat(date, '', true)"
										input-class="border-none text-sm text-ink-gray-8"
										@change="(v) => fieldChange(v, field, row)"
										:disabled="tableReadOnly"
									/>
									<DateTimePicker
										v-else-if="field.fieldtype === 'Datetime'"
										:value="row[field.fieldname]"
										icon-left=""
										variant="outline"
										:formatter="(date) => getFormat(date, '', true, true)"
										input-class="border-none text-sm text-ink-gray-8"
										@change="(v) => fieldChange(v, field, row)"
										:disabled="tableReadOnly"
									/>
									<FormControl
										v-else-if="
											['Small Text', 'Text', 'Long Text', 'Code'].includes(
												field.fieldtype,
											)
										"
										size="lg"
										rows="1"
										type="textarea"
										variant="outline"
										:value="row[field.fieldname]"
										@change="fieldChange($event.target.value, field, row)"
										:disabled="tableReadOnly"
									/>
									<FormControl
										v-else-if="field.fieldtype === 'Select'"
										size="lg"
										class="text-sm text-ink-gray-8"
										type="select"
										variant="outline"
										v-model="row[field.fieldname]"
										:options="field.options"
										@change="(e) => fieldChange(e.target.value, field, row)"
										:disabled="tableReadOnly"
									/>
									<Password
										v-else-if="field.fieldtype === 'Password'"
										variant="outline"
										:value="row[field.fieldname]"
										:disabled="Boolean(field.read_only) || tableReadOnly"
										@change="fieldChange($event.target.value, field, row)"
										
									/>
									<FormattedInput
										v-else-if="field.fieldtype === 'Int'"
										class="[&_input]:text-right"
										type="text"
										variant="outline"
										:value="row[field.fieldname] || '0'"
										:disabled="Boolean(field.read_only) || tableReadOnly"
										@change="fieldChange($event.target.value, field, row)"
									/>
									<FormattedInput
										v-else-if="field.fieldtype === 'Percent'"
										class="[&_input]:text-right"
										type="text"
										variant="outline"
										:value="getFloatWithPrecision(field.fieldname, row)"
										:formattedValue="(row[field.fieldname] || '0') + '%'"
										:disabled="Boolean(field.read_only) || tableReadOnly"
										@change="fieldChange(flt($event.target.value), field, row)"
									/>
									<FormattedInput
										v-else-if="field.fieldtype === 'Float'"
										class="[&_input]:text-right"
										type="text"
										variant="outline"
										:value="getFloatWithPrecision(field.fieldname, row)"
										:formattedValue="row[field.fieldname]"
										:disabled="Boolean(field.read_only) || tableReadOnly"
										@change="fieldChange(flt($event.target.value), field, row)"
									/>
									<FormattedInput
										v-else-if="field.fieldtype === 'Currency'"
										class="[&_input]:text-right"
										type="text"
										variant="outline"
										:value="getCurrencyWithPrecision(field.fieldname, row)"
										:formattedValue="
											getFormattedCurrency(field.fieldname, row, parentDoc)
										"
										:disabled="Boolean(field.read_only) || tableReadOnly"
										@change="fieldChange(flt($event.target.value), field, row)"
									/>
									<div v-else-if="field.fieldtype === 'Attach Image'" class="">
										<!-- 
										// pass doctype & docname as props for table usage only
											:docname="parentDoc.name"
										-->
										<FileUploader
											v-if="!row[field.fieldname] && !tableReadOnly"
											file-types="image/*"
											:upload-args="{
												doctype: parentDoctype,
												docname: parentDoc.name,
											}"
											:docname="parentDoc.name"
											:doctype="parentDoctype"
											:row-fieldname="field.fieldname"
											@upload-success="
												(data) => {
													handleMultipleFileUpload(data, field, row) // for multiple files
													// fieldChange(f.file_url, field, row) for only one file
												}
											"
										>
											<template #default="{ openFileSelector }">
												<Button
													size="lg"
													class="w-28"
													theme="green"
													variant="outline"
													@click="openFileSelector()"
												>
													<template #icon>
														<AttachmentIcon class="h-4 w-8" />
													</template>
													<template #suffix
														>{{ __('Upload') }}
													</template>
												</Button>
											</template>
										</FileUploader>

										<img
											v-else
											:src="row[field.fieldname]"
											:alt="row[field.fieldname]"
											class="w-16 h-9 object-contain"
										/>
									</div>
									<FormControl
										v-else
										class="text-sm text-ink-gray-8"
										type="text"
										variant="outline"
										v-model="row[field.fieldname]"
										:options="field.options"
										@change="fieldChange($event.target.value, field, row)"
										:disabled="tableReadOnly"
									/>
								</div>
							</div>
							<div class="edit-row w-12">
								<Button
									class="flex w-full items-center justify-center rounded border-0"
									variant="outline"
									@click="showRowList[index] = true"
									:disabled="tableReadOnly"
								>
									<template #icon>
										<EditIcon class="text-ink-gray-7" />
									</template>
								</Button>
							</div>
							<GridRowModal
								v-if="showRowList[index]"
								v-model="showRowList[index]"
								v-model:showGridRowFieldsModal="showGridRowFieldsModal"
								:index="index"
								:data="row"
								:doctype="doctype"
								:parentDoctype="parentDoctype"
							/>
						</div>
					</template>
				</Draggable>
			</template>

			<div v-else class="flex flex-col items-center rounded p-5 text-sm text-ink-gray-5">
				{{ __('No Data') }}
			</div>
		</div>

		<div v-if="fields?.length" class="mt-2 flex flex-row gap-2">
			<Button
				v-if="showDeleteBtn"
				:label="__('Delete')"
				variant="solid"
				theme="red"
				@click="deleteRows"
			/>
			<Button v-if="!tableReadOnly" variant="solid" theme="green" :label="__('Add Row')" @click="addRow" />
		</div>
		<GridRowFieldsModal
			v-if="showGridRowFieldsModal"
			v-model="showGridRowFieldsModal"
			:doctype="doctype"
			:parentDoctype="parentDoctype"
		/>
		<GridFieldsEditorModal
			v-if="showGridFieldsEditorModal"
			v-model="showGridFieldsEditorModal"
			:doctype="doctype"
			:parentDoctype="parentDoctype"
		/>
	</div>
</template>

<script setup>
import Password from '@/components/Controls/Password.vue'
import FormattedInput from '@/components/Controls/FormattedInput.vue'
import GridFieldsEditorModal from '@/components/Controls/GridFieldsEditorModal.vue'
import GridRowFieldsModal from '@/components/Controls/GridRowFieldsModal.vue'
import GridRowModal from '@/components/Controls/GridRowModal.vue'
import EditIcon from '@/components/Icons/EditIcon.vue'
import Link from '@/components/Controls/Link.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { getRandom, getFormat, isTouchScreenDevice } from '@/utils'
import { flt } from '@/utils/numberFormat.js'
import { usersStore } from '@/stores/users'
import { getMeta } from '@/stores/meta'
import { createDocument } from '@/composables/document'
import FormControl from '@/components/frappe-ui/FormControl.vue'
import FileUploader from '@/components/frappe-ui/FileUploader.vue'
import { FeatherIcon, DateTimePicker, DatePicker, Tooltip, dayjs } from 'frappe-ui'
import Draggable from 'vuedraggable'
import { ref, reactive, computed, inject, provide } from 'vue'
import EllipseIcon from '@/components/Icons/EllipseIcon.vue'
import CustomSwitch from '@/components/Controls/CustomSwitch.vue'
import Checkbox from '@/components/frappe-ui/Checkbox.vue'
import { isMobileView } from '@/composables/settings'

const props = defineProps({
	label: {
		type: String,
		default: '',
	},
	doctype: {
		type: String,
		required: true,
	},
	parentDoctype: {
		type: String,
		required: true,
	},
	parentFieldname: {
		type: String,
		required: true,
	},
	tableReadOnly: {
		type: Boolean,
		default: false
	}
})

const triggerOnChange = inject('triggerOnChange', null) // set default to null to allow for checking for table fields
const triggerOnRowAdd = inject('triggerOnRowAdd', () => {})
const triggerOnRowRemove = inject('triggerOnRowRemove', () => {})

const {
	getGridViewSettings,
	getFields,
	getFloatWithPrecision,
	getCurrencyWithPrecision,
	getFormattedCurrency,
	getGridSettings,
} = getMeta(props.doctype)
getMeta(props.parentDoctype)

const { users, getUser } = usersStore()

const rows = defineModel()
const parentDoc = defineModel('parent')

provide('parentDoc', parentDoc)

const showRowList = ref(new Array(rows.value?.length || []).fill(false))
const selectedRows = reactive(new Set())

const showGridFieldsEditorModal = ref(false)
const showGridRowFieldsModal = ref(false)

const gridSettings = computed(() => getGridSettings())

const fields = computed(() => {
	let gridViewSettings = getGridViewSettings(props.parentDoctype)
	let gridFields = getFields()
	if (gridViewSettings.length) {
		let d = gridViewSettings.map((gs) =>
			getFieldObj(gridFields.find((f) => f.fieldname === gs.fieldname)),
		)
		return d
	}
	return gridFields?.filter((f) => f.in_list_view).map((f) => getFieldObj(f)) || []
})

const allFields = computed(() => {
	return getFields()?.map((f) => getFieldObj(f)) || []
})

function getFieldObj(field) {
	if (field.fieldtype === 'Link' && field.options !== 'User') {
		if (!field.create) {
			field.create = (value, field, row, close) => {
				const callback = (d) => {
					if (d) fieldChange(d.name, field, row)
				}
				createDocument(field.options, value, close, callback)
			}
		}
	}

	if (field.fieldtype === 'Link' && field.options === 'User') {
		field.fieldtype = 'User'
		field.link_filters = JSON.stringify({
			...(field.link_filters ? JSON.parse(field.link_filters) : {}),
			name: ['in', users.data.crmUsers?.map((user) => user.name)],
		})
	}

	return {
		...field,
		filters: field.link_filters && JSON.parse(field.link_filters),
		placeholder: field.placeholder || field.label,
	}
}

const gridTemplateColumns = computed(() => {
	if (!fields.value?.length) return '1fr'
	// for the checkbox & sr no. columns
	let gridViewSettings = getGridViewSettings(props.parentDoctype)
	if (gridViewSettings.length) {
		return gridViewSettings.map((gs) => `minmax(0, ${gs.columns || 2}fr)`).join(' ')
	}
	return fields.value.map(() => `minmax(0, 2fr)`).join(' ')
})

const allRowsSelected = computed(() => {
	if (!rows.value?.length) return false
	return rows.value.length === selectedRows.size
})

const showDeleteBtn = computed(() => selectedRows.size > 0 && !props.tableReadOnly)

const toggleSelectAllRows = (iSelected) => {
	if (iSelected) {
		rows.value?.forEach((row) => selectedRows.add(row.name))
	} else {
		selectedRows.clear()
	}
}

const toggleSelectRow = (row) => {
	if (selectedRows.has(row.name)) {
		selectedRows.delete(row.name)
	} else {
		selectedRows.add(row.name)
	}
}

const addRow = () => {
	const newRow = {}
	allFields.value?.forEach((field) => {
		if (field.fieldtype === 'Check') {
			newRow[field.fieldname] = false
		} else {
			newRow[field.fieldname] = ''
		}

		if (field.default) {
			newRow[field.fieldname] = getDefaultValue(field.default, field.fieldtype)
		}
	})
	newRow.name = getRandom(10)
	showRowList.value.push(false)
	newRow['__islocal'] = true
	newRow['idx'] = rows.value.length + 1
	newRow['doctype'] = props.doctype
	newRow['parentfield'] = props.parentFieldname
	newRow['parenttype'] = props.parentDoctype
	rows.value.push(newRow)
	triggerOnRowAdd(newRow)
}

const deleteRows = () => {
	rows.value = rows.value.filter((row) => !selectedRows.has(row.name))
	triggerOnRowRemove(selectedRows, rows.value)

	showRowList.value.pop()
	selectedRows.clear()
	// Reindex after deletion to keep idx in sequence
	// if (rows.value?.length) {
	// 	rows.value.forEach((row, i) => {
	// 		row.idx = i + 1
	// 	})
	// }
}

function fieldChange(value, field, row) {
	if (triggerOnChange) {
		triggerOnChange(field.fieldname, value, row)
	} else {
		row[field.fieldname] = value
	}
}

function onSort(e) {
	if (!rows.value?.length) return
	rows.value.forEach((row, i) => {
		row.idx = i + 1
	})
}

function getDefaultValue(defaultValue, fieldtype) {
	if (['Float', 'Currency', 'Percent'].includes(fieldtype)) {
		return flt(defaultValue)
	} else if (fieldtype === 'Check') {
		if (['1', 'true', 'True'].includes(defaultValue)) {
			return true
		} else if (['0', 'false', 'False'].includes(defaultValue)) {
			return false
		}
	} else if (fieldtype === 'Int') {
		return parseInt(defaultValue)
	} else if (defaultValue === 'Today' && fieldtype === 'Date') {
		return dayjs().format('YYYY-MM-DD')
	} else if (['Now', 'now'].includes(defaultValue) && fieldtype === 'Datetime') {
		return dayjs().format('YYYY-MM-DD HH:mm:ss')
	} else if (['Now', 'now'].includes(defaultValue) && fieldtype === 'Time') {
		return dayjs().format('HH:mm:ss')
	} else if (fieldtype === 'Date') {
		return dayjs(defaultValue).format('YYYY-MM-DD')
	} else if (fieldtype === 'Datetime') {
		return dayjs(defaultValue).format('YYYY-MM-DD HH:mm:ss')
	} else if (fieldtype === 'Time') {
		return dayjs(defaultValue).format('HH:mm:ss')
	}

	return defaultValue
}

function handleMultipleFileUpload(files, field, row) {
	// Handle single file upload (backward compatibility)
	if (!Array.isArray(files)) {
		files = [files]
	}

	// For the first file, update the current row
	if (files.length > 0) {
		fieldChange(files[0][field.fieldname], field, row)
	}

	// For additional files, create new rows
	for (let i = 1; i < files.length; i++) {
		const newRow = {}
		allFields.value?.forEach((f) => {
			if (f.fieldtype === 'Check') {
				newRow[f.fieldname] = false
			} else {
				newRow[f.fieldname] = ''
			}
			if (f.default) {
				newRow[f.fieldname] = getDefaultValue(
					f.default,
					f.fieldtype,
				)
			}
		})

		newRow[field.fieldname] = files[i][field.fieldname]
		newRow.name = getRandom(10)
		showRowList.value.push(false)
		newRow['__islocal'] = true
		newRow['idx'] = rows.value.length + 1
		newRow['doctype'] = props.doctype
		newRow['parentfield'] = props.parentFieldname
		newRow['parenttype'] = props.parentDoctype
		rows.value.push(newRow)
		triggerOnRowAdd(newRow)
	}
}
</script>

<style scoped>
/* For Input fields */
:deep(.grid-row input:not([type='checkbox'])),
:deep(.grid-row textarea) {
	border: none;
	border-radius: 0;
	height: 38px;
	text-align: center;
}

:deep(.grid-row input:focus),
:deep(.grid-row input:hover),
:deep(.grid-row textarea:focus),
:deep(.grid-row textarea:hover) {
	box-shadow: none;
}

:deep(.grid-row input:focus-within) :deep(.grid-row textarea:focus-within) {
	border: 1px solid var(--outline-gray-2);
}

/* For select field */
:deep(.grid-row select) {
	border: none;
	border-radius: 0;
	height: 38px;
}

/* For Autocomplete */
:deep(.grid-row button) {
	border: none;
	border-radius: 4px;
	background-color: var(--surface-white);
	/* height: 38px; */
}

/* :deep(.grid-row:last-child .grid-row-checkbox) {
	border-bottom-left-radius: 7px;
} */

/* :deep(.grid-row .edit-row button) {
	border-bottom-right-radius: 7px;
} */

:deep(.grid-row button:focus) :deep(.grid-row button:hover) {
	box-shadow: none;
	background-color: var(--surface-white);
}

:deep(.grid-row button:focus-within) {
	border: 1px solid var(--outline-gray-2);
}
</style>
