<template>
	<div class="space-y-1.5 p-[2px] -m-[2px]">
		<label class="block" :class="labelClasses" v-if="attrs.label">
			{{ __(attrs.label) }}
		</label>

		<Autocomplete
			ref="autocomplete"
			:options="options.data"
			v-model="value"
			:size="attrs.size || 'sm'"
			:variant="attrs.variant"
			:placeholder="attrs.placeholder"
			:filterable="false"
			:disabled="disabled"
			:filters="filters"
		>
			<template #target="{ open, togglePopover }">
				<slot name="target" v-bind="{ open, togglePopover }" />
			</template>

			<template #prefix>
				<slot name="prefix" />
			</template>

			<template #item-prefix="{ active, selected, option }">
				<slot name="item-prefix" v-bind="{ active, selected, option }" />
			</template>

			<template #item-label="{ active, selected, option }">
				<slot name="item-label" v-bind="{ active, selected, option }" class="group">
					<div v-if="option.description" class="flex flex-col gap-1">
						<div
							class="flex-1 font-semibold truncate text-ink-gray-7 group-hover:text-white group-hover:text-lg transition-all duration-200"
						>
							{{ option.label }}
						</div>
						<div
							class="flex-1 text-sm truncate text-ink-gray-5 group-hover:text-white group-hover:text-lg transition-all duration-200"
						>
							{{ option.description }}
						</div>
					</div>
					<div
						v-else
						class="flex-1 truncate text-ink-gray-7 group-hover:text-white group-hover:text-lg transition-all duration-200"
					>
						{{ option.label }}
					</div>
				</slot>
			</template>

			<template #footer="{ value, close }">
				<div v-if="withFilters" class="mb-1 border-b">
					<p class="text-[#666] text-base mb-1">{{ __('Filters') }}:</p>
					<span class="mt-1 mx-2 text-[#666] text-sm mb-1 italic">{{
						handleDisplayFilters
					}}</span>
				</div>
				<div v-if="attrs.onCreate">
					<Button
						variant="ghost"
						theme="green"
						class="w-full !justify-start py-4"
						:label="__('Create New')"
						@click="() => attrs.onCreate(value, close)"
					>
						<template #prefix>
							<FeatherIcon name="plus" class="h-4" />
						</template>
					</Button>
				</div>
				<div>
					<Button
						variant="ghost"
						theme="red"
						class="w-full !justify-start py-4"
						:label="__('Clear')"
						@click="() => clearValue(close)"
					>
						<template #prefix>
							<FeatherIcon name="x" class="h-4" />
						</template>
					</Button>
				</div>
			</template>
		</Autocomplete>
	</div>
</template>

<script setup>
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { watchDebounced } from '@vueuse/core'
import { createResource } from 'frappe-ui'
import { useAttrs, computed, ref, toDisplayString } from 'vue'

const props = defineProps({
	doctype: {
		type: String,
		required: true,
	},
	filters: {
		type: [Array, Object, String],
		default: [],
	},
	modelValue: {
		type: String,
		default: '',
	},
	hideMe: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['update:modelValue', 'change'])

const attrs = useAttrs()

const valuePropPassed = computed(() => 'value' in attrs)

const withFilters = computed(() => {
	if (props.filters !== null) {
		if (Array.isArray(props.filters) || typeof props.filters === 'string') {
			return props.filters.length > 0
		} else if (typeof props.filters === 'object') {
			return Object.entries(props.filters).length > 0
		}
	} else {
		return false
	}
})

const value = computed({
	get: () => (valuePropPassed.value ? attrs.value : props.modelValue),
	set: (val) => {
		return (
			val?.value && emit(valuePropPassed.value ? 'change' : 'update:modelValue', val?.value)
		)
	},
})

const autocomplete = ref(null)
const text = ref('')

watchDebounced(
	() => autocomplete.value?.query,
	(val) => {
		val = val || ''
		if (text.value === val) return
		text.value = val
		reload(val)
	},
	{ debounce: 300, immediate: true },
)

watchDebounced(
	() => props.doctype,
	() => reload(''),
	{ debounce: 300, immediate: true },
)

const options = createResource({
	url: 'frappe.desk.search.search_link',
	cache: [props.doctype, text.value, props.hideMe, props.filters],
	method: 'POST',
	params: {
		txt: text.value,
		doctype: props.doctype,
		filters: props.filters,
	},
	transform: (data) => {
		let allData = data.map((option) => {
			return {
				label: option.label || option.value,
				value: option.value,
				description: option.description,
			}
		})
		if (!props.hideMe && props.doctype == 'User') {
			allData.unshift({
				label: '@me',
				value: '@me',
			})
		}
		return allData
	},
})

function reload(val) {
	if (!props.doctype) return
	if (
		options.data?.length &&
		val === options.params?.txt &&
		props.doctype === options.params?.doctype
	)
		return

	options.update({
		params: {
			txt: val,
			doctype: props.doctype,
			filters: props.filters,
		},
	})
	options.reload()
}

function clearValue(close) {
	emit(valuePropPassed.value ? 'change' : 'update:modelValue', '')
	close()
}

const labelClasses = computed(() => {
	return [
		{
			sm: 'text-xs',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl h-12',
		}[attrs.size || 'sm'],
		'text-subheading',
	]
})

// normalize filters into an array of strings (lines)
const handleDisplayFilters = computed(() => {
	if (!props.filters) return []

	// case: string
	if (typeof props.filters === 'string') {
		return props.filters
			.split('\n')
			.map((f) => f.trim())
			.filter(Boolean)
	}

	// case: array
	if (Array.isArray(props.filters)) {
		return props.filters.map((f) =>
			typeof f === 'object'
				? Object.entries(f)
						.map(([key, value]) => `${key}: ${toDisplayString(value)}`)
						.join('\n')
				: String(f),
		)
	}

	// case: object
	if (typeof props.filters === 'object') {
		return Object.entries(props.filters)
			.map(([key, value]) => `${key}: ${toDisplayString(value)}`)
			.join('\n')
	}

	return []
})
</script>
