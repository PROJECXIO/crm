<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:-rotate-1 transition-transform duration-300"
    style="box-shadow: 0px 0px 20px 0px #0000001a"
  >
    <div class="flex items-start justify-between">
      <div v-if="attendance" class="space-y-2">
        <div>
          <Avatar size="sm" shape="square" :label="request.employee_name" />
        <span class="text-lg font-medium text-[#666]">{{
          request.employee_name || request.employee
        }}</span>
        </div>
              <div
        class="flex items-center gap-1"
      >
        <RequestLeaveIcon class="w-4 h-4" />
        <div class="flex items-center gap-2">
          <p
            class="text-base md:text-lg !font-medium text-[#666] italic dark:text-gray-100"
          >
            {{ getDoctypeLabel(request.doctype) }}
          </p>
        </div>
      </div>
      </div>
      <div
      v-else
        class="flex items-center gap-1"
      >
        <RequestLeaveIcon class="w-4 h-4" />
        <div class="flex items-center gap-2">
          <p
            class="text-base md:text-lg !font-medium text-[#666] italic dark:text-gray-100"
          >
            {{ getDoctypeLabel(request.doctype) }}
          </p>
        </div>
      </div>
      <div v-if="request.status" class="flex items-center gap-3">
        <Badge
          :theme="request.status === 'Approved' ? 'green' : 'red'"
          :label="request.status"
          class="rounded-sm"
        />
        <ArrowRightIcon class="size-5" />
      </div>
      <div v-else-if="request.hasOwnProperty('docstatus')" class="flex items-center gap-3">
        <Badge
          :theme="getDocstatusTheme(request.docstatus)"
          :label="getDocstatusLabel(request.docstatus)"
          class="rounded-sm"
        />
        <ArrowRightIcon class="size-5" />
      </div>
    </div>
    <p class="mt-1 text-xs text-[#666] dark:text-gray-400">
      {{ dayjs(request.from_date).format('DD MMM') }}
      <span v-if="request.to_date">
        - {{ dayjs(request.to_date).format('DD MMM') }} /
        {{ dayjs(request.to_date).diff(request.from_date, 'days') || 1 }}
      </span>
    </p>
    <div v-if="!attendance" class="flex items-center gap-1">
      <Avatar size="sm" shape="square" :label="request.employee_name" />
      <span class="text-lg font-medium text-[#666]">{{
        request.employee_name || request.employee
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { Avatar, Badge, dayjs } from 'frappe-ui'
import RequestLeaveIcon from '@/components/Icons/HR/RequestLeaveIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'

const props = defineProps({
  request: {
    type: Object,
  },
  attendance: {
    type: Boolean,
    default: false,
  },
})

const getDoctypeLabel = doctype => {
  switch(doctype){
    case 'Leave Application':
      return "Leave"
    case "Attendance Request":
      return "Attendance"
    case "Shift Request":
      return "Shift"
    case "Employee Advance":
      return "Advance"
    default:
      return "Request"
  }
}

const getDocstatusTheme = docstatus => {
  switch(docstatus){
    case 0:
      return "orange"
    case 1:
      return "green"
    case 2:
      return "red"
  }
}

const getDocstatusLabel = docstatus => {
  switch(docstatus){
    case 0:
      return "Draft"
    case 1:
      return "Submitted"
    case 2:
      return "Cancelled"
  }
}
</script>
