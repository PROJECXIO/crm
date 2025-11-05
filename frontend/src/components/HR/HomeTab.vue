<template>
  <div class="pb-2 flex flex-col gap-4">
    <!-- Top greeting card -->
    <div class="w-full rounded-xl  shadow-custom p-5 gap-7">
      <div class="flex flex-col items-center gap-3">
        <h2
          class="text-lg md:text-2xl !font-semibold text-subheading dark:text-gray-100"
        >
          {{ __('Hey, {0} ', [getUser()?.full_name || getUser().email]) }}
          <span
            aria-hidden="true"
            class="text-3xl animate-wave group-hover:[animation-play-state:paused]"
            >👋</span
          >
        </h2>
        <CheckInPanel />
      </div>
    </div>

    <!-- Quick Links row -->
    <div class="flex flex-col shadow-custom rounded-xl p-5 gap-4">
      <h3
        class="text-base md:text-2xl !font-bold text-subheading dark:text-gray-200"
      >
        {{ __('Quick Links') }}
      </h3>
      <div
        class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <div
          v-for="link in quickLinks"
          :key="link.label"
          class="flex flex-col items-center py-5 px-3 gap-2 rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 bg-white"
          style="box-shadow: 0px 0px 20px 0px #0000001a"
          @click="link.onClick"
        >
          <div class="size-5">
            <component :is="link.icon" class="w-5 h-5" />
          </div>
          <p
            class="text-sm md:text-base !font-semibold text-center text-subheading dark:text-gray-200"
          >
            {{ link.label }}
          </p>
        </div>
      </div>
    </div>

    <!-- Requests list -->
    <div class="flex flex-col shadow-custom rounded-xl p-5 gap-4">
      <h3
        class="text-base md:text-2xl !font-bold text-subheading dark:text-gray-200"
      >
        {{ __('Quick Links') }}
      </h3>
      <div class="flex items-center gap-4">
        <Button
          variant="ghost"
          theme="green"
          :class="[
            'rounded-none focus:bg-transparent hover:!bg-transparent !px-0 !text-[#666] text-base md:text-lg pb-3 border-b',
            activeTab === 'My Requests' &&
              '!text-[#00664D] !font-bold border-b-2 border-[#00664D]',
          ]"
          @click="() => (activeTab = 'My Requests')"
          >{{ __('My Requests') }}</Button
        >
        <Button
          variant="ghost"
          theme="green"
          :class="[
            'rounded-none focus:bg-transparent hover:!bg-transparent !px-0 !text-[#666] text-base md:text-lg pb-3 border-b',
            activeTab === 'Team Requests' &&
              '!text-[#00664D] !font-bold border-b-2 border-[#00664D]',
          ]"
          @click="() => (activeTab = 'Team Requests')"
          >{{ __('Team Requests') }}</Button
        >
      </div>
      <!-- My Requests -->
      <div
        v-if="activeTab === 'My Requests'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <template v-if="myRequests">
          <div v-for="req in myRequests" :key="req.name">
            <RequestCard :request="req" @click="summaryModal(req)" />
          </div>
        </template>
        <template v-else>
          <p class="text-lg text-[#666] font-semibold mt-4">
            {{ __('No requests found') }}
          </p>
        </template>
      </div>
      <!-- Team Requests -->
      <div
        v-if="activeTab === 'Team Requests'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <!-- <div v-if="teamRequests.loading">
          <LoadingIndicator color="#00aa88" class="size-10" />
        </div> -->
        <template v-if="teamRequests">
          <div v-for="req in teamRequests" :key="req.name">
            <RequestCard :request="req" @click="summaryModal(req)" />
          </div>
        </template>
        <template v-else>
          <p class="text-lg text-[#666] font-semibold mt-4">
            {{ __('No requests found') }}
          </p>
        </template>
      </div>
    </div>
  </div>
  <SummaryRequestModal
    v-if="showSummaryModal"
    v-model="showSummaryModal"
    :data="request"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Avatar, Badge, call, createResource, dayjs, toast } from 'frappe-ui'
