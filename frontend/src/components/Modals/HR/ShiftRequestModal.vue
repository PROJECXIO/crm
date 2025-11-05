<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('New Shift Request'),
			size: '3xl',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
				<div class="col-span-1 space-y-2">
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
				<div class="col-span-1 space-y-2">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Shift') }}
						<span class="text-red-500">*</span>
					</label>
					<Link
						doctype="Shift Type"
						variant="outline"
						size="xl"
						v-model="data.shift_type"
						:placeholder="__('Select shift type')"
					/>
				</div>
				<div class="col-span-1 space-y-2">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('From Date') }}
						<span class="text-red-500">*</span>
					</label>
					<DatePicker
						variant="outline"
						size="lg"
						icon-left="calendar"
						:placeholder="__('dd/mm/yyyy')"
						input-class="border-none"
						@change="(val) => (data.from_date = dayjs(val).format('YYYY-MM-DD'))"
						:value="data.from_date"
					/>
				</div>
				<div class="col-span-1 space-y-2">
					<label class="text-[#666] text-lg font-bold">{{ __('To Date') }} </label>
					<DatePicker
						variant="outline"
						size="lg"
						icon-left="calendar"
						:placeholder="__('dd/mm/yyyy')"
						input-class="border-none"
						@change="(val) => (data.to_date = dayjs(val).format('YYYY-MM-DD'))"
						:value="data.to_date"
					/>
				</div>

				<div class="col-span-1 space-y-2">
					<label class="text-[#666] text-lg font-bold">{{ __('Approver') }}</label>
					<Link
						doctype="User"
						variant="outline"
						size="xl"
						v-model="data.approver"
						:placeholder="__('Select approver')"
						hide-me
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
						@click="submit"
						:loading="loading"
						:disabled="loading"
						:class="[isMobileView ? 'min-h-[44px]' : '']"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import Add from '@/components/Modals/Actions/Add.vue'
import { isMobileView } from '@/composables/settings'
import { call, dayjs, toast } from 'frappe-ui'
import { reactive, ref } from 'vue'
import { usersStore } from '@/stores/users'
import DatePicker from "@/components/frappe-ui/DatePicker.vue"


const show = defineModel()
const { getUser } = usersStore()
const emits = defineEmits(['reload'])

const data = reactive({
	employee: getUser().employee?.name || '',
	shift_type: '',
	from_date: '',
	to_date: '',
	approver: getUser().employee?.shift_request_approver || '',
})

const loading = ref(false)

async function submit() {
	loading.value = true
	try {
		let res = await call('frappe.client.insert', {
			doc: {
				doctype: 'Shift Request',
				...handleData(),
			},
		})
		if (res.name) {
			toast.success(__('Shift requested successfully'))
			emits('reload')
		}
	} catch (error) {
		toast.error(__(error.messages?.join('/n')))
	} finally {
		loading.value = false
	}
}

function handleData() {
	const result = {}
	for (const row in data) {
		if (typeof data[row] === 'object') {
			result[row] = data[row]?.value
		} else {
			result[row] = data[row]
		}
	}
	return result
}
</script>
