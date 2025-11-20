<template>
  <div class="flex flex-col h-full overflow-hidden">
    <LayoutHeader>
      <template #left-header>
        <ViewBreadcrumbs routeName="Dashboard" />
      </template>
      <template #right-header>
        <Button
          v-if="!editing"
          :title="__('Refresh')"
          class="h-12 w-12 !font-bold !gap-1"
          :icon="LucideRefreshCcw"
          @click="dashboardItems.reload"
          variant="solid"
          theme="green"
          size="lg"
        />
        <Button
          v-if="!editing && isAdmin()"
          :title="__('Edit')"
          class="h-12 w-12 !font-bold !gap-1"
          :icon="LucidePenLine"
          @click="enableEditing"
          variant="solid"
          theme="purple"
          size="lg"
        />

        <Button
          v-if="editing"
          class="h-12 !gap-1"
          :label="__('Chart')"
          iconLeft="plus"
          @click="showAddChartModal = true"
          variant="solid"
          theme="green"
        />
        <Button
          v-if="editing && isAdmin()"
          :label="__('Reset')"
          class="h-12 !gap-1"
          :iconLeft="LucideUndo2"
          @click="resetToDefault"
          variant="outline"
          theme="red"
        />
        <Button
          v-if="editing"
          class="h-12!gap-1"
          :label="__('Cancel')"
          iconLeft="x"
          @click="cancel"
          variant="solid"
          theme="red"
        />
        <Button
          v-if="editing"
          class="h-12 !gap-1"
          variant="solid"
          :label="__('Save')"
          iconLeft="save"
          :disabled="!dirty"
          :loading="saveDashboard.loading"
          @click="save"
          theme="green"
        />
        <div class="border border-r border-purple-100 w-px h-10" />
      </template>
    </LayoutHeader>

    <div class="p-5 pb-2 flex items-center gap-4">
      <Dropdown
        v-if="!showDatePicker"
        :options="options"
        class="form-control"
        v-model="preset"
        :placeholder="__('Select Range')"
        :button="{
          label: __(preset),
          class:
            '!w-full justify-start [&>span]:mr-auto [&>svg]:text-ink-gray-5 ',
          variant: 'outline',
          iconRight: 'chevron-down',
          iconLeft: 'calendar',
        }"
      />
      <DateRangePicker
        v-else
        class="!w-48"
        ref="datePickerRef"
        :value="filters.period"
        variant="outline"
        :placeholder="__('Period')"
        @change="
          (v) =>
            updateFilter('period', v, () => {
              showDatePicker = false
              if (!v) {
                filters.period = getLastXDays()
                preset = 'Last 30 Days'
              } else {
                preset = formatter(v)
              }
            })
        "
        :formatter="formatRange"
      >
        <template #prefix>
          <LucideCalendar class="size-4 text-ink-gray-5 mr-2" />
        </template>
      </DateRangePicker>
      <Link
        v-if="isAdmin() || isManager()"
        class="form-control w-48"
        variant="outline"
        :value="filters.user && getUser(filters.user).full_name"
        doctype="User"
        :filters="{ name: ['in', users.data.crmUsers?.map((u) => u.name)] }"
        @change="(v) => updateFilter('user', v)"
        :placeholder="__('Sales user')"
        :hideMe="true"
      >
        <template #prefix>
          <UserAvatar
            v-if="filters.user"
            class="mr-2"
            :user="filters.user"
            size="sm"
          />
        </template>
        <template #item-prefix="{ option }">
          <UserAvatar class="mr-2" :user="option.value" size="sm" />
        </template>
        <template #item-label="{ option }">
          <Tooltip :text="option.value">
            <div class="cursor-pointer">
              {{ getUser(option.value).full_name }}
            </div>
          </Tooltip>
        </template>
      </Link>
    </div>

    <div class="w-full overflow-y-scroll bg-main-bg">
      <DashboardGrid
        class="pt-1"
        v-if="!dashboardItems.loading && dashboardItems.data"
        v-model="dashboardItems.data"
        :editing="editing"
      />
    </div>
  </div>
  <AddChartModal
    v-if="showAddChartModal"
    v-model="showAddChartModal"
    v-model:items="dashboardItems.data"
  />
</template>

