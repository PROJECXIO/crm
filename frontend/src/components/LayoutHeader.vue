<template>
  <Teleport to="#app-header" v-if="showHeader" class="flex flex-row sm:flex-col">
    <slot>
      <header class="flex md:h-[88px] w-full items-center justify-between py-3 sm:px-1 lg:py-5 lg:!px-8 flex-col md:flex-row bg-sidebar-bg" 
	  >
        <div class="flex items-center gap-2">
          <slot name="left-header" />
        </div>
        <div
					v-if="!isMobileView"
					class="flex w-full items-center justify-end gap-1 md:gap-4 lg:gap-4 px-2"
				>
					<slot name="right-header" class="flex items-center gap-2" />

					<Button
						theme="gray"
						variant="outline"
						size="lg"
						class="relative flex items-center justify-center !gap-0 md:w-12 h-12 shadow-sm rounded border-[#E4E6EC] text-[#00AA80]"
						@click="toggleNotificationPanel"
					>
						<template #prefix>
							<NotificationsIcon class="size-3 md:size-4 lg:size-5" />
						</template>
						<template #suffix>
							<Badge
								v-if="unreadNotificationsCount"
								variant="solid"
								theme="orange"
								size="sm"
								:label="unreadNotificationsCount"
								class="!text-[#666] absolute -top-3 -right-3"
							/>
						</template>
					</Button>

					<div>
						<UserDropdown class="p-2" />
					</div>
				</div>
      </header>
    </slot>
  </Teleport>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import UserDropdown from '@/components/UserDropdown.vue'
import NotificationsIcon from '@/components/Icons/NotificationsIcon.vue'
import { isMobileView } from '@/composables/settings'
import { unreadNotificationsCount, notificationsStore } from '@/stores/notifications'


const { toggle: toggleNotificationPanel } = notificationsStore()

const showHeader = ref(false)

nextTick(() => {
  showHeader.value = true
})
</script>
