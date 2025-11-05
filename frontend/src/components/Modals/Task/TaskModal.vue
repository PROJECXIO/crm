<template>
	<Dialog v-model="show" :options="{ size: '2xl' }" :disable-outside-click-to-close="true">
		<template #body-title>
			<div class="flex items-center gap-3">
				<h3 class="text-2xl font-semibold leading-6 text-ink-gray-9">
					{{ editMode ? __('Edit Task') : __('Create Task') }}
				</h3>
			</div>
		</template>
		<template #body-content>
			<div class="grid grid-cols-2 gap-4 gap-y-5">
				<div class="col-span-2 space-y-2 border-b py-2">
					<label class="text-subheading text-lg font-medium">{{
						__('Task Type')
					}}</label>
					<TextInput
						v-if="editMode"
						v-model="taskType.value"
						variant="outline"
						size="lg"
						disabled
					/>
					<Autocomplete
						v-else
						variant="outline"
						size="xl"
						class="border rounded-md"
						:options="taskTypes"
						v-model="taskType"
						:placeholder="__('Select Task Type')"
					/>
				</div>
				<div class="col-span-2 space-y-2 py-2 min-h-60">
					<NormalTaskModal
						v-if="['Normal Task', 'Task'].includes(taskType.value)"
						@close="show = false"
					/>
					<MoveToDraftModal
						v-else-if="taskType.value === 'Move To Draft'"
						@close="show = false"
					/>
					<UnitIncompleteModal
						v-else-if="taskType.value === 'Unit Incomplete'"
						@close="show = false"
					/>
					<UnitInquiryModal
						v-else-if="taskType.value === 'Unit Inquiry'"
						@close="show = false"
					/>
					<UnitSearchModal
						v-else-if="['Unit Search', 'Search Request'].includes(taskType.value)"
						@close="show = false"
					/>
					<ViewingRequestModal
						v-else-if="taskType.value === 'Viewing Request'"
						@close="show = false"
					/>
					<div v-else class="flex flex-col items-center gap-5 justify-center h-full">
						<TaskIcon class="w-20 h-20 stroke-gray-400" />
						<h3 class="text-subheading text-3xl font-semibold opacity-50">
							{{ __('Select Task Type to Show Different Modals') }}
						</h3>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import {
	NormalTaskModal,
	MoveToDraftModal,
	UnitSearchModal,
	UnitInquiryModal,
	UnitIncompleteModal,
	ViewingRequestModal,
} from '@/components/Modals/Task'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import { inject, onBeforeUnmount, ref } from 'vue'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import { TextInput } from 'frappe-ui'
//props
const props = defineProps({
	taskType: {
		type: String,
		default: '',
	},
})
// models
const show = defineModel()
// emits
const emit = defineEmits(['updateTask', 'after'])
// refs
const taskType = ref({ label: props.taskType, value: props.taskType })
const taskTypes = ref([
	{ label: 'Normal Task', value: 'Normal Task' },
	{ label: 'Move To Draft', value: 'Move To Draft' },
	{ label: 'Unit Incomplete', value: 'Unit Incomplete' },
	{ label: 'Unit Inquiry', value: 'Unit Inquiry' },
	{ label: 'Unit Search', value: 'Unit Search' },
	{ label: 'Viewing Request', value: 'Viewing Request' },
])
const editMode = inject('editMode', false)

onBeforeUnmount(() => {
	taskType.value = { label: '', value: '' }
})
</script>

<style scoped></style>
