<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('New Leave Application'),
			size: '3xl',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Employee') }}
						<span class="text-red-400"> *</span>
					</label>
					<Link
						doctype="Employee"
						variant="outline"
						size="xl"
						v-model="data.employee"
						:placeholder="__('Select employee')"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Leave Type') }}
						<span class="text-red-400"> *</span>
					</label>
					<Link
						doctype="Leave Type"
						variant="outline"
						size="xl"
						v-model="data.leave_type"
						:placeholder="__('Select leave type')"
					/>
				</div>

				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold">{{ __('Employee Name') }} </label>
					<TextInput
						:value="getUser().employee?.employee_name"
						size="xl"
						disabled
						variant="outline"
						class="!mt-2.5"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold">{{ __('Approver') }}</label>
					<Link
						doctype="User"
						variant="outline"
						size="xl"
						:placeholder="__('Select approver')"
						v-model="data.leave_approver"
						hide-me="true"
					/>
				</div>

				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('From Date') }}
						<span class="text-red-400"> *</span>
					</label>
					<DatePicker
						variant="outline"
						size="xl"
						icon-left="calendar"
						:placeholder="__('dd/mm/yyyy')"
						input-class="border-none h-12 mt-0.5"
						@change="(val) => (data.from_date = dayjs(val).format('YYYY-MM-DD'))"
						:value="data.from_date"
					/>
				</div>
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('To Date') }}
						<span class="text-red-400"> *</span>
					</label>
					<DatePicker
						variant="outline"
						size="xl"
						icon-left="calendar"
						:placeholder="__('dd/mm/yyyy')"
						input-class="border-none h-12 mt-0.5"
						@change="(val) => (data.to_date = dayjs(val).format('YYYY-MM-DD'))"
						:value="data.to_date"
					/>
				</div>
				<div class="col-span-2 space-y-2">
					<label class="text-[#666] text-lg font-bold">{{ __('Reason') }} </label>
					<TextInput
						:placeholder="__('Enter reason for leave')"
						v-model="data.description"
						size="xl"
						variant="outline"
					/>
				</div>
				<div class="col-span-2 space-y-2">
					<div>
						<Checkbox v-model="data.half_day" :label="__('Early Exit')" size="md" />
					</div>
				</div>
				<div
					v-if="data.half_day"
					:class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']"
				>
					<label class="text-[#666] text-lg font-bold">{{ __('Half Day Date') }} </label>
					<DatePicker
						variant="outline"
						size="xl"
						icon-left="calendar"
						:placeholder="__('dd/mm/yyyy')"
						input-class="border-none h-12 mt-0.5"
						@change="(val) => (data.half_day_date = dayjs(val).format('YYYY-MM-DD'))"
						:value="data.half_day_date"
					/>
				</div>
				<div class="col-span-2 space-y-2">
					<label class="text-[#666] text-lg font-bold">{{ __('Attachments') }}</label>
					<CustomUploadArea
						ref="uploadArea"
						doctype="Leave Application"
						:docname="null"
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
import TextInput from '@/components/frappe-ui/TextInput.vue'
import CustomUploadArea from '@/components/CustomUploadArea.vue'
import { usersStore } from '@/stores/users'
import DatePicker from '@/components/frappe-ui/DatePicker.vue'

const show = defineModel()
const { getUser } = usersStore()
const emits = defineEmits(['reload'])

const loading = ref(false)
const uploadArea = ref(null)
const data = reactive({
	employee: getUser().employee?.name || '',
	leave_type: '',
	from_date: '',
	to_date: '',
	leave_approver: getUser().employee?.leave_approver || '',
	description: '',
	half_day: false,
	half_day_date: '',
})

async function submit() {
	loading.value = true
	try {
		let res = await call('frappe.client.insert', {
			doc: {
				doctype: 'Leave Application',
				...handleData(),
			},
		})
		if (res.name) {
			if (uploadArea.value.files?.length > 0) {
				await uploadArea.value.uploadFilesWithDocname(res.name)
			}
			show.value = false
			toast.success(__('Leave application requested successfully'))
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
