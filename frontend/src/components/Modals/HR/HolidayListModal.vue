<template>
	<Dialog
		v-model="show"
		:options="{
			title: '',
			size: '2xl',
		}"
	>
		<template #body-header>
			<div class="px-6 flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<h3 v-if="title" class="text-2xl font-semibold leading-6 text-ink-gray-9">
						{{ __(title) }}
					</h3>
					<h3 v-else class="text-2xl font-semibold leading-6 text-ink-gray-9">
						{{ __('Holiday List') }}
					</h3>
				</div>
			</div>
		</template>
		<template #body-content>
			<div v-if="title !== 'Upcoming Holidays'" class="py-5 px-6 bg-white">
				<div v-if="list.loading">
					<LoadingIndicator color="#00aa80" class="size-8" />
				</div>
				<template v-if="list.data && list.data.length">
					<div
						v-for="item in list.data"
						:key="item.name"
						class="flex items-center justify-between mt-2 first:mt-0 cursor-pointer py-3 px-2 rounded-md hover:bg-bg-hover group"
						@click="openDate(item.from_date)"
					>
						<div>
							<p class="text-base font-medium text-subheading group-hover:text-white">
								{{ item.leave_type }}
							</p>
						</div>
						<p class="text-base font-bold text-[#666] group-hover:text-white">{{ dayjs(item.from_date).format('ddd, D MMM YYYY') }}</p>
					</div>
				</template>
				<div v-else class="mt-4 text-center">
					<p class="text-ink-gray-6 text-sm">{{ __('No records found') }}</p>
				</div>
			</div>
			<div v-else class="py-5 px-4 bg-white">
				<div v-if="upcomingHolidays.loading">
					<LoadingIndicator color="#00aa80" class="size-8" />
				</div>
				<template v-if="upcomingHolidays.data && upcomingHolidays.data.length">
					<div
						v-for="item in upcomingHolidays.data"
						:key="item.name"
						class="flex items-center justify-between mt-2 first:mt-0 cursor-pointer py-3 px-2 rounded-md hover:bg-bg-hover group"
						@click="openDate(item.holiday_date)"
					>
						<div>
							<p
								class="text-base font-medium text-subheading group-hover:text-white"
							>
								{{ item.description }}
							</p>
						</div>
						<p class="text-base font-bold text-[#666] group-hover:text-white">{{ dayjs(item.holiday_date).format('ddd, D MMM YYYY') }}</p>
					</div>
				</template>
				<div v-else class="mt-2 text-center">
					<p class="text-ink-gray-6 text-sm">{{ __('No upcoming holidays') }}</p>
				</div>
			</div>
		</template>
	</Dialog>

	<Dialog v-model="showPicker" :options="{ title: __('Holiday Date'), size: 'xl' }">
		<template #body-content>
			<div class="px-4 py-4">
				<DateCalender
					v-if="activeDate"
					:model-value="activeDate"
					:readonly="true"
					:disabled-dates="disableExceptActive"
				/>
			</div>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { createListResource, createResource, Dialog, dayjs } from 'frappe-ui'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'

import { ref } from 'vue'
import Switch from '@/components/frappe-ui/Switch.vue'
import DateCalender from '@/components/DateCalender.vue'
import { usersStore } from '@/stores/users'

// i18n helper used in template; declare for TS
declare const __: (key: string, args?: unknown[]) => string

const props = defineProps<{ doctype: string; title: string }>()

const show = defineModel<boolean>({ default: false })
const isAlternateView = ref(false)

const { getUser } = usersStore()

const doctypeFields: Record<string, string[]> = {
	'Leave Application': [
		'name',
		'employee_name',
		'leave_type',
		'from_date',
		'to_date',
		'total_leave_days',
		'status',
	],
}

const list = createListResource({
	doctype: props.doctype,
	fields: doctypeFields[props.doctype] || [],
	filters: { employee: getUser().employee?.name },
	pageLength: 30,
	orderBy: 'creation desc',
	cache: [props.doctype, getUser().employee?.name],
	auto: true,
})

const upcomingHolidays = createResource({
	url: 'revenyu.api.employee.get_upcoming_holidays',
	params: {
		employee: getUser().employee?.name,
		limit: 30,
	},
	auto: true,
	cache: 'upcoming_holiday_dates',
})

const showPicker = ref(false)
const activeDate = ref<Date | null>(null)

function parseDisplayDate(s: string): Date | null {
	// Robust parsing via dayjs; accepts ISO or human-readable
	const d = dayjs(s)
	return d.isValid() ? d.toDate() : null
}

function openDate(date: string) {
	const d = parseDisplayDate(date)
	if (d) {
		activeDate.value = d
		showPicker.value = true
	}
}

function isSameDay(a: Date | null, b: Date | null) {
	if (!a || !b) return false
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	)
}

function disableExceptActive(d: Date) {
	return !isSameDay(d, activeDate.value)
}
</script>
