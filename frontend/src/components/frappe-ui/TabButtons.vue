<template>
	<RadioGroup v-model="value">
		<div class="flex space-x-1 rounded p-0.5 text-sm">
			<RadioGroupOption
				as="template"
				v-for="button in buttons"
				:key="button.label"
				:value="button.value ?? button.label"
				v-slot="{ active, checked }"
			>
				<Button
					variant="ghost"
					:class="[
						active ? '!bg-[#00AA80] !text-[#fff]' : 'bg-gray-200',
						checked ? '!bg-[#00AA80] !text-[#fff] shadow' : 'text-ink-gray-7',
						'flex flex-1 justify-center gap-2 whitespace-nowrap rounded-[7px] px-3 py-[5px] leading-none transition-colors focus:outline-none',
					]"
				>
					<FeatherIcon
						class="h-4 w-4"
						v-if="button.icon"
						:name="button.icon"
						:label="button.label"
						:aria-label="button.label"
					/>
					<RadioGroupLabel
						as="span"
						class="flex h-4 items-center"
						:class="[
							active ? 'text-[#fff]' : 'text-ink-gray-7',
							checked ? 'bg-[#00AA80] !text-[#fff]' : 'text-ink-gray-7',
						]"
						v-show="button.label && !button.hideLabel"
						>{{ button.label }}
					</RadioGroupLabel>
				</Button>
			</RadioGroupOption>
		</div>
	</RadioGroup>
</template>
<script setup>
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import FeatherIcon from '@/components/frappe-ui/FeatherIcon.vue'
import Button from '@/components/frappe-ui/Button.vue'
import { computed } from 'vue'

const props = defineProps({
	buttons: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: [String, Boolean, Number],
	},
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
	get() {
		return props.modelValue
	},
	set(newValue) {
		emit('update:modelValue', newValue)
	},
})
</script>
