<template>
  <div
    v-for="(group, gi) in groupedActivities"
    :key="group.date"
    class="day-group"
    :class="isMobileView ? 'p-2': 'p-8'"
  >
    <div
      class="sticky top-0 mb-3 z-10 text-[#F7931E] bg-[#FDE9D2] w-32 rounded-sm py-2 text-sm font-semibold text-center"
    >
      {{ formatDayLabel(group.date) }}
    </div>
    <div
      v-for="(activity, i) in group.items"
      :key="activity?.name || i"
      class="activity px-3 sm:px-10"
      :class="
        ['Activity', 'Emails'].includes(title)
          ? 'grid grid-cols-[30px_minmax(auto,_1fr)] gap-2 sm:gap-4'
          : ''
      "
    >
      <div
        v-if="['Activity', 'Emails'].includes(title)"
        class=" z-0 relative flex justify-center before:absolute before:left-[50%] before:-z-[1] before:top-0 before:border-l before:border-outline-gray-modals"
        :class="[i != activities.length - 1 ? 'before:h-full' : 'before:h-4']"
      >
        <div
          class="flex h-7 w-7 items-center justify-center "
          :class="{
            'mt-2.5': ['communication'].includes(activity.activity_type),
            'h-8': [
              'comment',
              'communication',
              'incoming_call',
              'outgoing_call',
            ].includes(activity.activity_type),
          }"
        >
          <UserAvatar
            v-if="activity.activity_type == 'communication'"
            :user="activity.data.sender"
            size="md"
          />
          <MissedCallIcon
            v-else-if="
              ['incoming_call', 'outgoing_call'].includes(
                activity.activity_type,
              ) && activity.status == 'No Answer'
            "
            class="text-ink-red-4"
          />
          <DeclinedCallIcon
            v-else-if="
              ['incoming_call', 'outgoing_call'].includes(
                activity.activity_type,
              ) && activity.status == 'Busy'
            "
          />
          <component
            v-else
            :is="activity.icon"
            :class="
              ['added', 'removed', 'changed'].includes(activity.activity_type)
                ? 'text-ink-gray-4'
                : 'text-ink-gray-8'
            "
          />
        </div>
      </div>
      <div v-if="activity.activity_type == 'communication'" class="pb-5 mt-px bg-white p-2 rounded-lg">
        <EmailArea :activity="activity" :emailBox="emailBox" />
      </div>
      <div
      v-else-if="activity.activity_type == 'comment'"
        class="mb-4 bg-white p-2 rounded-lg"
        :id="activity.name"
      >
        <CommentArea :activity="activity" />
      </div>
      <div
      v-else-if="activity.activity_type == 'attachment_log'"
        class="mb-4 flex flex-col gap-2 py-1.5 bg-white p-2 rounded-lg"
        :id="activity.name"
      >
        <div class="flex items-center justify-stretch gap-2 text-base">
          <div
            class="inline-flex items-center flex-wrap gap-1.5 text-ink-gray-8 font-medium"
          >
            <span class="font-medium">{{ activity.owner_name }}</span>
            <span class="text-ink-gray-5">{{ __(activity.data.type) }}</span>
            <a
              v-if="activity.data.file_url"
              :href="activity.data.file_url"
              target="_blank"
            >
              <span>{{ activity.data.file_name }}</span>
            </a>
            <span v-else>{{ activity.data.file_name }}</span>
            <FeatherIcon
              v-if="activity.data.is_private"
              name="lock"
              class="size-3"
            />
          </div>
          <div class="ml-auto whitespace-nowrap">
            <Tooltip :text="formatDate(activity.creation)">
              <div class="text-sm text-ink-gray-5">
                {{ __(timeAgo(activity.creation)) }}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div
        v-else-if="
          activity.activity_type == 'incoming_call' ||
          activity.activity_type == 'outgoing_call'
        "
        class="mb-4 bg-white p-2 rounded-lg"
      >
        <CallArea :activity="activity" />
      </div>
      <div v-else class="mb-4 flex flex-col gap-2 py-1.5 bg-white p-2 rounded-lg">
        <div class="flex items-center justify-stretch gap-2 text-base">
          <div
            v-if="activity.other_versions"
            class="inline-flex flex-wrap gap-1.5 text-ink-gray-8 font-medium"
          >
            <span>{{ activity.show_others ? __('Hide') : __('Show') }}</span>
            <span> +{{ activity.other_versions.length + 1 }} </span>
            <span>{{ __('changes from') }}</span>
            <span>{{ activity.owner_name }}</span>
            <Button
              class="!size-4"
              variant="ghost"
              :icon="SelectIcon"
              @click="activity.show_others = !activity.show_others"
            />
          </div>
          <div
            v-else
            class="inline-flex items-center flex-wrap gap-1 text-ink-gray-5"
          >
            <span class="font-medium text-ink-gray-8">
              {{ activity.owner_name }}
            </span>
            <span v-if="activity.type">{{ __(activity.type) }}</span>
            <span
              v-if="activity.data?.field_label"
              class="max-w-xs truncate font-medium text-ink-gray-8"
            >
              {{ __(activity.data.field_label) }}
            </span>
            <span v-if="activity.value">{{ __(activity.value) }}</span>
            <span
              v-if="activity.data?.old_value"
              class="max-w-xs font-medium text-ink-gray-8"
            >
              <div
                class="flex items-center gap-1"
                v-if="activity.options == 'User'"
              >
                <UserAvatar :user="activity.data.old_value" size="xs" />
                {{ getUser(activity.data.old_value).full_name }}
              </div>
              <div class="truncate" v-else>
                {{ activity.data.old_value }}
              </div>
            </span>
            <span v-if="activity.to">{{ __('to') }}</span>
            <span
              v-if="activity.data?.value"
              class="max-w-xs font-medium text-ink-gray-8"
            >
              <div
                class="flex items-center gap-1"
                v-if="activity.options == 'User'"
              >
                <UserAvatar :user="activity.data.value" size="xs" />
                {{ getUser(activity.data.value).full_name }}
              </div>
              <div class="truncate" v-else>
                {{ activity.data.value }}
              </div>
            </span>
          </div>

          <div class="ml-auto whitespace-nowrap">
            <Tooltip :text="formatDate(activity.creation)">
              <div class="text-sm text-ink-gray-5">
                {{ __(timeAgo(activity.creation)) }}
              </div>
            </Tooltip>
          </div>
        </div>
        <div
          v-if="activity.other_versions && activity.show_others"
          class="flex flex-col gap-0.5"
        >
          <div
            v-for="activity in [activity, ...activity.other_versions]"
            class="flex items-start justify-stretch gap-2 py-1.5 text-base"
          >
            <div class="inline-flex flex-wrap gap-1 text-ink-gray-5">
              <span
                v-if="activity.data?.field_label"
                class="max-w-xs truncate text-ink-gray-5"
              >
                {{ __(activity.data.field_label) }}
              </span>
              <FeatherIcon
                name="arrow-right"
                class="mx-1 h-4 w-4 text-ink-gray-5"
              />
              <span v-if="activity.type">
                {{ startCase(__(activity.type)) }}
              </span>
              <span
                v-if="activity.data?.old_value"
                class="max-w-xs font-medium text-ink-gray-8"
              >
                <div
                  class="flex items-center gap-1"
                  v-if="activity.options == 'User'"
                >
                  <UserAvatar :user="activity.data.old_value" size="xs" />
                  {{ getUser(activity.data.old_value).full_name }}
                </div>
                <div class="truncate" v-else>
                  {{ activity.data.old_value }}
                </div>
              </span>
              <span v-if="activity.to">{{ __('to') }}</span>
              <span
                v-if="activity.data?.value"
                class="max-w-xs font-medium text-ink-gray-8"
              >
                <div
                  class="flex items-center gap-1"
                  v-if="activity.options == 'User'"
                >
                  <UserAvatar :user="activity.data.value" size="xs" />
                  {{ getUser(activity.data.value).full_name }}
                </div>
                <div class="truncate" v-else>
                  {{ activity.data.value }}
                </div>
              </span>
            </div>

            <div class="ml-auto whitespace-nowrap">
              <Tooltip :text="formatDate(activity.creation)">
                <div class="text-sm text-ink-gray-5">
                  {{ __(timeAgo(activity.creation)) }}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from 'frappe-ui'
