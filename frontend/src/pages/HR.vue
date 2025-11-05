<template>
	<LayoutHeader>
		<template #left-header>
			<Breadcrumbs :items="breadcrumbs">
				<template #prefix="{ item }">
					<Icon v-if="item.icon" :icon="item.icon" class="mr-2 h-4" />
				</template>
			</Breadcrumbs>
		</template>
		<template #right-header />
	</LayoutHeader>
	<div
		:class="[
			'flex flex-col h-full py-4 px-1  md:h-[calc(100%-88px)] gap-5 bg-inherit dark:bg-dark',
			isMobileView && 'overflow-y-visible !h-fit',
		]"
	>
		<!-- Tabs -->
		<Tabs as="div" v-model="tabIndex" :tabs="tabs" class="w-full overflow-hidden gap-5">
			<template #tab-panel="{ tab }" class="p-8">
				<HomeTab
					v-if="tab.name === 'Home'"
					ref="homeTabRef"
					@showAttendanceRequestModal="showAttendanceRequestModal = true"
					@showShiftRequestModal="showShiftRequestModal = true"
					@showLeaveRequestModal="showLeaveRequestModal = true"
					@showExpenseClaimModal="showExpenseClaimModal = true"
					@showEmployeeAdvanceModal="showEmployeeAdvanceModal = true"
					@downloadSalarySlipPdf="downloadSalarySlipPdf"
				/>
				<AttendanceTab
					v-if="tab.name === 'Attendance'"
					ref="attendanceTabRef"
					@showAttendanceRequestModal="showAttendanceRequestModal = true"
					@showShiftRequestModal="showShiftRequestModal = true"
					@showSummaryModal="(req) => {
						request = req
						showSummaryModal = true
					}"
				/>
				<LeavesTab
					v-if="tab.name === 'Leaves'"
					ref="leavesTabRef"
					@showLeaveRequestModal="showLeaveRequestModal = true"
					@showHolidayList="
						(doctype, title) => {
							holidayDoctype = doctype
							holidayTitle = title
							showHolidayList = true
						}
					"
					@showSummaryModal="(req) => {
						request = req
						showSummaryModal = true
					}"
				/>
				<ExpensesTab
					v-if="tab.name === 'Expenses'"
					ref="expensesTabRef"
					@showExpenseClaimModal="showExpenseClaimModal = true"
					@showEmployeeAdvanceModal="showEmployeeAdvanceModal = true"
					@showSummaryModal="(req) => {
						request = req
						showSummaryModal = true
					}"
				/>
				<SalaryTab
					v-if="tab.name === 'Salary'"
					ref="salariesTabRef"
					@showHRList="
						(doctype) => {
							hrDoctype = doctype
							showHRList = true
						}
					"
					@downloadSalarySlipPdf="downloadSalarySlipPdf"
					@showSummaryModal="(req) => {
						request = req
						showSummaryModal = true
					}"
				/>
			</template>
		</Tabs>
	</div>
	<!-- Modals -->
	<AttendanceRequestModal
		v-if="showAttendanceRequestModal"
		v-model="showAttendanceRequestModal"
		@reload="
			() => {
				attendanceTabRef?.reload('attendance')
				homeTabRef?.reload('attendance')
				showAttendanceRequestModal = false
			}
		"
	/>
	<ShiftRequestModal
		v-if="showShiftRequestModal"
		v-model="showShiftRequestModal"
		@reload="
			() => {
				attendanceTabRef?.reload('shift')
				homeTabRef?.reload('shift')
				showShiftRequestModal = false
			}
		"
	/>
	<LeaveApplicationModal
		v-if="showLeaveRequestModal"
		v-model="showLeaveRequestModal"
		@reload="
			() => {
				leavesTabRef?.reload()
				homeTabRef?.reload('leave')
				showLeaveRequestModal = false
			}
		"
	/>
	<ExpenseClaimModal
		v-if="showExpenseClaimModal"
		v-model="showExpenseClaimModal"
		@reload="
			() => {
				expensesTabRef?.reload('expenses')
				homeTabRef?.reload('expenses')
				showExpenseClaimModal = false
			}
		"
	/>
	<EmployeeAdvanceModal
		v-if="showEmployeeAdvanceModal"
		v-model="showEmployeeAdvanceModal"
		@reload="
			() => {
				expensesTabRef?.reload('advance')
				homeTabRef?.reload('advance')
				showEmployeeAdvanceModal = false
			}
		"
	/>

	<HolidayListModal
		v-if="showHolidayList"
		v-model="showHolidayList"
		:doctype="holidayDoctype"
		:title="holidayTitle"
	/>
	<HRListModal v-if="showHRList" v-model="showHRList" :doctype="hrDoctype" />

	<SummaryRequestModal v-if="showSummaryModal" v-model="showSummaryModal" :data="request" />

