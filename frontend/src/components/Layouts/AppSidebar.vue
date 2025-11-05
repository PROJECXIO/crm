<template>
  <div class="relative flex h-full flex-col justify-between gap-8 pt-6 px-2 transition-all duration-300 ease-in-out"
    :class="isSidebarCollapsed ? 'w-20 !px-2' : 'w-[280px]'">
    <div class="flex items-center justify-between">
      <div class="px-2">
        <LogoFull class="w-44 h-11 mx-2" v-if="!isSidebarCollapsed" />
        <LogoCollapsed class="w-9 h-10" v-else />
      </div>
      <div :class="[
        'cursor-pointer border-[#E4E6EC] border rounded-sm size-8 bg-white flex items-center justify-center -me-6',

      ]" @click="isSidebarCollapsed = !isSidebarCollapsed">
        <ArrowRightIcon v-if="isSidebarCollapsed" />
        <ArrowLeftIcon v-else />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div v-for="view in allViews" :key="view.label">
        <div v-if="!view.hideLabel && isSidebarCollapsed && view.views?.length" class="mx-2 my-2 h-1 border-b" />
        <Section :label="view.name" :hideLabel="view.hideLabel" :opened="view.opened">
          <template #header="{ opened, hide, toggle }">
            <div v-if="!hide"
              class="flex cursor-pointer gap-1.5 px-1 text-base font-medium text-ink-gray-5 transition-all duration-300 ease-in-out"
              :class="isSidebarCollapsed
                ? 'ml-0 h-0 overflow-hidden opacity-0'
                : 'ml-2 mt-4 h-7 w-auto opacity-100'
                " @click="toggle()">
              <FeatherIcon name="chevron-right" class="h-4 text-ink-gray-9 transition-all duration-300 ease-in-out"
                :class="{ 'rotate-90': opened }" />
              <span>{{ __(view.name) }}</span>
            </div>
          </template>
          <nav class="flex flex-col">
            <SidebarLink v-for="link in view.views" :icon="link.icon" :label="__(link.label)" :to="link.to"
              :isCollapsed="isSidebarCollapsed" class="mx-2 my-0.5" />
          </nav>
        </Section>
      </div>
    </div>
    <div class="m-2 flex flex-col gap-1">
      <div class="flex flex-col gap-2 mb-1">
      </div>
    </div>
    <Notifications />
    <Settings />
  </div>
</template>

<script setup>
import LucideLayoutDashboard from '~icons/lucide/layout-dashboard'
import LogoFull from '@/components/Icons/RevenyuFull.vue'
import LogoCollapsed from '@/components/Icons/RevenyuCut.vue'
import ArrowLeftIcon from '@/components/Icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import Section from '@/components/Section.vue'
import LeadsIcon from '@/components/Icons/LeadsIcon.vue'
import DealsIcon from '@/components/Icons/DealsIcon.vue'
import ContactsIcon from '@/components/Icons/ContactsIcon.vue'
import OrganizationsIcon from '@/components/Icons/OrganizationsIcon.vue'
import NoteIcon from '@/components/Icons/NoteIcon.vue'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import CalendarIcon from '@/components/Icons/CalendarIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import SidebarLink from '@/components/SidebarLink.vue'
import Notifications from '@/components/Notifications.vue'
import Settings from '@/components/Settings/Settings.vue'

import { usersStore } from '@/stores/users'
import { FeatherIcon } from 'frappe-ui'

import { useStorage } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import HRIcon from '@/components/Icons/Custom/HRIcon.vue'

const isSidebarCollapsed = useStorage('isSidebarCollapsed', false)

const links = [
  {
    label: 'Dashboard',
    icon: LucideLayoutDashboard,
    to: 'Dashboard',
  },
  {
    label: 'HR Profile',
    icon: HRIcon,
    to: 'HR',
  },
  {
    label: 'Leads',
    icon: LeadsIcon,
    to: 'Leads',
  },
  {
    label: 'Deals',
    icon: DealsIcon,
    to: 'Deals',
  },
  {
    label: 'Contacts',
    icon: ContactsIcon,
    to: 'Contacts',
  },
  {
    label: 'Organizations',
    icon: OrganizationsIcon,
    to: 'Organizations',
  },
  {
    label: 'Notes',
    icon: NoteIcon,
    to: 'Notes',
  },
  {
    label: 'Tasks',
    icon: TaskIcon,
    to: 'Tasks',
  },
  {
    label: 'Calendar',
    icon: CalendarIcon,
    to: 'Calendar',
  },
  {
    label: 'Call Logs',
    icon: PhoneIcon,
    to: 'Call Logs',
  },
]

const allViews = computed(() => {
  let _views = [
    {
      name: 'All Views',
      hideLabel: true,
      opened: true,
      views: links.filter((link) => {
        if (link.condition) {
          return link.condition()
        }
        return true
      }),
    },
  ]
  return _views
})

const { users } = usersStore()

onMounted(async () => {
  await users.promise
})

</script>
