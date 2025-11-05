<template>
	<div
		v-if="actions.length > 0"
		:class="[
			'flex w-full flex-row items-center justify-between gap-3 sticky bottom-0 border-t z-[100] p-4',
		]"
	>
		<Button
			v-for="action in actions"
			:key="action.key"
			class="w-full py-5"
			:variant="action.variant"
			:theme="action.theme"
			@click="applyWorkflow({ workflowAction: action.text })"
		>
			<template #prefix v-if="action.featherIcon">
				<FeatherIcon :name="action.featherIcon" class="w-4" />
			</template>
			{{ __(action.text, null, props.doc?.doctype) }}
		</Button>
	</div>
	<p class="text-[#666] bg-gray-100 p-2 rounded-md text-xs font-semibold italic" v-else>{{ __('There are no workflow actions available') }}</p>
</template>

<script setup>
import { computed, ref, onMounted, inject } from 'vue'
import { FeatherIcon } from 'frappe-ui'

const props = defineProps({
	doc: {
		type: Object,
		required: true,
	},
	workflow: {
		type: Object,
		required: false,
	},
	view: {
		type: String,
	},
})

console.log(props.workflow)

const emit = defineEmits(['workflow-applied'])

const actions = ref([])

const getTransitions = async () => {
	const transitions = await props.workflow.getTransitions(props.doc)
	actions.value = transitions.map((transition, idx) => {
		let theme = 'gray'
		let variant = 'subtle'
		let icon = ''
		let actionLabel = transition.toLowerCase()
		let key = idx

		if (actionLabel.includes('reject') || actionLabel.includes('cancel')) {
			theme = 'red'
			variant = 'subtle'
			icon = 'x'
		} else if (actionLabel.includes('approve')) {
			theme = 'green'
			variant = 'solid'
			icon = 'check'
		}

		return {
			key,
			text: __(transition, null, props.doc?.doctype),
			theme,
			variant,
			featherIcon: icon,
			data: {
				action: transition,
			},
		}
	})
}

const applyWorkflow = async ({ event = '', workflowAction = '' }) => {
	console.log({ event })
	console.log({ workflowAction })
	const action = workflowAction || event.detail.data?.action
	if (action) {
		await props.workflow.applyWorkflow(props.doc, action)
		emit('workflow-applied')
	}
}

onMounted(() => getTransitions())
</script>
