<template>
	<div class="md:px-8 space-y-4">
		<!-- Attendance Calendar -->
		<div
			class="flex flex-col rounded-xl p-2 md:p-5 gap-7 bg-white"
			style="box-shadow: -9px 9px 40px 0px #00000014"
		>
			<h2 class="text-2xl !font-bold text-subheading">
				{{ __('Attendance Calendar:') }}
			</h2>
			<div class="">
				<div class=" rounded-xl py-4">
					<AttendanceCalendar />
					<!-- <DateCalender v-model="single" @month-change="onMonthChange" /> -->
					<!-- <div
						class="max-w-full md:max-w-2/3 mx-auto flex items-center justify-center flex-wrap gap-[18px]"
					>
						<div v-if="employeeAttendanceStatus.loading">
							<LoadingIndicator color="#00aa80" class="size-8" />
						</div>

						<template v-else>
							<Badge
								v-for="(
									count, status
								) in employeeAttendanceStatus.data"
								:label="__(`${status}: ${count}`)"
								:theme="getAttendanceStatusColors(status)"
								class="rounded-sm px-4"
							/>
						</template>
					</div> -->
				</div>
				<Button
					@click="() => emit('showAttendanceRequestModal')"
					:label="__('Request Attendance')"
					theme="green"
					variant="solid"
					class="w-full mt-7"
					size="lg"
				/>
			</div>
		</div>
		<!-- Recent Attendance Requests -->
		<div
			class="rounded-xl p-2 md:p-5"
			style="box-shadow: -9px 9px 40px 0px #00000014"
		>
			<h2 class="text-2xl !font-bold text-subheading">
				{{ __('Recent Attendance Requests:') }}
			</h2>
			<div
				v-if="myAttendanceRequests.loading"
				class="w-full flex items-center justify-center"
			>
				<LoadingIndicator color="#00aa80" class="size-8" />
			</div>
			<div
				v-if="myAttendanceRequests?.data?.length"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
			>
			<div
					v-for="attendance in myAttendanceRequests?.data?.slice(0, 5)"					
				>
					<RequestCard :request="attendance" :attendance="true" @click="emit('showSummaryModal', attendance)" />
				</div>
			
			</div>
			<div v-else class="mt-5 text-center">
				<p class="text-lg text-gray-400 font-bold">
					{{ __('There is no data to show') }}
				</p>
			</div>
		</div>
		<!-- Upcoming Shifts: -->
		<div
			class="rounded-xl p-2 md:p-5"
			style="box-shadow: -9px 9px 40px 0px #00000014"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-2xl !font-bold text-subheading">
					{{ __('Upcoming Shifts:') }}
				</h2>
				<Button
					theme="green"
					variant="solid"
					size="md"
					:label="__('Shift a request')"
					class="font-semibold"
					@click="emit('showShiftRequestModal')"
				/>
			</div>
			<div
				v-if="shifts.loading"
				class="w-full flex items-center justify-center"
			>
				<LoadingIndicator color="#00aa80" class="size-8" />
			</div>
			<div
				v-if="upcomingShifts?.length"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
			>
		
				<div
					v-for="req in upcomingShifts.data"
					@click="emit('showSummaryModal', {...req, doctype: 'Shift Request'})"
					class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:-rotate-1 transition-transform duration-300"
					style="box-shadow: 0px 0px 20px 0px #0000001a"
				>
					<div class="flex items-start justify-between flex-wrap">
						<div class="flex items-center gap-1">
							<RequestLeaveIcon class="w-4 h-4" />
							<p
								class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
							>
								{{ req.shift_type }}
							</p>
						</div>
						<div class="flex items-center gap-3">
							<Badge
								:theme="shiftRequestColors[req.status]"
								:label="req.status"
								class="rounded-sm"
							/>
							<ArrowRightIcon class="size-5" />
						</div>
					</div>
					<p class="mt-1 text-xs text-[#666] dark:text-gray-400">
						{{ dayjs(req.from_date).format('DD MMMM') }}
						<span v-if="req.to_date">
							- {{ dayjs(req.to_date).format('DD MMMM') }} /
							{{ dayjs(req.to_date).diff(req.from_date, 'days') }}
							{{ __('days') }}
						</span>
					</p>
					<div class="flex items-center gap-1">
						<Avatar size="sm" shape="square" :label="req.employee_name" />
						<span class="text-lg font-medium text-[#666]">
							{{ req.employee_name }}
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
		<!-- Recent Shift Requests: -->
		<div
			class="rounded-xl p-2 md:p-5"
			style="box-shadow: -9px 9px 40px 0px #00000014"
		>
			<h2 class="text-2xl !font-bold text-subheading">
				{{ __('Recent Shift Requests:') }}
			</h2>
			<div
				v-if="myShiftRequests.loading"
				class="w-full flex items-center justify-center"
			>
				<LoadingIndicator color="#00aa80" class="size-8" />
			</div>
			<div
				v-if="myShiftRequests?.data?.length"
				class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
			>
				<div
					v-for="shift in myShiftRequests?.data?.slice(0, 5)"
					@click="emit('showSummaryModal', {...shift, doctype: 'Shift Request'})"

					:key="shift.name"
					class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:-rotate-1 transition-transform duration-300"
					style="box-shadow: 0px 0px 20px 0px #0000001a"
				>
					<div class="flex items-start justify-between flex-wrap">
						<div class="flex items-center gap-1">
							<RequestLeaveIcon class="w-4 h-4" />
							<p
								class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
							>
								{{ shift.shift_type }}
							</p>
						</div>
						<div class="flex items-center gap-3">
							<Badge
								:theme="shiftRequestColors[shift.status]"
								:label="shift.status"
								class="rounded-sm"
							/>
							<ArrowRightIcon class="size-5" />
						</div>
					</div>
					<p class="mt-1 text-xs text-[#666] dark:text-gray-400">
						{{ dayjs(shift.from_date).format('DD MMMM') }}
						<span v-if="shift.to_date"
							>- {{ dayjs(shift.to_date).format('DD MMMM') }}</span
						>
					</p>
					<div class="flex items-center gap-1">
						<Avatar
							size="sm"
							shape="square"
							:label="shift.employee_name"
						/>
						<span class="text-lg font-medium text-[#666]">
							{{ shift.employee_name }}
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
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { Avatar, Badge, createResource, dayjs } from 'frappe-ui'
import { userEmployeeResource } from '@/stores/user'
import RequestLeaveIcon from '@/components/Icons/HR/RequestLeaveIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import {
	getShiftDates,
	getTotalShiftDays,
	getShiftTiming,
	myAttendanceRequests,
	teamAttendanceRequests,
	myShiftRequests,
} from "@/data/attendance"
import AttendanceCalendar from '@/components/HR/AttendanceCalendar.vue'
import { usersStore } from '@/stores/users'

