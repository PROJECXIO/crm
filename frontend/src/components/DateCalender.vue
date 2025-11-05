<template>
	<div class="px-4 py-3 w-max md:w-112 mx-auto flex flex-col">
		<!-- Header -->
		<div class="flex items-center justify-center mb-2 border-b pb-4">
			<Button theme="green" variant="subtle" :icon="ArrowLeftIcon" @click="prev" :disabled="readonly" />
			<Button
				variant="ghost"
				theme="green"
				class="px-3 py-1 rounded font-medium hover:bg-transparent focus:!bg-transparent"
				:disabled="readonly"
				@click="toggleYearPicker"
			>
				{{ monthFormatter.format(viewDate) }} {{ yearFormatter.format(viewDate) }}
			</Button>
			<Button theme="green" variant="subtle" :icon="ArrowRightIcon" @click="next" :disabled="readonly" />
		</div>

		<!-- Year picker -->
		<div v-if="showYearPicker" class="grid grid-cols-4 gap-2 mb-2 transition-all duration-300 max-h-64 overflow-y-auto">
			<Button
				theme="green"
				:variant="getYear(viewDate) === y ? 'solid' : 'outline'"
				v-for="y in yearsGrid"
				:key="y"
				class="mx-auto !py-4"
				:class="[
					getYear(viewDate) === y ? 'text-white' : 'text-subheading',
					'font-semibold',
				]"
				@click="() => setYear(y)"
			>
				{{ y }}
			</Button>
		</div>
		<!-- Weekday header -->
		<div class="grid grid-cols-7 text-lg font-bold text-subheading mt-4">
			<div v-for="(d, i) in weekdayLabels" :key="i" class="text-center py-1">
				{{ d }}
			</div>
		</div>

		<!-- Month grid -->
		<div class="grid grid-cols-7 gap-1" @keydown="onKeydown" role="grid" aria-label="Calendar">
			<Button
				:variant="cell.isSelected ? 'solid' : 'ghost'"
				theme="green"
				:size="isMobileView ? 'md' : 'lg'"
				v-for="cell in monthCells"
				:key="cell.key"
				class=" mx-auto !aspect-square"
				:disabled="cell.disabled"
				:aria-disabled="cell.disabled ? 'true' : 'false'"
				:aria-current="cell.isToday ? 'date' : undefined"
				:aria-selected="cell.isSelected ? 'true' : 'false'"
				:tabindex="cell.isFocusable ? 0 : -1"
				type="button"
				@click="() => onSelect(cell.date)"
				@focus="() => (focusedDate = cell.date)"
			>
				<span>{{ cell.display }} </span>
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { isMobileView } from '@/composables/settings'
import ArrowRightIcon from "@/components/Icons/ArrowRightIcon.vue"
import ArrowLeftIcon from "@/components/Icons/ArrowLeftIcon.vue"
 
const props = defineProps<{
	modelValue?: Date | null
	minDate?: Date | string | number | null
	maxDate?: Date | string | number | null
	disabledDates?: ((d: Date) => boolean) | null
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	locale?: string
	showOutsideDays?: boolean
	readonly?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', v: any): void
	(e: 'change', v: any): void
	(e: 'month-change', v: { month: number; year: number; date: Date }): void
}>()

// Defaults
const firstDayOfWeek = props.firstDayOfWeek ?? 0
const locale = props.locale ?? 'en-US'
const showOutsideDays = props.showOutsideDays ?? true

// ----- Local utilities (compatible with frappe utils) ---------------------
const toDate = (v: any) => (v instanceof Date ? new Date(v) : v ? new Date(v) : null)
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
const getYear = (d: Date) => d.getFullYear()
const isSameDay = (a?: Date | null, b?: Date | null) =>
	!!a &&
	!!b &&
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate()

function startOfWeek(d: Date, first = 0) {
	const day = (d.getDay() - first + 7) % 7
	return addDays(startOfDay(d), -day)
}

// ----- Core state (would come from useDatePicker in frappe) ---------------
const today = startOfDay(new Date())
const viewDate = ref<Date>(
	startOfDay(toDate(props.modelValue) || today),
)
const focusedDate = ref<Date>(viewDate.value)

 

// Emit when month/year of viewDate changes (e.g., next/prev, year pick, page keys)
const lastMonthYear = ref<{ month: number; year: number }>({
	month: viewDate.value.getMonth(),
	year: viewDate.value.getFullYear(),
})
watch(
	() => viewDate.value,
	(d) => {
		const m = d.getMonth()
		const y = d.getFullYear()
		if (m !== lastMonthYear.value.month || y !== lastMonthYear.value.year) {
			lastMonthYear.value = { month: m, year: y }
			emit('month-change', { month: m + 1, year: y, date: new Date(d) })
		}
	},
)

watch(
	() => props.modelValue,
	(v) => {
		const d = toDate(v)
		if (d) viewDate.value = startOfDay(d)
	},
)

// ----- i18n formatters ----------------------------------------------------
const monthFormatter = computed(() => new Intl.DateTimeFormat(locale, { month: 'short' }))
const yearFormatter = computed(() => new Intl.DateTimeFormat(locale, { year: 'numeric' }))
const dayFormatter = computed(() => new Intl.DateTimeFormat(locale, { day: 'numeric' }))
const weekdayFormatter = computed(() => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }))

const weekdayLabels = computed(() => {
	const start = startOfWeek(viewDate.value, firstDayOfWeek)
	return [...Array(7).keys()].map((i) => weekdayFormatter.value.format(addDays(start, i)))
})

