<template>
  <!-- <ActivityHeader
    v-model="tabIndex"
    v-model:showWhatsappTemplates="showWhatsappTemplates"
    v-model:showFilesUploader="showFilesUploader"
    :tabs="tabs"
    :title="title"
    :doc="doc"
    :emailBox="emailBox"
    :whatsappBox="whatsappBox"
    :modalRef="modalRef"
  /> -->
  <div
    class="flex flex-col flex-1 overflow-y-auto rounded-xl mt-5 mb-10 min-h-96 bg-gray-50/50"
    :class="[title === 'Data' ? 'pt-0' : 'pt-5']"
  >
    <div
      v-if="all_activities?.loading"
      class="flex flex-1 flex-col items-center justify-center gap-3 text-xl font-medium text-ink-gray-4"
    >
      <Loader />
    </div>
    <div v-else-if="title == 'Events'" class="h-full activity">
      <EventArea :doctype="doctype" :docname="docname" />
    </div>
    <div
      v-else-if="
        activities?.length ||
        (whatsappMessages.data?.length && title == 'WhatsApp')
      "
      class="activities"
    >
      <div v-if="title == 'WhatsApp' && whatsappMessages.data?.length">
        <WhatsAppArea
          class="px-3 sm:px-10"
          v-model="whatsappMessages"
          v-model:reply="replyMessage"
          :messages="whatsappMessages.data"
        />
      </div>
      <div
        v-else-if="title == 'Notes'"
        class="grid grid-cols-1 gap-4 px-3 pb-3 sm:px-10 sm:pb-5 lg:grid-cols-2 xl:grid-cols-3"
      >
        <div v-for="note in activities" @click="modalRef.showNote(note)">
          <NoteArea :note="note" v-model="all_activities" />
        </div>
      </div>
      <div v-else-if="title == 'Comments'" class="pb-5">
        <div v-for="(comment, i) in activities">
          <div
            class="activity grid grid-cols-[30px_minmax(auto,_1fr)] gap-2 px-3 sm:gap-4 sm:px-10 mt-4"
          >
            <div
              class="z-0 relative flex justify-center before:absolute before:left-[50%] before:-z-[1] before:top-0 before:border-l before:border-outline-gray-modals"
              :class="
                i != activities.length - 1 ? 'before:h-full' : 'before:h-4'
              "
            >
              <div class="flex h-8 w-7 items-center justify-center">
                <CommentIcon class="text-ink-gray-8" />
              </div>
            </div>
            <CommentArea
              class="mb-4 bg-white p-2 rounded-lg"
              :activity="comment"
            />
          </div>
        </div>
      </div>
      <div v-else-if="title == 'Tasks'" class="pb-3 sm:px-10 sm:pb-5">
        <TaskArea :modalRef="modalRef" :tasks="activities" :doctype="doctype" />
      </div>
      <div v-else-if="title == 'Calls'" class="activity">
        <div v-for="(call, i) in activities">
          <div
            class="activity grid grid-cols-[30px_minmax(auto,_1fr)] gap-4 px-3 sm:px-10"
          >
            <div
              class="z-0 relative flex justify-center before:absolute before:left-[50%] before:-z-[1] before:top-0 before:border-l before:border-outline-gray-modals"
              :class="
                i != activities.length - 1 ? 'before:h-full' : 'before:h-4'
              "
            >
              <div
                class="flex h-8 w-7 items-center justify-center bg-surface-white text-ink-gray-8"
              >
                <MissedCallIcon
                  v-if="call.status == 'No Answer'"
                  class="text-ink-red-4"
                />
                <DeclinedCallIcon v-else-if="call.status == 'Busy'" />
                <component
                  v-else
                  :is="
                    call.type == 'Incoming' ? InboundCallIcon : OutboundCallIcon
                  "
                />
              </div>
            </div>
            <CallArea class="mb-4" :activity="call" />
          </div>
        </div>
      </div>
      <div
        v-else-if="title == 'Attachments'"
        class="px-3 pb-3 sm:px-10 sm:pb-5"
      >
        <AttachmentArea
          :attachments="activities"
          @reload="all_activities.reload() && scroll()"
        />
      </div>
      <div v-else>
        <ActivityLogArea :activities="activities" :title="title" />
      </div>
    </div>
    <div v-else-if="title == 'Data'" class="h-full flex flex-col">
      <DataFields
        :doctype="doctype"
        :docname="docname"
        @beforeSave="(data) => emit('beforeSave', data)"
        @afterSave="(data) => emit('afterSave', data)"
      />
    </div>
    <div v-else-if="title == 'Contacts' && dealContacts.length">
      <DealContactArea
        :contacts="dealContacts"
        @removeContact="(contact) => emit('removeContact', contact)"
        @setPrimaryContact="(contact) => emit('setPrimaryContact', contact)"
      />
    </div>
    <div
      v-else
      class="flex flex-1 flex-col items-center justify-center gap-3 text-xl font-medium bg-red400 text-ink-gray-4 rounded-md"
    >
      <component :is="emptyTextIcon" class="h-10 w-10" />
      <span>{{ __(emptyText) }}</span>
      <MultiActionButton
        v-if="title == 'Calls'"
        :options="callActions"
        variant="solid"
        theme="green"
      />
      <Button
        v-else-if="title == 'Notes'"
        variant="solid"
        theme="green"
        :label="__('Create Note')"
        @click="modalRef.showNote()"
      />
      <Button
        v-else-if="title == 'Emails'"
        variant="solid"
        theme="green"
        :label="__('New Email')"
        @click="emailBox.show = true"
      />
      <Button
        v-else-if="title == 'Comments'"
        variant="solid"
        theme="green"
        :label="__('New Comment')"
        @click="emailBox.showComment = true"
      />
      <Button
        v-else-if="title == 'Tasks'"
        variant="solid"
        theme="green"
        :label="__('Create Task')"
        @click="modalRef.showTask()"
      />
      <Button
        v-else-if="title == 'Attachments'"
        variant="solid"
        theme="green"
        :label="__('Upload Attachment')"
        @click="showFilesUploader = true"
      />
    </div>
  </div>
  <div>
    <CommunicationArea
      ref="emailBox"
      v-if="['Emails', 'Comments', 'Activity'].includes(title)"
      v-model="doc"
      v-model:reload="reload_email"
      :doctype="doctype"
      @scroll="scroll"
    />
    <WhatsAppBox
      ref="whatsappBox"
      v-if="title == 'WhatsApp'"
      v-model="doc"
      v-model:reply="replyMessage"
      v-model:whatsapp="whatsappMessages"
      :doctype="doctype"
      @scroll="scroll"
    />
  </div>
  <WhatsappTemplateSelectorModal
    v-if="whatsappEnabled"
    v-model="showWhatsappTemplates"
    :doctype="doctype"
    @send="(t) => sendTemplate(t)"
  />
  <AllModals
    ref="modalRef"
    v-model="all_activities"
    v-model:events="events"
    :doctype="doctype"
    :doc="doc"
  />
  <FilesUploader
    v-model="showFilesUploader"
    :doctype="doctype"
    :docname="docname"
    @after="
      () => {
        all_activities.reload()
        changeTabTo('attachments')
      }
    "
  />