const { getUser } = usersStore()

const shifts = createResource({
	url: "hrms.api.get_shifts",
	auto: true,
	cache: "hrms:shifts",
	makeParams() {
		return {
			employee: getUser().employee?.name || userEmployeeResource.data?.name,
		}
	},
	transform: (data) => {
		return data.map((assignment) => {
			assignment.doctype = "Shift Assignment"
			assignment.is_upcoming = !assignment.end_date || dayjs(assignment.end_date).isAfter(dayjs())
			assignment.shift_dates = getShiftDates(assignment)
			assignment.total_shift_days = getTotalShiftDays(assignment)
			assignment.shift_timing = getShiftTiming(assignment)
			return assignment
		})
	},
})

const upcomingShifts = computed(() => {
	const filteredShifts = shifts.data?.filter((shift) => shift.is_upcoming)

	// show only 5 upcoming shifts
	return filteredShifts?.slice(0, 5)
})
// =========================================
const shiftRequestColors = {
	Draft: 'orange',
	Approved: 'green',
	Rejected: 'red',
}


const emit = defineEmits(['showAttendanceRequestModal', 'showShiftRequestModal', 'showSummaryModal'])


function reload(type){
	switch (type) {
		case 'attendance':
			myAttendanceRequests.reload()
			teamAttendanceRequests.reload()
			break;
		case 'shift':
			shifts.reload()
			break;
	}
	
}
defineExpose({
  reload
})

</script>
