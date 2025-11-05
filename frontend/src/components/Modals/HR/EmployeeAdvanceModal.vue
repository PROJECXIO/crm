<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('New Employee Advance'),
			size: '3xl',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
				<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Employee') }}
						<span class="text-red-500">*</span>
					</label>
					<Link
						doctype="Employee"
						variant="outline"
						size="xl"
						v-model="data.employee"
						:placeholder="__('Select employee')"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Purpose') }}
						<span class="text-red-500">*</span>
					</label>
					<FormControl
						variant="outline"
						size="xl"
						v-model="data.purpose"
						:placeholder="__('Enter purpose')"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Advance Amount') }}
					</label>
					<FormControl
						type="number"
						variant="outline"
						size="xl"
						v-model="data.advance_amount"
						:placeholder="__('Enter advance amount')"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-1' : 'col-span-2', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold">{{ __('Exchange Rate') }} </label>
					<FormControl
						type="number"
						variant="outline"
						size="xl"
						v-model="data.exchange_rate"
						:placeholder="__('Enter exchange rate')"
					/>
				</div>
			</div>
			<div class="pb-7 pt-4 px-1">
				<div :class="['flex', isMobileView ? 'flex-col  gap-4' : 'flex-row  gap-7']">
					<Cancel
						label="Cancel"
						@click="show = false"
						:class="[isMobileView ? 'min-h-[44px]' : '']"
					/>
					<Add
						label="Request"
						:loading="loading"
						:disabled="loading"
						:class="[isMobileView ? 'min-h-[44px]' : '']"
						@click="submit"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import Add from '@/components/Modals/Actions/Add.vue'
import { isMobileView } from '@/composables/settings'
import { call, createDocumentResource, createResource, dayjs, toast } from 'frappe-ui'
import { reactive, ref } from 'vue'
import { usersStore } from '@/stores/users'
import FormControl from '@/components/frappe-ui/FormControl.vue'
import { useDocument } from '@/data/document'

const show = defineModel()

const { getUser } = usersStore()
const { document } = useDocument('Employee Advance', null)

const emits = defineEmits('reload')

const loading = ref(false)

const data = reactive({
	employee: getUser().employee?.name || '',
	purpose: '',
	advance_amount: 0,
	exchange_rate: 1,
})

async function submit() {
	loading.value = true
	try {
		let res = await call('frappe.client.insert', {
			doc: {
				doctype: 'Employee Advance',
				...data,
			},
		})

		if (res.name) {
			emits('reload')
			toast.success(__('Employee advance requested successfully'))
		}
	} catch (error) {
		toast.error(__(error.messages?.join('/n') || 'Something went wrong, try again'))
		console.error(error)
	} finally {
		loading.value = false
	}
}
</script>