<script setup lang="ts">
import AddChartModal from '@/components/Dashboard/AddChartModal.vue'
import LucideRefreshCcw from '~icons/lucide/refresh-ccw'
import LucideUndo2 from '~icons/lucide/undo-2'
import LucidePenLine from '~icons/lucide/pen-line'
import DashboardGrid from '@/components/Dashboard/DashboardGrid.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import ViewBreadcrumbs from '@/components/ViewBreadcrumbs.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'
import Link from '@/components/Controls/Link.vue'
import { usersStore } from '@/stores/users'
import { copy } from '@/utils'
import { getLastXDays, formatter, formatRange } from '@/utils/dashboard'
import {
  usePageMeta,
  createResource,
  DateRangePicker,
  Dropdown,
  Tooltip,
} from 'frappe-ui'
import { ref, reactive, computed, provide } from 'vue'

const { users, getUser, isManager, isAdmin } = usersStore()

const editing = ref(false)

const showDatePicker = ref(false)
const datePickerRef = ref(null)
const preset = ref('Last 30 Days')
const showAddChartModal = ref(false)

const filters = reactive({
  period: getLastXDays(),
  user: null,
})

const fromDate = computed(() => {
  if (!filters.period) return null
  return filters.period.split(',')[0]
})

const toDate = computed(() => {
  if (!filters.period) return null
  return filters.period.split(',')[1]
})

function updateFilter(key: string, value: any, callback?: () => void) {
  filters[key] = value
  callback?.()
  dashboardItems.reload()
}

const options = computed(() => [
  {
    group: 'Presets',
    hideLabel: true,
    items: [
      {
        label: 'Last 7 Days',
        onClick: () => {
          preset.value = 'Last 7 Days'
          filters.period = getLastXDays(7)
          dashboardItems.reload()
        },
      },
      {
        label: 'Last 30 Days',
        onClick: () => {
          preset.value = 'Last 30 Days'
          filters.period = getLastXDays(30)
          dashboardItems.reload()
        },
      },
      {
        label: 'Last 60 Days',
        onClick: () => {
          preset.value = 'Last 60 Days'
          filters.period = getLastXDays(60)
          dashboardItems.reload()
        },
      },
      {
        label: 'Last 90 Days',
        onClick: () => {
          preset.value = 'Last 90 Days'
          filters.period = getLastXDays(90)
          dashboardItems.reload()
        },
      },
    ],
  },
  {
    label: 'Custom Range',
    onClick: () => {
      showDatePicker.value = true
      setTimeout(() => datePickerRef.value?.open(), 0)
      preset.value = 'Custom Range'
      filters.period = null // Reset period to allow custom date selection
    },
  },
])

const dashboardItems = createResource({
  url: 'crm.api.dashboard.get_dashboard',
  makeParams() {
    return {
      from_date: fromDate.value,
      to_date: toDate.value,
      user: filters.user,
    }
  },
  auto: true,
})

const dirty = computed(() => {
  if (!editing.value) return false
  return JSON.stringify(dashboardItems.data) !== JSON.stringify(oldItems.value)
})

const oldItems = ref([])

provide('fromDate', fromDate)
provide('toDate', toDate)
provide('filters', filters)

function enableEditing() {
  editing.value = true
  oldItems.value = copy(dashboardItems.data)
}

function cancel() {
  editing.value = false
  dashboardItems.data = copy(oldItems.value)
}

const saveDashboard = createResource({
  url: 'frappe.client.set_value',
  method: 'POST',
  onSuccess: () => {
    dashboardItems.reload()
    editing.value = false
  },
})

function save() {
  const dashboardItemsCopy = copy(dashboardItems.data)

  dashboardItemsCopy.forEach((item: any) => {
    delete item.data
  })

  saveDashboard.submit({
    doctype: 'CRM Dashboard',
    name: 'Manager Dashboard',
    fieldname: 'layout',
    value: JSON.stringify(dashboardItemsCopy),
  })
}

function resetToDefault() {
  createResource({
    url: 'crm.api.dashboard.reset_to_default',
    auto: true,
    onSuccess: () => {
      dashboardItems.reload()
      editing.value = false
    },
  })
}

usePageMeta(() => {
  return { title: __('CRM Dashboard') }
})
</script>
