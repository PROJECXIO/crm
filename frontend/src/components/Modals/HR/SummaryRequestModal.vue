<template>
	<Dialog
		v-model="show"
		:options="{
			size: '3xl',
			title,
		}"
	>
		<template #body-content>
			<div
				v-for="(value, key) in data"
				:key="key"
				class="flex items-center justify-between space-y-5"
			>
				<template v-if="!['doctype', '_previousData'].includes(key)">
					<p class="text-base font-semibold text-subheading w-3/4">
						{{ handleKey(key) }}
					</p>
					<p class="text-base font-medium text-[#666] w-1/4 text-start">{{ value }}</p>
				</template>
			</div>
		</template>
		<template #actions>
			<!-- Actions -->
			<WorkflowActionSheet
				v-if="workflow?.hasWorkflow"
				:doc="document.doc"
				:workflow="workflow"
			/>
			<div
				v-else-if="
					['Open', 'Draft'].includes(document?.doc?.[approvalField]) &&
					hasPermission('approval')
				"
				class="flex w-full flex-row items-center justify-between gap-3 sticky bottom-0 border-t z-[100] p-4"
			>
				<Button
					@click="updateDocumentStatus({ status: 'Rejected' })"
					class="w-full py-5 font-semibold"
					variant="subtle"
					theme="red"
				>
					<template #prefix>
						<FeatherIcon name="x" class="w-4" />
					</template>
					{{ __('Reject') }}
				</Button>

				<Button
					@click="updateDocumentStatus({ status: 'Approved' })"
					class="w-full py-5 font-semibold"
					variant="solid"
					theme="green"
				>
					<template #prefix>
						<FeatherIcon name="check" class="w-4" />
					</template>
					{{ __('Approve') }}
				</Button>
			</div>

			<div
				v-else-if="
					document?.doc?.docstatus === 0 &&
					(document?.doc?.doctype === 'Attendance Request' ||
						['Approved', 'Rejected'].includes(document?.doc?.[approvalField])) &&
					hasPermission('submit')
				"
				class="flex w-full flex-row items-center justify-between gap-3 sticky bottom-0 border-t z-[100] p-4"
			>
				<Button
					@click="updateDocumentStatus({ docstatus: 1 })"
					class="w-full py-5 font-semibold"
					variant="solid"
					theme="green"
				>
					{{ __('Submit') }}
				</Button>
			</div>

			<div
				v-else-if="document?.doc?.docstatus === 1 && hasPermission('cancel')"
				class="flex w-full flex-row items-center justify-between gap-3 sticky bottom-0 border-t z-[100] p-4"
			>
				<Button
					@click="updateDocumentStatus({ docstatus: 2 })"
					class="w-full py-5"
					variant="subtle"
					theme="red"
				>
					<template #prefix>
						<FeatherIcon name="x" class="w-4" />
					</template>
					{{ __('Cancel') }}
				</Button>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import useWorkflow from '@/composables/workflow'
import { useDocument } from '@/data/document'
import WorkflowActionSheet from '@/components/HR/WorkflowActionSheet.vue'
import { createResource, toast } from 'frappe-ui'

const props = defineProps({
	data: {
		type: Object,
	},
})

const show = defineModel()
const title = computed(() => props.data?.doctype)

const { document } = useDocument(props.data?.doctype, props.data?.name)

const workflow = ref(null)

const permittedWriteFields = createResource({
	url: 'revenyu.api.get_permitted_fields_for_write',
	params: { doctype: props.data.doctype },
	auto: true,
})

const docPermissions = createResource({
	url: 'frappe.client.get_doc_permissions',
	params: { doctype: props.data.doctype, docname: props.data.name },
	auto: true,
})

const approvalField = computed(() => {
	return props.data.doctype === 'Expense Claim' ? 'approval_status' : 'status'
})

function hasPermission(action) {
	if (action === 'approval') return permittedWriteFields.data?.includes(approvalField.value)
	return docPermissions.data?.permissions[action]
}

function handleKey(key) {
	let title = key[0].toUpperCase() + key.slice(1)
	return title.replaceAll('_', ' ')
}

const getSuccessMessage = ({ status = '', docstatus = 0 }) => {
	if (status) {
		return __('{0} successfully!', [__(status)])
	} else if (docstatus) {
		return __('Document {0} successfully!', [
			docstatus === 1 ? __('submitted') : __('cancelled'),
		])
	}
}
const getFailureMessage = ({ status = '', docstatus = 0 }) => {
	if (status) {
		return __('{0} failed!', [status === __('Approved') ? __('Approval') : __('Rejection')])
	} else if (docstatus) {
		return __('Document {0} failed!', [
			docstatus === 1 ? __('submission') : __('cancellation'),
		])
	}
}

const updateDocumentStatus = ({ status = '', docstatus = 0 }) => {
	let updateValues = {}

	if (status) updateValues[approvalField.value] = status
	if (docstatus) updateValues.docstatus = docstatus

	document.setValue.submit(
		{ ...updateValues },
		{
			onSuccess() {
				if (docstatus !== 0)
				toast.success(getSuccessMessage({ status, docstatus }))
			},
			onError() {
				toast.error(getFailureMessage({ status, docstatus }))
			},
		},
	)
}

onMounted(() => {
	workflow.value = useWorkflow(props.data.doctype)
})
</script>