// ----- Month grid ---------------------------------------------------------
const monthCells = computed(() => {
	const startMonth = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), 1)
	const start = startOfWeek(startMonth, firstDayOfWeek)
	const total = 42
	const res: any[] = []
	for (let i = 0; i < total; i++) {
		const date = addDays(start, i)
		const inCurrent = date.getMonth() === viewDate.value.getMonth()
		const outside = !inCurrent

		const min = props.minDate ? toDate(props.minDate) : null
		const max = props.maxDate ? toDate(props.maxDate) : null
		const isMin = min ? startOfDay(date) < startOfDay(min) : false
		const isMax = max ? startOfDay(date) > startOfDay(max) : false
		const isDisabledByFn = props.disabledDates ? !!props.disabledDates(date) : false
		const disabled = isMin || isMax || isDisabledByFn || (!showOutsideDays && outside)

		const isToday = isSameDay(date, today)

		let isSelected = false

		const sel = toDate(props.modelValue)
		isSelected = sel ? isSameDay(date, sel) : false

		const isFocusable = isSameDay(date, focusedDate.value)

		res.push({
			key: +date,
			date,
			display: dayFormatter.value.format(date),
			outside,
			disabled,
			isToday,
			isSelected,
			isFocusable,
		})
	}
	return res
})

// ----- Year Picker --------------------------------------------------------
const showYearPicker = ref(false)
const yearPageSize = 16
const yearPageStart = ref(getYear(viewDate.value) - Math.floor(yearPageSize / 2) + 1)
const yearsGrid = computed(() => {
	return Array.from({ length: yearPageSize }, (_, i) => yearPageStart.value + i)
})
const setYear = (y: number) => {
	viewDate.value = new Date(y, viewDate.value.getMonth(), 1)
	showYearPicker.value = false
}
const toggleYearPicker = () => {
	if (!showYearPicker.value) {
		const base = getYear(viewDate.value)
		yearPageStart.value = base - Math.floor(yearPageSize / 2) + 1
	}
	showYearPicker.value = !showYearPicker.value
}

// ----- Navigation ---------------------------------------------------------
const prev = () => {
	if (showYearPicker.value) {
		yearPageStart.value -= yearPageSize
		return
	}
	viewDate.value = addMonths(viewDate.value, -1)
	focusedDate.value = new Date(viewDate.value)
}
const next = () => {
	if (showYearPicker.value) {
		yearPageStart.value += yearPageSize
		return
	}
	viewDate.value = addMonths(viewDate.value, 1)
	focusedDate.value = new Date(viewDate.value)
}
const goToToday = () => {
	viewDate.value = new Date(today)
	focusedDate.value = new Date(today)
	selectSingle(today)
}

// ----- Selection ----------------------------------------------------------
const onSelect = (date: Date) => {
	if (props.readonly) return
	selectSingle(date)
}

const isDisabled = (date: Date) => {
	const s = startOfDay(date)
	const min = props.minDate ? toDate(props.minDate) : null
	const max = props.maxDate ? toDate(props.maxDate) : null
	if (min && s < startOfDay(min)) return true
	if (max && s > startOfDay(max)) return true
	if (props.disabledDates && props.disabledDates(date)) return true
	return false
}

const selectSingle = (date: Date) => {
	if (isDisabled(date)) return
	const d = startOfDay(date)
	emit('update:modelValue', d)
	emit('change', d)
}

// ----- Keyboard a11y ------------------------------------------------------
const onKeydown = (e: KeyboardEvent) => {
	if (props.readonly) {
		e.preventDefault()
		return
	}
	let handled = true
	switch (e.key) {
		case 'ArrowLeft':
			focusedDate.value = addDays(focusedDate.value, -1)
			break
		case 'ArrowRight':
			focusedDate.value = addDays(focusedDate.value, 1)
			break
		case 'ArrowUp':
			focusedDate.value = addDays(focusedDate.value, -7)
			break
		case 'ArrowDown':
			focusedDate.value = addDays(focusedDate.value, 7)
			break
		case 'PageUp':
			focusedDate.value = addMonths(focusedDate.value, -1)
			viewDate.value = addMonths(viewDate.value, -1)
			break
		case 'PageDown':
			focusedDate.value = addMonths(focusedDate.value, 1)
			viewDate.value = addMonths(viewDate.value, 1)
			break
		case 'Home':
			focusedDate.value = new Date(
				focusedDate.value.getFullYear(),
				focusedDate.value.getMonth(),
				1,
			)
			break
		case 'End':
			focusedDate.value = new Date(
				focusedDate.value.getFullYear(),
				focusedDate.value.getMonth() + 1,
				0,
			)
			break
		case 'Enter':
		case ' ': // space
			onSelect(focusedDate.value)
			break
		default:
			handled = false
	}
	if (handled) e.preventDefault()
}

// ----- Display ------------------------------------------------------------
const view = ref<'month'>('month')

// expose to template
defineExpose({
	view,
	viewDate,
	monthCells,
	weekdayLabels,
	monthFormatter,
	yearFormatter,
	yearsGrid,
	showYearPicker,
})
</script>

<style scoped>
:host,
.datepicker {
	font-family:
		ui-sans-serif,
		system-ui,
		-apple-system,
		Segoe UI,
		Roboto,
		Ubuntu,
		Cantarell,
		Noto Sans,
		Helvetica Neue,
		Arial,
		'Apple Color Emoji',
		'Segoe UI Emoji';
}

button {
	transition:
		background 120ms ease,
		color 120ms ease,
		box-shadow 120ms ease;
}
</style>
