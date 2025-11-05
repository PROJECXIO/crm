<template>
	<TabList
		class="relative flex items-center mb-0 sm:h-auto sm:justify-start md:justify-center overflow-x-auto py-5 gap-2 bg-transparent"
	>
		<Tab
			ref="tabRef"
			as="template"
			v-for="(tab, i) in t.tabs"
			:key="i"
			v-slot="{ selected }"
			class="focus:outline-none focus:transition-none hover:scale-105"
		>
			<slot v-bind="{ tab, selected }">
				<button
					class="flex items-center gap-2 text-lg min-w-fit duration-300 ease-in-out text-[#5C6375] hover:bg-[#E6FAF5] p-2 rounded"
					:class="[
						selected ? '!font-semibold !text-[#00291F] bg-[#E6FAF5] ' : '!font-medium',
					]"
				>
					<component v-if="tab.icon" :is="tab.icon" class="size-4" />
					{{ tab.label }}
				</button>
			</slot>
		</Tab>
		<div
			ref="indicator"
			class="tab-indicator absolute bg-surface-gray-7"
			:class="[t.vertical ? 'right-0 w-px' : 'bottom-0 h-px', transitionClass]"
		/>
	</TabList>
</template>
<script setup>
import { TabList, Tab } from '@headlessui/vue'
import { ref, inject } from 'vue'

const t = inject('tab')

const tabRef = ref([])
const indicator = ref(null)

const transitionClass = ref('')
</script>
