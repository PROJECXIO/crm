<template>
	<div class="space-y-4">
		<div class="pb-2 md:px-8 flex flex-col gap-4">
			<div
				class="rounded-xl p-2 md:p-5 bg-white flex flex-col gap-7"
				style="box-shadow: -9px 9px 40px 0px #00000014"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-2xl !font-bold text-subheading">
						{{ __('Balance:') }}
					</h2>
					<Button
						:label="__('View Leave History')"
						iconLeft="eye"
						variant="ghost"
						theme="green"
						class="font-bold hover:bg-transparent focus:!bg-transparent hover:underline"
						@click="
							() => {
								emit('showHolidayList', 'Leave Application', 'Leave History')
							}
						"
					/>
				</div>
				<div v-if="leaveBalance.loading">
					<LoadingIndicator class="size-8" />
					<span>{{ __('Loading...') }}</span>
				</div>
				<div
					v-else-if="leaveBalance.data && Object.entries(leaveBalance.data).length > 0"
					:class="['flex items-center justify-center gap-4 flex-wrap w-full']"
				>
					<div
						v-for="(allocation, leave_type, index) in leaveBalance.data"
						:key="index"
						class="w-1/5 flex flex-col items-center gap-3"
					>
						<component :is="getLeaveIcon(leave_type)" class="leave-icon" />
						<div class="flex flex-col items-center gap-1">
							<p class="text-2xl font-bold text-subheading">
								{{ __(leave_type) }}
							</p>
							<p class="text-lg text-[#666]">
								{{ allocation.balance_leaves }} {{ __('days available') }}
							</p>
						</div>
					</div>
					<!-- <div class="flex flex-col items-center gap-3">
						<SickLeaveIcon />
						<div class="flex flex-col items-center gap-1">
							<p class="text-2xl font-bold text-subheading">
								{{ __('Sick Leaves') }}
							</p>
							<p class="text-lg text-[#666]">
								 {{ __('days available') }}
							</p>
						</div>
					</div> -->
				</div>
				<div
					class="space-y-2 mt-3"
					v-else-if="leaveBalance?.data && Object.entries(leaveBalance.data).length === 0"
				>
					<p class="text-[#666] font-medium italic text-center text-lg">
						{{ __(`There are no balance for ${isAdmin() ? getUser().name : userEmployeeResource.data.full_name}`) }}
					</p>
					<p class="text-[#666] font-medium italic text-center text-lg">
						{{ __('Add Leave Allocation to see balance') }}
					</p>
				</div>
				<Button
					:label="__('Request a Leave')"
					theme="green"
					variant="solid"
					class="w-full"
					size="lg"
					:disabled="
						leaveBalance?.data && Object.entries(leaveBalance.data).length === 0
					"
					@click="emit('showLeaveRequestModal')"
				/>
			</div>
			<!-- Recent Leaves: -->
			<div class="rounded-xl p-2 md:p-5" style="box-shadow: -9px 9px 40px 0px #00000014">
				<div class="flex items-center justify-between">
					<h2 class="text-2xl !font-bold text-subheading">
						{{ __('Recent Leaves:') }}
					</h2>
					<Button
						:label="__('View List')"
						iconLeft="eye"
						variant="ghost"
						theme="green"
						@click="
							() => {
								emit('showHolidayList', 'Leave Application', 'Recent Leaves')
							}
						"
						class="font-bold hover:bg-transparent focus:!bg-transparent hover:underline"
					/>
				</div>
				<div v-if="myLeaves.loading" class="w-full flex items-center justify-center">
					<LoadingIndicator color="#00aa80" class="size-8" />
				</div>
				<div
					v-if="myLeaves.data"
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4"
				>
					<div
						v-for="leave in myLeaves.data"
						@click="
							emit('showSummaryModal', { ...leave, doctype: 'Leave Application' })
						"
						:key="leave.name"
						class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:!shadow-2xl hover:scale-105 transition-all duration-300"
						style="box-shadow: 0px 0px 20px 0px #0000001a"
					>
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-1">
								<RequestLeaveIcon class="w-4 h-4" />
								<p
									class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
								>
									{{ leave.leave_type }}
								</p>
							</div>
							<div class="flex items-center gap-3">
								<Badge
									:theme="leaveStatusColors[leave.status] || 'orange'"
									:label="leave.status"
									class="rounded-sm"
								/>
								<ArrowRightIcon class="size-5" />
							</div>
						</div>
						<p class="mt-1 text-xs text-[#666] dark:text-gray-400">
							{{ leave.from_date }} - {{ leave.to_date }} /
							{{ leave.total_leave_days }} {{ __('days') }}
						</p>
						<div class="flex items-center gap-1">
							<Avatar size="sm" shape="square" :label="leave.employee_name" />
							<span class="text-lg font-medium text-[#666]">
								{{ leave.employee_name }}
							</span>
						</div>
					</div>
				</div>
				<div v-else class="mt-5 text-center">
					<p class="text-lg text-gray-400 font-bold">
						{{ __('There is no data to show') }}
					</p>
				</div>
			</div>
			<!-- Upcoming Holidays: -->
			<div
				class="rounded-xl p-2 md:p-5 space-y-4"
				style="box-shadow: -9px 9px 40px 0px #00000014"
			>
				<div class="flex items-center justify-between">
					<h2 class="text-2xl !font-bold text-subheading">
						{{ __('Upcoming Holidays:') }}
					</h2>
					<Button
						:label="__('View List')"
						iconLeft="eye"
						variant="ghost"
						theme="green"
						@click="
							() => {
								emit('showHolidayList', 'Leave Application', 'Upcoming Holidays')
							}
						"
						class="font-bold hover:bg-transparent focus:!bg-transparent hover:underline"
					/>
				</div>
				<div class="flex flex-col gap-4">
					<div v-if="holidays.loading" class="flex items-center justify-center">
						<LoadingIndicator color="green" class="size-10" />
					</div>
					<template v-if="holidays?.data">
						<div
							v-for="holiday in holidays.data?.slice(0, 5)"
							:key="holiday.name"
							class="flex items-center justify-between w-full lg:w-1/3 bg-white dark:bg-gray-900 rounded-md p-4 cursor-pointer hover:ms-2 transition-all duration-300"
							style="box-shadow: 0px 0px 20px 0px #0000001a"
						>
							<div class="flex items-center gap-1">
								<AnnualLeaveIcon class="size-4" />
								<p class="text-lg text-subheading font-medium">
									{{ __(holiday.description) }}
								</p>
							</div>
							<div class="flex items-center">
								<p class="text-xs text-[#666]">
									{{ dayjs(holiday.holiday_date).format('dd, MM-YYYY') }}
								</p>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Avatar, Badge, createResource, dayjs } from 'frappe-ui'