</template>
<script setup>
import ActivityHeader from '@/components/Activities/ActivityHeader.vue'
import EmailArea from '@/components/Activities/EmailArea.vue'
import CommentArea from '@/components/Activities/CommentArea.vue'
import CallArea from '@/components/Activities/CallArea.vue'
import NoteArea from '@/components/Activities/NoteArea.vue'
import TaskArea from '@/components/Activities/TaskArea.vue'
import AttachmentArea from '@/components/Activities/AttachmentArea.vue'
import DataFields from '@/components/Activities/DataFields.vue'
import ArrowUpRightIcon from '@/components/Icons/ArrowUpRightIcon.vue'
import ContactIcon from '@/components/Icons/ContactIcon.vue'
import ActivityIcon from '@/components/Icons/ActivityIcon.vue'
import Email2Icon from '@/components/Icons/Email2Icon.vue'
import DetailsIcon from '@/components/Icons/DetailsIcon.vue'
import CalendarIcon from '@/components/Icons/CalendarIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import NoteIcon from '@/components/Icons/NoteIcon.vue'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import AttachmentIcon from '@/components/Icons/AttachmentIcon.vue'
import WhatsAppIcon from '@/components/Icons/WhatsAppIcon.vue'
import EventArea from '@/components/Activities/EventArea.vue'
import WhatsAppArea from '@/components/Activities/WhatsAppArea.vue'
import WhatsAppBox from '@/components/Activities/WhatsAppBox.vue'
import MultiActionButton from '@/components/MultiActionButton.vue'
import LeadsIcon from '@/components/Icons/LeadsIcon.vue'
import DealsIcon from '@/components/Icons/DealsIcon.vue'
import DotIcon from '@/components/Icons/DotIcon.vue'
import CommentIcon from '@/components/Icons/CommentIcon.vue'
import SuccessIcon from '@/components/Icons/SuccessIcon.vue'
import MissedCallIcon from '@/components/Icons/MissedCallIcon.vue'
import DeclinedCallIcon from '@/components/Icons/DeclinedCallIcon.vue'
import InboundCallIcon from '@/components/Icons/InboundCallIcon.vue'
import OutboundCallIcon from '@/components/Icons/OutboundCallIcon.vue'
import FadedScrollableDiv from '@/components/FadedScrollableDiv.vue'
import CommunicationArea from '@/components/CommunicationArea.vue'
import WhatsappTemplateSelectorModal from '@/components/Modals/WhatsappTemplateSelectorModal.vue'
import AllModals from '@/components/Activities/AllModals.vue'
import FilesUploader from '@/components/FilesUploader/FilesUploader.vue'
import { timeAgo, formatDate, startCase } from '@/utils'
import { globalStore } from '@/stores/global'
import { usersStore } from '@/stores/users'
import { whatsappEnabled, callEnabled } from '@/composables/settings'
import { useDocument } from '@/data/document'
import { capture } from '@/telemetry'
import { Tooltip, createResource } from 'frappe-ui'
import { useElementVisibility } from '@vueuse/core'
import {
  ref,
  computed,
  h,
  markRaw,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '@/components/Loader.vue'
import ActivityLogArea from '@/components/Activities/ActivityLogArea.vue'
import DealContactArea from '@/components/Activities/DealContactArea.vue'

const { makeCall, $socket } = globalStore()
const { getUser } = usersStore()

const props = defineProps({
  doctype: {
    type: String,
    default: 'CRM Lead',
  },
  docname: {
    type: String,
    default: '',
  },
  tabs: {
    type: Array,
    default: () => [],
  },
  dealContacts: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'beforeSave',
  'afterSave',
  'removeContact',
  'setPrimaryContact',
])

const route = useRoute()

const reload = defineModel('reload')
const tabIndex = defineModel('tabIndex')

const { document: _document } = useDocument(props.doctype, props.docname)

const doc = computed(() => _document.doc || {})

const reload_email = ref(false)
const modalRef = ref(null)
const showFilesUploader = ref(false)

const title = computed(() => props.tabs?.[tabIndex.value]?.name || 'Activity')

const changeTabTo = (tabName) => {
  const tabNames = props.tabs?.map((tab) => tab.name?.toLowerCase())
  const index = tabNames?.indexOf(tabName)
  if (index == -1) return
  tabIndex.value = index
}

const all_activities = createResource({
  url: 'crm.api.activities.get_activities',
  params: { name: props.docname },
  cache: ['activity', props.docname],
  auto: true,
  transform: ([versions, calls, notes, tasks, attachments]) => {
    return { versions, calls, notes, tasks, attachments }
  },
  onSuccess: () => nextTick(() => scroll()),
})

const showWhatsappTemplates = ref(false)

const whatsappMessages = createResource({
  url: 'crm.api.whatsapp.get_whatsapp_messages',
  cache: ['whatsapp_messages', props.docname],
  params: {
    reference_doctype: props.doctype,
    reference_name: props.docname,
  },
  auto: whatsappEnabled.value,
  transform: (data) => sortByCreation(data),
  onSuccess: () => nextTick(() => scroll()),
})

onBeforeUnmount(() => {
  $socket.off('whatsapp_message')
})

onMounted(() => {
  $socket.on('whatsapp_message', (data) => {
    if (
      data.reference_doctype === props.doctype &&
      data.reference_name === props.docname
    ) {
      whatsappMessages.reload()
    }
  })

  nextTick(() => {
    const hash = route.hash.slice(1) || null
    let tabNames = props.tabs?.map((tab) => tab.name)
    if (!tabNames?.includes(hash)) {
      scroll(hash)
    }
  })
})

function sendTemplate(template) {
  showWhatsappTemplates.value = false
  capture('send_whatsapp_template', { doctype: props.doctype })
  createResource({
    url: 'crm.api.whatsapp.send_whatsapp_template',
    params: {
      reference_doctype: props.doctype,
      reference_name: props.docname,
      to: doc.value.mobile_no,
      template,
    },
    auto: true,
  })
}

const replyMessage = ref({})

function get_activities() {
  if (!all_activities.data?.versions) return []
  if (!all_activities.data?.calls.length)
    return all_activities.data.versions || []
  return [...all_activities.data.versions, ...all_activities.data.calls]
}

const activities = computed(() => {
  let _activities = []
  if (title.value == 'Activity') {
    _activities = get_activities()
  } else if (title.value == 'Emails') {
    if (!all_activities.data?.versions) return []
    _activities = all_activities.data.versions.filter(
      (activity) => activity.activity_type === 'communication',
    )
  } else if (title.value == 'Comments') {
    if (!all_activities.data?.versions) return []
    _activities = all_activities.data.versions.filter(
      (activity) => activity.activity_type === 'comment',
    )
  } else if (title.value == 'Calls') {
    if (!all_activities.data?.calls) return []
    return sortByCreation(all_activities.data.calls)
  } else if (title.value == 'Tasks') {
    if (!all_activities.data?.tasks) return []
    return sortByModified(all_activities.data.tasks)
  } else if (title.value == 'Notes') {
    if (!all_activities.data?.notes) return []
    return sortByModified(all_activities.data.notes)
  } else if (title.value == 'Attachments') {
    if (!all_activities.data?.attachments) return []
    return sortByModified(all_activities.data.attachments)
  }

  _activities.forEach((activity) => {
    activity.icon = timelineIcon(activity.activity_type, activity.is_lead)

    if (
      activity.activity_type == 'incoming_call' ||
      activity.activity_type == 'outgoing_call' ||
      activity.activity_type == 'communication'
    )
      return

    update_activities_details(activity)

    if (activity.other_versions) {
      activity.show_others = false
      activity.other_versions.forEach((other_version) => {
        update_activities_details(other_version)
      })
    }
  })
  return sortByCreation(_activities)
})

function sortByCreation(list) {
  return list.sort((a, b) => new Date(a.creation) - new Date(b.creation))
}
function sortByModified(list) {
  return list.sort((b, a) => new Date(a.modified) - new Date(b.modified))
}

function update_activities_details(activity) {
  activity.owner_name = getUser(activity.owner).full_name
  activity.type = ''
  activity.value = ''
  activity.to = ''

  if (activity.activity_type == 'creation') {
    activity.type = activity.data
  } else if (activity.activity_type == 'added') {
    activity.type = 'added'
    activity.value = 'as'
  } else if (activity.activity_type == 'removed') {
    activity.type = 'removed'
    activity.value = 'value'
  } else if (activity.activity_type == 'changed') {
    activity.type = 'changed'
    activity.value = 'from'
    activity.to = 'to'
  }
}

const emptyText = computed(() => {
  let text = 'No Activities'
  if (title.value == 'Emails') {
    text = 'No Email Communications'
  } else if (title.value == 'Comments') {
    text = 'No Comments'
  } else if (title.value == 'Data') {
    text = 'No Data'
  } else if (title.value == 'Calls') {
    text = 'No Call Logs'
  } else if (title.value == 'Notes') {
    text = 'No Notes'
  } else if (title.value == 'Tasks') {
    text = 'No Tasks'
  } else if (title.value == 'Attachments') {
    text = 'No Attachments'
  } else if (title.value == 'WhatsApp') {
    text = 'No WhatsApp Messages'
  }
  else if (title.value == 'Contacts') {
    text = 'No Contacts'
  }
  return text
})

const emptyTextIcon = computed(() => {
  let icon = ActivityIcon
  if (title.value == 'Emails') {
    icon = Email2Icon
  } else if (title.value == 'Comments') {
    icon = CommentIcon
  } else if (title.value == 'Data') {
    icon = DetailsIcon
  } else if (title.value == 'Calls') {
    icon = PhoneIcon
  } else if (title.value == 'Notes') {
    icon = NoteIcon
  } else if (title.value == 'Tasks') {
    icon = TaskIcon
  } else if (title.value == 'Attachments') {
    icon = AttachmentIcon
  } else if (title.value == 'WhatsApp') {
    icon = WhatsAppIcon
  }
  else if (title.value == 'Contacts') {
    icon = ContactIcon
  }
  return h(icon, { class: 'text-ink-gray-4' })
})

function timelineIcon(activity_type, is_lead) {
  let icon
  switch (activity_type) {
    case 'creation':
      icon = is_lead ? LeadsIcon : DealsIcon
      break
    case 'deal':
      icon = DealsIcon
      break
    case 'comment':
      icon = CommentIcon
      break
    case 'event':
      icon = CalendarIcon
      break
    case 'incoming_call':
      icon = InboundCallIcon
      break
    case 'outgoing_call':
      icon = OutboundCallIcon
      break
    case 'attachment_log':
      icon = AttachmentIcon
      break
    default:
      icon = DotIcon
  }

  return markRaw(icon)
}

const emailBox = ref(null)
const whatsappBox = ref(null)

watch([reload, reload_email], ([reload_value, reload_email_value]) => {
  if (reload_value || reload_email_value) {
    all_activities.reload()
    _document.reload()
    reload.value = false
    reload_email.value = false
  }
})

function scroll(hash) {
  return
  if (['tasks', 'notes', 'events'].includes(route.hash?.slice(1))) return
  setTimeout(() => {
    let el
    if (!hash) {
      let e = document.getElementsByClassName('activity')
      el = e[e.length - 1]
    } else {
      el = document.getElementById(hash)
    }
    if (el && !useElementVisibility(el).value) {
      el.scrollIntoView({ behavior: 'smooth' })
      el.focus()
    }
  }, 500)
}

const callActions = computed(() => {
  let actions = [
    {
      label: __('Log a Call'),
      onClick: () => modalRef.value.createCallLog(),
    },
    {
      label: __('Make a Call'),
      onClick: () => makeCall(doc.value.mobile_no),
      condition: () => callEnabled.value,
    },
  ]

  return actions.filter((action) =>
    action.condition ? action.condition() : true,
  )
})

defineExpose({ emailBox, all_activities, changeTabTo })
</script>