import { usersStore } from '@/stores/users'
import CheckInIcon from '@/components/Icons/CheckInIcon.vue'
import RequestAttendanceIcon from '@/components/Icons/HR/RequestAttendanceIcon.vue'
import RequestShiftIcon from '@/components/Icons/HR/RequestShiftIcon.vue'
import RequestLeaveIcon from '@/components/Icons/HR/RequestLeaveIcon.vue'
import ClaimExpenseIcon from '@/components/Icons/HR/ClaimExpenseIcon.vue'
import RequestAdvanceIcon from '@/components/Icons/HR/RequestAdvanceIcon.vue'
import SalarySlipIcon from '@/components/Icons/HR/SalarySlipIcon.vue'
import RequestCard from '@/components/HR/RequestCard.vue'
// api
import { myLeaves, teamLeaves } from '@/data/leaves'
import { myClaims, teamClaims } from '@/data/claims'
import { advanceBalance } from '@/data/advances'
import {
  myAttendanceRequests,
  myShiftRequests,
  teamAttendanceRequests,
  teamShiftRequests,
} from '@/data/attendance'
import CheckInPanel from '@/components/HR/CheckInPanel.vue'
//

const { getUser } = usersStore()
const activeTab = ref('My Requests')

const myRequests = computed(() =>
  updateRequestDetails(
    myLeaves,
    myClaims,
    myShiftRequests,
    myAttendanceRequests,
  ),
)
console.log({ myRequests })
const teamRequests = computed(() =>
  updateRequestDetails(
    teamLeaves,
    teamClaims,
    teamShiftRequests,
    teamAttendanceRequests,
  ),
)

function updateRequestDetails(
  leaves,
  claims,
  shiftRequests,
  attendanceRequests,
) {
  const requests = [leaves, claims, shiftRequests, attendanceRequests].reduce(
    (acc, resource) => acc.concat(resource?.data || []),
    [],
  )

  return getSortedRequests(requests)
}

function getSortedRequests(list) {
  // return top 10 requests sorted by posting date
  return list
    .sort((a, b) => {
      return new Date(b.creation) - new Date(a.creation)
    })
    .splice(0, 10)
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const quickLinks = computed(() => [
  {
    label: __('Request Attendance'),
    icon: RequestAttendanceIcon,
    onClick: () => emit('showAttendanceRequestModal'),
  },
  {
    label: __('Request a Shift'),
    icon: RequestShiftIcon,
    onClick: () => emit('showShiftRequestModal'),
  },
  {
    label: __('Request Leave'),
    icon: RequestLeaveIcon,
    onClick: () => emit('showLeaveRequestModal'),
  },
  {
    label: __('Claim an Expense'),
    icon: ClaimExpenseIcon,
    onClick: () => emit('showExpenseClaimModal'),
  },
  {
    label: __('Request an Advance'),
    icon: RequestAdvanceIcon,
    onClick: () => emit('showEmployeeAdvanceModal'),
  },
  {
    label: __('View Salary Slips'),
    icon: SalarySlipIcon,
    onClick: () => emit('downloadSalarySlipPdf'),
  },
])

const request = ref('')
const showSummaryModal = ref(false)

const summaryModal = (req) => {
  request.value = req
  showSummaryModal.value = true
}

const emit = defineEmits([
  'showAttendanceRequestModal',
  'showShiftRequestModal',
  'showLeaveRequestModal',
  'showExpenseClaimModal',
  'showEmployeeAdvanceModal',
  'downloadSalarySlipPdf',
])

function reload(type) {
  switch (type) {
    case 'attendance':
      myAttendanceRequests.reload()
      teamAttendanceRequests.reload()
      break
    case 'shift':
      shifts.reload()
      break
    case 'leave':
      myLeaves.reload()
      teamLeaves.reload()
      break
    case 'expenses':
      myClaims.reload()
      teamClaims.reload()
      break
    case 'advance':
      advanceBalance.reload()
      break
  }
}

defineExpose({
  reload,
})
</script>
