<template>
	<div v-if="type != 'checkbox'" :class="['space-y-1.5', attrs.class]" :style="attrs.style">
		<FormLabel v-if="label" :label="label" :size="size" :id="id" :required="required" />
		<Select v-if="type === 'select'" :id="id" v-bind="{ ...controlAttrs, size, variant }">
			<template #prefix v-if="$slots.prefix">
				<slot name="prefix" />
			</template>
		</Select>
		<Autocomplete v-else-if="type === 'autocomplete'" v-bind="{ ...controlAttrs }">
			<template #prefix v-if="$slots.prefix">
				<slot name="prefix" />
			</template>
			<template #item-prefix="itemPrefixProps" v-if="$slots['item-prefix']">
				<slot name="item-prefix" v-bind="itemPrefixProps" />
			</template>
		</Autocomplete>
		<Textarea
			v-else-if="type === 'textarea'"
			:id="id"
			v-bind="{ ...controlAttrs, size, variant }"
		/>
		<TextInput v-else :id="id" v-bind="{ ...controlAttrs, type, size, variant, required }">
			<template #prefix v-if="$slots.prefix">
				<slot name="prefix" />
			</template>
			<template #suffix v-if="$slots.suffix">
				<slot name="suffix" />
			</template>
		</TextInput>
		<slot name="description">
			<p class="!text-xs" v-if="description" :class="descriptionClasses">{{ description }}</p>
		</slot>
	</div>
	<Checkbox v-else :id="id" v-bind="{ ...controlAttrs, label, size, class: attrs.class }" />
</template>
<script setup lang="ts">
// @ts-nocheck
import { useAttrs, computed } from 'vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import Checkbox from '@/components/frappe-ui/Checkbox.vue'
import TextInput from '@/components/frappe-ui/TextInput.vue'
import { Select, Textarea, FormLabel } from 'frappe-ui'
import { useId } from './utils'

export type TextInputTypes =
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'month'
	| 'number'
	| 'password'
	| 'search'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week'
	| 'range'

export interface FormControlProps {
	label?: string
	description?: string
	type?: TextInputTypes | 'textarea' | 'select' | 'checkbox' | 'autocomplete'
	size?: 'sm' | 'md' | 'lg' | 'xl'
	variant?: 'subtle' | 'outline'
	required?: boolean
}

const id = useId()
const props = withDefaults(defineProps<FormControlProps>(), {
	type: 'text',
	size: 'sm',
	variant: 'subtle',
})

const attrs = useAttrs()
const controlAttrs = computed(() => {
	// pass everything except class and style
	let _attrs: typeof attrs = {}
	for (let key in attrs) {
		if (key !== 'class' && key !== 'style') {
			_attrs[key] = attrs[key]
		}
	}
	return _attrs
})

const descriptionClasses = computed(() => {
	return [
		{
			sm: 'text-xs',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
		}[props.size],
		'text-ink-gray-5',
	]
})
</script>
<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>
