<template>
	<TabGroup
		v-bind="
			as !== 'template'
				? {
						as,
						class: ['flex flex-1', vertical ? '' : 'flex-col '],
					}
				: {}
		"
		:defaultIndex="tabIndex"
		:selectedIndex="tabIndex"
		@change="(idx) => (tabIndex = idx)"
	>
		<slot>
			<TabList
				v-if="!hidePanel"
				v-slot="{ tab, selected }"
				class="bg-gray-50/50 w-full"
			>
				<slot name="tab-item" v-bind="{ tab, selected }" />
			</TabList>
			<TabPanel v-slot="{ tab }" class="">
				<slot name="tab-panel" v-bind="{ tab }" />
			</TabPanel>
		</slot>
	</TabGroup>
</template>

<script setup>
import TabList from './TabList.vue'
import TabPanel from './TabPanel.vue'
import { TabGroup } from '@headlessui/vue'
import { computed, provide } from 'vue'

const props = defineProps({
	as: {
		type: String,
		default: 'template',
	},
	tabs: {
		type: Array,
		required: true,
	},
	vertical: {
		type: Boolean,
		default: false,
	},
	hidePanel: {
		type: Boolean,
		default: false,
	},
})

const tabIndex = defineModel()

provide(
	'tab',
	computed(() => ({
		tabIndex,
		tabs: props.tabs,
		vertical: props.vertical,
		hidePanel: props.hidePanel,
	})),
)
</script>
