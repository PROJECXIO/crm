<template>
  <div class="pb-2 md:px-8 flex flex-col gap-4">
    <!-- total claimed amount -->
    <div v-if="summary.loading">
      <LoadingIndicator color="#00aa80" class="size-8" />
    </div>
    <div
      v-if="summary.data"
      class="rounded-xl p-2 md:p-5 bg-white flex flex-col gap-7"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <h2 class="text-2xl !font-bold text-subheading">
        {{ __('Total Claimed Amount:') }}
      </h2>
      <div class="flex items-center flex-col gap-6">
        <h3 class="font-bold text-[48px] text-[#00664D]">
          {{ formatCurrency(total_claimed_amount, company_currency) }}
        </h3>
        <div class="flex flex-row justify-between">
          <div class="w-fit md:w-44 rounded-md py-3 px-5 flex flex-col items-center gap-1">
            <div class="flex flex-row gap-1 items-center">
              <span class="text-gray-600 text-sm font-medium leading-5">
                {{ __('Pending') }}
              </span>
              <FeatherIcon
                name="alert-circle"
                class="text-yellow-500 h-3 w-3"
              />
            </div>
            <span class="text-gray-800 text-base font-semibold leading-6">
              {{
                formatCurrency(
                  summary.data?.total_pending_amount,
                  company_currency,
                )
              }}
            </span>
          </div>
          <div class="w-fit md:w-44 rounded-md py-3 px-5 flex flex-col items-center gap-1">
            <div class="flex flex-row gap-1 items-center">
              <span class="text-gray-600 text-sm font-medium leading-5">
                {{ __('Approved') }}
              </span>
              <FeatherIcon name="check-circle" class="text-green-500 h-3 w-3" />
            </div>
            <span class="text-gray-800 text-base font-semibold leading-6">
              {{
                formatCurrency(
                  summary.data?.total_approved_amount,
                  company_currency,
                )
              }}
            </span>
          </div>

          <div class="w-fit md:w-44 rounded-md py-3 px-5 flex flex-col items-center gap-1">
            <div class="flex flex-row gap-1 items-center">
              <span class="text-gray-600 text-sm font-medium leading-5">
                {{ __('Rejected') }}
              </span>
              <FeatherIcon name="x-circle" class="text-red-500 h-3 w-3" />
            </div>
            <span class="text-gray-800 text-base font-semibold leading-6">
              {{
                formatCurrency(
                  summary.data?.total_rejected_amount +
                    (summary.data?.total_claimed_in_approved -
                      summary.data?.total_approved_amount),
                  company_currency,
                )
              }}
            </span>
          </div>
        </div>
      </div>
      <Button
        theme="green"
        variant="solid"
        size="lg"
        :label="__('Claim Expenses')"
        class="w-full"
        @click="emit('showExpenseClaimModal')"
      />
    </div>
    <!-- recent expenses -->
    <div
      class="rounded-xl p-2 md:p-5"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <h2 class="text-2xl !font-bold text-subheading">
        {{ __('Recent Expenses:') }}
      </h2>
      <div
        v-if="myClaims?.loading"
        class="w-full flex items-center justify-center"
      >
        <LoadingIndicator color="#00aa80" class="size-8" />
      </div>
      <div
        v-if="myClaims?.data?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4"
      >
        <div
          v-for="expe in myClaims.data"
          @click="
            emit('showSummaryModal', { ...expe, doctype: 'Expense Claim' })
          "
          class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:translate-x-1 transition-transform duration-300"
          style="box-shadow: 0px 0px 20px 0px #0000001a"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-1">
              <p
                class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
              >
                {{ expe.employee_name }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <Badge
                :theme="shiftRequestColors[expe.approval_status]"
                :label="expe.approval_status"
                class="rounded-sm"
              />
            </div>
          </div>
          <div class="flex items-center justify-between flex-wrap gap-y-1">
            <p class="text-base md:text-lg !font-bold text-[#00664D]">
              {{ formatCurrency(expe.total_claimed_amount, company_currency) }}
            </p>
            <p class="text-xs font-medium text-[#666] dark:text-gray-400">
              {{ dayjs(expe.posting_date).format('DD MMMM') }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="mt-5 text-center">
        <p class="text-lg text-gray-400 font-bold">
          {{ __('There is no data to show') }}
        </p>
      </div>
    </div>
    <!-- advance balance -->
    <div
      class="rounded-xl p-2 md:p-5"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-2xl !font-bold text-subheading">
          {{ __('Recent Advance:') }}
        </h2>
        <Button
          :label="__('View List')"
          iconLeft="eye"
          variant="ghost"
          theme="green"
          class="font-bold hover:bg-transparent focus:!bg-transparent hover:underline"
        />
      </div>
      <div class="flex flex-col gap-4">
        <div
          v-if="advanceBalance.loading"
          class="flex items-center justify-center"
        >
          <LoadingIndicator class="size-10" color="green" />
        </div>
        <div
          v-if="advanceBalance.data"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
        >
          <div
            v-for="advance in advanceBalance.data"
            @click="
              emit('showSummaryModal', {
                ...advance,
                doctype: 'Employee Advance',
              })
            "
            :key="advance.name"
            class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:translate-x-1 transition-all duration-300"
          >
            <div class="flex items-center justify-between">
              <div class="space-y-2">
                <p class="text-base md:text-lg !font-bold text-[#00664D]">
                  {{ __('Total') }}:
                  {{
                    formatCurrency(advance.advance_amount, '', advance.currency)
                  }}
                </p>
                <p class="text-base md:text-lg !font-bold text-[#00664D]">
                  {{ __('Paid') }}:
                  {{
                    formatCurrency(advance.paid_amount, '', advance.currency)
                  }}
                </p>
              </div>
              <p class="text-base md:text-lg !font-semibold text-subheading">
                {{ advance.employee_name }}
              </p>
            </div>

            <p class="text-xs font-medium text-[#666]">
              {{ __('Advance taken on') }}
              {{ dayjs(advance.posting_date).format('DD MMMM, YYYY') }}
            </p>
            <div class="flex flex-col gap-2">
              <div class="flex items-center">
                <p class="text-xs font-bold text-[#666]">
                  {{ __(`Progress`) }}:
                  {{ getWidth(advance.paid_amount, advance.advance_amount) }}%
                </p>
              </div>
              <div class="w-full h-0.5 bg-gray-100">
                <div
                  class="h-full bg-bg-green"
                  :style="`width: ${getWidth(advance.paid_amount, advance.advance_amount)};`"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-[#666] text-lg mt-3 font-semibold">
            {{ __('No Employee Advance yet') }}
          </p>
        </div>
        <Button
          theme="green"
          variant="solid"
          size="lg"
          :label="__('Request Advance')"
          @click="emit('showEmployeeAdvanceModal')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { dayjs } from 'frappe-ui'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import { computed } from 'vue'
import { formatCurrency } from '@/utils/numberFormat'
import { expenseClaimSummary as summary } from '@/data/claims'
import { myClaims, teamClaims } from '@/data/claims'
import { advanceBalance } from '@/data/advances'

const total_claimed_amount = computed(() => {
  return (
    summary.data?.total_pending_amount +
    summary.data?.total_claimed_in_approved +
    summary.data?.total_rejected_amount
  )
})

const company_currency = computed(() => summary.data?.currency)

const shiftRequestColors = {
  Draft: 'orange',
  Approved: 'green',
  Rejected: 'red',
}

const getWidth = (paid, advance) => (paid / advance) * 100

const emit = defineEmits([
  'showExpenseClaimModal',
  'showEmployeeAdvanceModal',
  'showSummaryModal',
])

function reload(type) {
  switch (type) {
    case 'expenses':
      recentExpenses.reload()
      break
    case 'advance':
      myClaims.reload()
      teamClaims.reload()
      break
  }
}

defineExpose({
  reload,
})
</script>