</template>
<script setup>
import LayoutHeader from '@/components/LayoutHeader.vue'
import Tabs from '@/components/frappe-ui/Tabs.vue'
import { Breadcrumbs, call, createResource, dayjs, toast } from 'frappe-ui'
import { ref, computed } from 'vue'
import { isMobileView } from '@/composables/settings.js'
import { usersStore } from '@/stores/users'
import { useActiveTabManager } from '@/composables/useActiveTabManager'
import HomeTab from '@/components/HR/HomeTab.vue'
import AttendanceTab from '@/components/HR/AttendanceTab.vue'
import LeavesTab from '@/components/HR/LeavesTab.vue'
import ExpensesTab from '@/components/HR/ExpensesTab.vue'
import SalaryTab from '@/components/HR/SalaryTab.vue'
import AttendanceRequestModal from '@/components/Modals/HR/AttendanceRequestModal.vue'
import ShiftRequestModal from '@/components/Modals/HR/ShiftRequestModal.vue'
import LeaveApplicationModal from '@/components/Modals/HR/LeaveApplicationModal.vue'
import ExpenseClaimModal from '@/components/Modals/HR/ExpenseClaimModal.vue'
import HolidayListModal from '@/components/Modals/HR/HolidayListModal.vue'
import EmployeeAdvanceModal from '@/components/Modals/HR/EmployeeAdvanceModal.vue'
import HRListModal from '@/components/Modals/HR/HRListModal.vue'
import SummaryRequestModal from '@/components/Modals/HR/SummaryRequestModal.vue'

const { getUser } = usersStore()

const homeTabRef = ref(null)
const leavesTabRef = ref(null)
const attendanceTabRef = ref(null)
const expensesTabRef = ref(null)
const salariesTabRef = ref(null)

const breadcrumbs = computed(() => [{ label: 'HR', route: { name: 'HR' } }])

const tabs = computed(() => [
	{ label: __('Home'), name: 'Home' },
	{ label: __('Attendance'), name: 'Attendance' },
	{ label: __('Leaves'), name: 'Leaves' },
	{ label: __('Expenses'), name: 'Expenses' },
	{ label: __('Salary'), name: 'Salary' },
])

// Use the last active tab functionality
const { tabIndex } = useActiveTabManager(tabs, 'lastHRTab')

// Modal states
const showAttendanceRequestModal = ref(false)
const showShiftRequestModal = ref(false)
const showLeaveRequestModal = ref(false)
const showExpenseClaimModal = ref(false)
const showEmployeeAdvanceModal = ref(false)
const showHolidayList = ref(false)
const showHRList = ref(false)

// Modal data
const holidayDoctype = ref('')
const holidayTitle = ref('')
const hrDoctype = ref('')

// Employee data for salary slip download
function downloadSalarySlipPdf() {
	return
	const slip = employeeSalarySlip?.data
	if (!slip || !slip.name) {
		toast.info(__('There is no any slip for current user'))
		return
	}
	// Use Frappe's built-in PDF route for any DocType
	const url = `/api/method/frappe.utils.print_format.download_pdf?doctype=Salary%20Slip&name=${encodeURIComponent(
		slip.name,
	)}&format=Salary%20Slip&no_letterhead=0`
	const link = document.createElement('a')
	link.href = url
	link.target = '_blank'
	link.rel = 'noopener'
	link.click()
}

const request = ref('')
const showSummaryModal = ref(false)

const summaryModal = (req) =>{
	request.value = req
	showSummaryModal.value = true
}

</script>