import { computed } from 'vue'
import { timeAgo, formatDate, startCase } from '@/utils'
import { usersStore } from '@/stores/users'
import SelectIcon from '@/components/Icons/SelectIcon.vue'
import { isMobileView } from '@/composables/settings'


type Activity = {
    activity_type: string
    creation: string
    other_versions: any
    show_versions: boolean
    data: any
    status: string
    icon: string
}
type ActivityProps = {
  activities: Activity[]
  title: string
}

const props = withDefaults(defineProps<ActivityProps>(), {
  activities: [],
  title: '',
})

const { getUser } = usersStore()

const groupedActivities = computed(() => {
  const groups: Record<string, Activity[]> = {}

  props.activities.forEach((activity) => {
    // Format date as e.g. "2025-11-02" for grouping
    const dateKey = dayjs(activity.creation).format('YYYY-MM-DD')
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(activity)
  })

  // Convert object → array to maintain order (descending by date)
  return Object.entries(groups)
    .sort(([a], [b]) => (dayjs(b).isAfter(dayjs(a)) ? 1 : -1))
    .map(([date, items]) => ({ date, items }))
})

const formatDayLabel = (date: string) => {
  const d = dayjs(date)
  if (d.isSame(dayjs(), 'day')) return 'Today'
  if (d.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday'
  return d.format('MMM D, YYYY') // e.g. "Nov 2, 2025"
}
</script>
