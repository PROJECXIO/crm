<template>
  <div class="pb-2 md:px-8 flex flex-col gap-4">
    <!-- recent structures -->
    <div
      class="rounded-xl p-2 md:p-5"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-2xl !font-bold text-subheading">
          {{ __('Recent Salary Structure:') }}
        </h2>
        <Button
          theme="green"
          variant="ghost"
          :label="__('View List')"
          icon-left="eye"
          class="hover:bg-transparent focus:!bg-transparent font-bold"
          @click="
            () => {
              emit('showHRList', 'Salary Structure')
            }
          "
        />
      </div>
      <div
        v-if="recentSalStructure?.loading"
        class="w-full flex items-center justify-center"
      >
        <LoadingIndicator color="#00aa80" class="size-8" />
      </div>
      <div
        v-if="recentSalStructure?.data?.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
      >
        <div
          v-for="sal in recentSalStructure.data"
          :key="sal.name"
          @click="
            emit('showSummaryModal', { ...sal, doctype: 'Salary Structure' })
          "
          class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:translate-y-1 transition-transform duration-300"
          style="box-shadow: 0px 0px 20px 0px #0000001a"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-1">
              <p
                class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
              >
                {{ sal.name }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <Badge
                :label="sal.is_active === 'Yes' ? 'Active' : 'Inactive'"
                class="rounded-sm"
                :theme="sal.is_active === 'Yes' ? 'green' : 'red'"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-base md:text-lg !font-bold text-[#00664D]">
              {{ sal.payroll_frequency }}
            </p>
            <p class="text-xs font-medium text-[#666] dark:text-gray-400">
              {{ dayjs(sal.creation).format('DD MMMM') }}
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
    <!-- recent slips -->
    <div
      class="rounded-xl p-2 md:p-5"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-2xl !font-bold text-subheading">
          {{ __('Recent Salary Slips:') }}
        </h2>
        <Button
          theme="green"
          variant="ghost"
          :label="__('View List')"
          icon-left="eye"
          class="hover:bg-transparent focus:!bg-transparent font-bold"
          @click="
            () => {
              emit('showHRList', 'Salary Slip')
            }
          "
        />
      </div>
      <div
        v-if="recentSlips.loading"
        class="w-full flex items-center justify-center"
      >
        <LoadingIndicator color="#00aa80" class="size-8" />
      </div>
      <div
        v-if="recentSlips?.data?.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
      >
        <div
          v-for="sal in recentSlips.data"
          :key="sal.name"
          @click="emit('showSummaryModal', { ...sal, doctype: 'Salary Slip' })"
          class="flex flex-col bg-white dark:bg-gray-900 rounded-xl p-4 gap-4 cursor-pointer hover:-translate-y-1 transition-transform duration-300"
          style="box-shadow: 0px 0px 20px 0px #0000001a"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-1">
              <p
                class="text-base md:text-lg !font-medium text-subheading dark:text-gray-100"
              >
                {{ sal.employee_name }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <Badge :label="sal.status" class="rounded-sm" />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-base md:text-lg !font-bold text-[#00664D]">
              {{
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: sal.currency,
                }).format(sal.net_pay)
              }}
            </p>
            <p class="text-xs font-medium text-[#666] dark:text-gray-400">
              {{ dayjs(sal.posting_date).format('DD MMMM') }}
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
    <!-- last slip details -->
    <div
      class="rounded-xl p-2 md:p-5"
      style="box-shadow: -9px 9px 40px 0px #00000014"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl !font-bold text-subheading">
          {{ __('Last Salary Slip Details:') }}
        </h2>
        <div v-if="Object.values(employeeSalarySlip).length > 0">
          <div class="w-fit md:w-2/3 mx-auto shadow-md rounded-md p-3 bg-white">
            <div class="flex justify-end">
              <Button
                icon="download"
                theme="green"
                variant="solid"
                @click="downloadSalarySlipPdf"
              />
            </div>
            <h3 class="text-center text-subheading font-semibold border-b pb-2">
              {{ employeeSalarySlip.employee_name }}
            </h3>
            <div class="p-2 mt-2">
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-1">
                    <p class="text-sm">{{ __('Company') }}:</p>
                    <p class="text-sm">
                      {{ employeeSalarySlip.company }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <p class="text-sm">{{ __('Salary Structure') }}:</p>
                    <p class="text-sm">
                      {{ employeeSalarySlip.salary_structure }}
                    </p>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-1">
                    <p class="text-sm">{{ __('Posting Date') }}:</p>
                    <p class="text-sm">
                      {{ employeeSalarySlip.posting_date }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <p class="text-sm">{{ __('Status') }}:</p>
                    <p class="text-sm">
                      {{ employeeSalarySlip.status }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <p class="text-sm">{{ __('Currency') }}:</p>
                    <p class="text-sm">
                      {{ employeeSalarySlip.currency }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3 mt-2">
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-subheading">
                    {{ __('Earnings') }}:
                  </h3>
                  <table class="table w-full">
                    <thead>
                      <tr class="">
                        <th
                          colspan="2"
                          class="text-start border border-gray-300 px-4 py-2 w-3/4"
                        >
                          <span class="text-base">{{ __('Component') }}</span>
                        </th>
                        <th class="text-start border border-gray-300 px-4 py-2">
                          <span class="text-base">{{ __('Amount') }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in employeeSalarySlip.earnings">
                        <td
                          colspan="2"
                          class="text-sm font-semibold border border-gray-300 px-4 py-1"
                        >
                          {{ row.salary_component }}
                        </td>
                        <td
                          class="text-sm font-semibold border border-gray-300 px-4 py-1"
                        >
                          {{
                            formatCurrency(
                              row.amount,
                              employeeSalarySlip.currency,
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 class="text-lg font-semibold text-subheading">
                    {{ __('Deductions') }}:
                  </h3>
                  <table class="table w-full">
                    <thead>
                      <tr class="">
                        <th
                          colspan="2"
                          class="text-start border border-gray-300 px-4 py-2 w-3/4"
                        >
                          <span class="text-base">{{ __('Component') }}</span>
                        </th>
                        <th class="text-start border border-gray-300 px-4 py-2">
                          <span class="text-base">{{ __('Amount') }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in employeeSalarySlip.deductions">
                        <td
                          colspan="2"
                          class="text-sm font-semibold border border-gray-300 px-4 py-1"
                        >
                          {{ row.salary_component }}
                        </td>
                        <td
                          class="text-sm font-semibold border border-gray-300 px-4 py-1"
                        >
                          {{
                            formatCurrency(
                              row.amount,
                              employeeSalarySlip.currency,
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-semibold text-subheading mb-2">
                      {{ __('Totals') }}:
                    </h3>
                    <div class="flex items-center gap-1">
                      <p class="text-base font-semibold text-subheading">
                        {{ __('Gross Pay') }}:
                      </p>
                      <p class="text-base font-semibold">
                        {{
                          formatCurrency(
                            employeeSalarySlip.gross_pay,
                            employeeSalarySlip.currency,
                          )
                        }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                      <p class="text-base font-semibold text-subheading">
                        {{ __('Gross Year To Date') }}:
                      </p>
                      <p class="text-base font-semibold">
                        {{
                          formatCurrency(
                            employeeSalarySlip.gross_year_to_date,
                            employeeSalarySlip.currency,
                          )
                        }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                      <p class="text-base font-semibold text-subheading">
                        {{ __('Total Deductions') }}:
                      </p>
                      <p class="text-base font-semibold">
                        {{
                          formatCurrency(
                            employeeSalarySlip.total_deduction,
                            employeeSalarySlip.currency,
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-subheading mb-2">
                      {{ __('Net Pay Info') }}:
                    </h3>
                    <div class="flex items-center gap-1">
                      <p class="text-base font-semibold text-subheading">
                        {{ __('Net Pay') }}:
                      </p>
                      <p class="text-base font-semibold">
                        {{
                          formatCurrency(
                            employeeSalarySlip.net_pay,
                            employeeSalarySlip.currency,
                          )
                        }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                      <p class="text-base font-semibold text-subheading">
                        {{ __('Rounded Total') }}:
                      </p>
                      <p class="text-base font-semibold">
                        {{
                          formatCurrency(
                            employeeSalarySlip.rounded_total,
                            employeeSalarySlip.currency,
                          )
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center">
          <p class="text-[#666] font-semibold">
            {{ __('Add slip to see the details for last salary slip') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createListResource, dayjs, toast } from 'frappe-ui'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import { userEmployeeResource } from '@/stores/user'
import { computed } from 'vue'
import { formatCurrency } from '@/utils/numberFormat'

const recentSlips = createListResource({
  doctype: 'Salary Slip',
  fields: [
    'name',
    'employee',
    'employee_name',
    'posting_date',
    'payroll_frequency',
    'net_pay',
    'currency',
    'status',
  ],
  pageLength: 5,
  orderBy: 'creation desc',
  cache: 'salary_slips',
  auto: true,
})

const employeeSalarySlip = computed(() => {
  if (!recentSlips.data?.length) return {}
  let lastSlip = recentSlips.data?.filter(
    (el) => el.employee == getUser().employee?.name || userEmployeeResource.data?.name,
  )
  if (lastSlip.length > 0) return lastSlip[0]
  return recentSlips.data?.[0]
})

const recentSalStructure = createListResource({
  doctype: 'Salary Structure',
  fields: [
    'name',
    'is_active',
    'company',
    'payroll_frequency',
    'currency',
    'creation',
  ],
  pageLength: 5,
  orderBy: 'creation desc',
  cache: 'salary_structures',
  auto: true,
})

function downloadSalarySlipPdf() {
  const slip = employeeSalarySlip.value
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

const emit = defineEmits([
  'showHRList',
  'downloadSalarySlipPdf',
  'showSummaryModal',
])
</script>
