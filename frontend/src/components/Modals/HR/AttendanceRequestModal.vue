<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('New Attendance Request'),
			size: '3xl',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div :class="['grid gap-3', isMobileView ? 'grid-cols-1' : 'grid-cols-2']">
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('From Date') }}
						<span class="text-red-500">*</span>
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
						<span class="text-red-500">*</span>
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
				<div class="col-span-2 space-y-2">
					<div>
						<Checkbox v-model="data.half_day" :label="__('Half Day')" size="md" />
					</div>
					<div
						v-if="data.half_day"
						:class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']"
					>
						<label class="text-[#666] text-lg font-bold"
							>{{ __('Half Day Date') }}
							<span class="text-red-500">*</span>
						</label>
						<DatePicker
							variant="outline"
							size="xl"
							icon-left="calendar"
							:placeholder="__('dd/mm/yyyy')"
							input-class="border-none h-12 mt-0.5"
							@change="
								(val) => (data.half_day_date = dayjs(val).format('YYYY-MM-DD'))
							"
							:value="data.half_day_date"
						/>
					</div>
					<div>
						<Checkbox
							v-model="data.include_holidays"
							:label="__('Include Holidays')"
							size="md"
						/>
					</div>
				</div>

				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold">{{ __('Shift') }}</label>
					<Link
						doctype="Shift Type"
						variant="outline"
						size="xl"
						v-model="data.shift"
						:placeholder="__('Select shift type')"
					/>
					<!-- :onCreate="
											(value, close) => {
												createDocument(
													'Shift Type',
													data,
													close,
													handleCreateCallback('unit_project'),
												)
											}
										" -->
				</div>
				<div :class="[isMobileView ? 'col-span-2' : 'col-span-1', 'space-y-2']">
					<label class="text-[#666] text-lg font-bold"
						>{{ __('Reason') }}
						<span class="text-red-500">*</span>
					</label>

					<Autocomplete
						size="xl"
						variant="outline"
						:options="[
							{ label: 'Work From Home', value: 'Work From Home' },
							{ label: 'On Duty', value: 'On Duty' },
						]"
						v-model="data.reason"
						class="!mt-2.5"
					/>
				</div>
				<div class="col-span-2 space-y-2">
					<label class="text-[#666] text-lg font-bold">{{ __('Explanation') }} </label>
					<FormControl
						variant="outline"
						size="xl"
						v-model="data.explanation"
						:placeholder="__('Enter explanation')"
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
import Checkbox from '@/components/frappe-ui/Checkbox.vue'
import { reactive, ref } from 'vue'
import { usersStore } from '@/stores/users'
import Autocomplete from '@/components/frappe-ui/Autocomplete.vue'
import FormControl from '@/components/frappe-ui/FormControl.vue'
import DatePicker from '@/components/frappe-ui/DatePicker.vue'
import Link from '@/components/Controls/Link.vue'

const show = defineModel()

const { getUser } = usersStore()

const emits = defineEmits('reload')

const loading = ref(false)

const data = reactive({
	from_date: '',
	to_date: '',
	employee: getUser().employee?.name,
	reason: '',
	half_day: false,
	include_holidays: false,
	half_day_date: '',
	shift: '',
	explanation: '',
})

async function submit() {
	loading.value = true
	try {
		let res = await call('frappe.client.insert', {
			doc: {
				doctype: 'Attendance Request',
				...handleData(),
			},
		})
		if (res.name) {
			emits('reload')
			toast.success(__('Attendance requested successfully'))
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