import { usersStore } from '@/stores/users'
import RequestLeaveIcon from '@/components/Icons/HR/RequestLeaveIcon.vue'
import AnnualLeaveIcon from '@/components/Icons/HR/AnnualLeaveIcon.vue'
import SickLeaveIcon from '@/components/Icons/HR/SickLeaveIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import PrivilegeLeaveLeaveIcon from '../Icons/HR/PrivilegeLeaveLeaveIcon.vue'
import CasualLeaveIcon from '../Icons/HR/CasualLeaveIcon.vue'
import DefaultLeaveIcon from '../Icons/HR/DefaultLeaveIcon.vue'
import CompensatoryOffLeaveIcon from '../Icons/HR/CompensatoryOffLeaveIcon.vue'
import { myLeaves , leaveBalance} from '@/data/leaves'
import {userEmployeeResource} from "@/stores/user"

const { isAdmin, getUser } = usersStore()

const leaveStatusColors = {
	Open: 'gray',
	Approved: 'green',
	Rejected: 'red',
	Cancelled: 'red',
}

const holidays = createResource({
	url: "hrms.api.get_holidays_for_employee",
	params: {
		employee: userEmployeeResource.data.name,
	},
	auto: true,
	transform: (data) => {
		return data.map((holiday) => {
			const holidayDate = dayjs(holiday.holiday_date)
			holiday.is_upcoming = holidayDate.isAfter(dayjs())
			holiday.formatted_holiday_date = holidayDate.format("ddd, D MMM YYYY")
			return holiday
		})
	},
})

function getLeaveIcon(leave_type) {
	switch (leave_type) {
		case 'Annual Leave':
			return AnnualLeaveIcon
		case 'Sick Leave':
			return SickLeaveIcon
		case 'Casual Leave':
			return CasualLeaveIcon
		case 'Compensatory Off':
			return CompensatoryOffLeaveIcon
		case 'Privilege Leave':
			return PrivilegeLeaveLeaveIcon
		default:
			return DefaultLeaveIcon
	}
}

const emit = defineEmits(['showLeaveRequestModal', 'showHolidayList', 'showSummaryModal'])

function reload() {
	holidays.reload()
}

defineExpose({
	reload,
})
</script>
