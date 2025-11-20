<template>
  <LayoutHeader>
    <template #left-header>
      <Breadcrumbs :items="breadcrumbs">
        <template #prefix="{ item }">
          <Icon v-if="item.icon" :icon="item.icon" class="mr-2 h-4" />
        </template>
      </Breadcrumbs>
    </template>
    <template v-if="!errorTitle" #right-header>
      <CustomActions
        v-if="document._actions?.length"
        :actions="document._actions"
      />
      <CustomActions
        v-if="document.actions?.length"
        :actions="document.actions"
      />

      <Button
        :tooltip="__('Delete')"
        variant="subtle"
        theme="red"
        icon="trash-2"
        @click="deleteLead"
        class="!size-12"
      />
      <!-- <FileUploader
        @success="(file) => updateField('image', file.file_url)"
        :validateFile="validateIsImageFile"
      >
        <template #default="{ openFileSelector, error }">
          <div class="flex items-center justify-start gap-5 p-5">
            <div class="flex flex-col gap-2.5 truncate">
              <div class="flex gap-1.5">
                <Button
                  v-if="callEnabled"
                  :tooltip="__('Make a call')"
                  :icon="PhoneIcon"
                  @click="
                    () =>
                      doc.mobile_no
                        ? makeCall(doc.mobile_no)
                        : toast.error(__('No phone number set'))
                  "
                />

                <Button
                  :tooltip="__('Send an email')"
                  :icon="Email2Icon"
                  @click="
                    doc.email ? openEmailBox() : toast.error(__('No email set'))
                  "
                  class="!size-12"
                  variant="outline"
                />
                <Button
                  :tooltip="__('Go to website')"
                  :icon="LinkIcon"
                  @click="
                    doc.website
                      ? openWebsite(doc.website)
                      : toast.error(__('No website set'))
                  "
                          class="!size-12"
                  variant="outline"
                />

                <Button
                  :tooltip="__('Attach a file')"
                  :icon="AttachmentIcon"
                  @click="showFilesUploader = true"
                          class="!size-12"
                  variant="outline"
                />

                <Button
                  :tooltip="__('Delete')"
                  variant="subtle"
                  theme="red"
                  icon="trash-2"
                  @click="deleteLead"
                          class="!size-12"
                />
              </div>
              <ErrorMessage :message="__(error)" />
            </div>
          </div>
        </template>
      </FileUploader> -->
    </template>
  </LayoutHeader>
  <div class="space-y-8">
    <div
      v-if="doc.name"
      class="flex flex-col gap-5 min-h-[calc(100vh-100px)] overflow-hidden justify-center"
    >
      <!-- lead owner -->
      <div
        class="mx-1 md:mx-3 lg:mx-8 flex flex-col items-start px-4 py-3 md:px-6 md:py-5 lg:items-center lg:flex-row rounded-xl -bg dark:bg-[#313131] gap-4"
        :class="isMobileView ? 'mt-0' : 'mt-5'"
        style="box-shadow: -9px 9px 40px 0px #00000014"
      >
        <div class="w-full gap-4">
          <div class="flex items-start gap-3 flex-col lg:flex-row">
            <!--personal image-->
            <div class="flex items-start justify-between w-full lg:w-auto">
              <FileUploader
                @success="(file) => updateField('image', file.file_url)"
                :validateFile="validateFile"
              >
                <template #default="{ openFileSelector, error }">
                  <div class="flex items-center justify-start">
                    <div class="group relative w-full">
                      <Avatar
                        shape="square"
                        class="!size-24"
                        :label="title"
                        :image="doc.image"
                      />
                      <component
                        :is="doc.image ? Dropdown : 'div'"
                        v-bind="
                          doc.image
                            ? {
                                options: [
                                  {
                                    icon: 'upload',
                                    label: doc.image
                                      ? __('Change image')
                                      : __('Upload image'),
                                    onClick: openFileSelector,
                                  },
                                  {
                                    icon: 'trash-2',
                                    label: __('Remove image'),
                                    onClick: () => updateField('image', ''),
                                  },
                                ],
                              }
                            : { onClick: openFileSelector }
                        "
                        class="!absolute bottom-0 left-0 right-0"
                      >
                        <div
                          class="z-1 absolute bottom-0.5 left-0 right-0.5 flex h-9 cursor-pointer items-center justify-center bg-black bg-opacity-40 pt-3 opacity-0 duration-300 ease-in-out group-hover:opacity-100"
                          style="
                            -webkit-clip-path: inset(12px 0 0 0);
                            clip-path: inset(12px 0 0 0);
                          "
                        >
                          <CameraIcon
                            class="size-4 cursor-pointer text-white"
                          />
                        </div>
                      </component>
                    </div>
                  </div>
                </template>
              </FileUploader>
              <div v-if="isMobileView">
                <div class="flex items-center justify-start">
                  <div class="flex gap-3">
                    <Tooltip :text="__('Generate PDF')">
                      <Button class="!w-8 !h-8" variant="outline" icon="file" />
                      <!-- @click="showFormModal = true" -->
                    </Tooltip>

                    <Tooltip :text="__('Add comment')">
                      <Button
                        @click="showCommentBox = true"
                        class="w-8 !h-8"
                        variant="outline"
                      >
                        <CommentIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip v-if="callEnabled" :text="__('Make a call')">
                      <Button
                        class="w-8 !h-8"
                        variant="outline"
                        @click="
                          () =>
                            doc.mobile_no
                              ? makeCall(doc.mobile_no)
                              : toast.error(__('No phone number set'))
                        "
                      >
                        <PhoneIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip :text="__('Send an email')">
                      <Button
                        @click="
                          doc.email
                            ? openEmailBox()
                            : toast.error(__('No email set'))
                        "
                        class="w-8 !h-8"
                        variant="outline"
                      >
                        <EmailIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip :text="__('Go to website')">
                      <Button
                        @click="
                          doc.website_link
                            ? openWebsite(doc.website_link)
                            : toast.error(__('No website set'))
                        "
                        class="w-8 !h-8"
                        variant="outline"
                      >
                        <LinkIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <FileUploader
                      @success="(file) => updateField('image', file.file_url)"
                      :validateFile="validateFile"
                    >
                      <template #default="{ openFileSelector, error }">
                        <Tooltip :text="__('Attach a file')">
                          <Button
                            :tooltip="__('Attach a file')"
                            :icon="UploadFileIcon"
                            @click="showFilesUploader = true"
                            class="!size-12"
                            variant="outline"
                          />
                        </Tooltip>
                      </template>
                    </FileUploader>
                  </div>
                </div>
              </div>
            </div>
            <!--lead data -->
            <div class="flex flex-col">
              <div class="text-lg font-medium">
                <div
                  class="flex items-center gap-1 mb-2 text-[#00291F] text-xl md:text-2xl font-bold md:font-semibold"
                  v-if="title"
                >
                  {{ title }}
                </div>
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center gap-1 text-[#666666] text-xs">
                    <HashIcon class="stroke-[#666]" />
                    {{ doc.name }}
                  </div>
                  <div
                    class="flex items-center gap-1 text-[#666666] text-xs"
                    v-if="doc?.mobile_no"
                  >
                    <MobileIcon class="stroke-[#666]" />
                    {{ doc.mobile_no }}
                  </div>
                  <div
                    class="flex items-center gap-1 text-[#666666] text-xs"
                    v-if="doc?.email"
                  >
                    <EmailIcon class="stroke-[#666]" />
                    {{ doc.email }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-full flex-col items-end gap-3">
          <div
            class="flex w-full flex-row mt-3 lg:mt-0 items-center justify-end gap-3 gap-y-2 flex-wrap lg:flex-nowrap"
          >
            <FileUploader
              @success="(file) => updateField('image', file.file_url)"
              :validateFile="validateFile"
              v-if="!isMobileView"
            >
              <template #default="{ openFileSelector, error }">
                <div class="flex items-center justify-start">
                  <div class="flex gap-1.5">
                    <Tooltip :text="__('Add comment')">
                      <Button
                        @click="showCommentBox = true"
                        class="w-12 !h-12"
                        variant="outline"
                      >
                        <CommentIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip v-if="callEnabled" :text="__('Make a call')">
                      <Button
                        class="w-12 !h-12"
                        variant="outline"
                        @click="
                          () =>
                            doc.mobile_no
                              ? makeCall(doc.mobile_no)
                              : toast.error(__('No phone number set'))
                        "
                      >
                        <PhoneIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip :text="__('Send an email')">
                      <Button
                        @click="
                          doc.email
                            ? openEmailBox()
                            : toast.error(__('No email set'))
                        "
                        class="w-12 !h-12"
                        variant="outline"
                      >
                        <EmailIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip :text="__('Go to website')">
                      <Button
                        @click="
                          doc.website_link
                            ? openWebsite(doc.website_link)
                            : toast.error(__('No website set'))
                        "
                        class="w-12 !h-12"
                        variant="outline"
                      >
                        <LinkIcon class="h-4 w-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip :text="__('Attach a file')">
                      <Button
                        :tooltip="__('Attach a file')"
                        :icon="UploadFileIcon"
                        @click="showFilesUploader = true"
                        class="!size-12"
                        variant="outline"
                      />
                    </Tooltip>
                    <Tooltip :text="__('Generate PDF')">
                      <Button
                        class="!w-12 !h-12"
                        variant="outline"
                        @click="showFormModal = true"
                        icon="file"
                      />
                    </Tooltip>
                  </div>
                  <ErrorMessage :message="__(error)" />
                </div>
              </template>
            </FileUploader>
            <div
              class="flex w-full md:w-auto gap-3 items-center justify-between md:justify-end"
            >
              <Tooltip :text="__('Assign to')">
                <AssignTo
                  v-model="assignees.data"
                  doctype="CRM Lead"
                  :docname="docId"
                  btnClass="!w-12 !h-12"
                />
              </Tooltip>
              <Dropdown
                v-if="doc && document.statuses"
                :options="statuses"
                placement="right"
              >
                <template #default="{ open }">
                  <Button
                    v-if="doc.status"
                    :label="doc.status"
                    :iconRight="open ? 'chevron-up' : 'chevron-down'"
                    variant="solid"
                    theme="gray"
                    class="!h-12"
                  >
                    <template #prefix>
                      <IndicatorIcon :class="getLeadStatus(doc.status).color" />
                    </template>
                  </Button>
                </template>
              </Dropdown>
              <Button
                :label="__('Convert to Deal')"
                variant="solid"
                theme="green"
                @click="showConvertToDealModal = true"
                class="!h-12"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- lead tabs -->
      <Tabs as="div" v-model="tabIndex" :tabs="tabs" class="">
        <template #tab-panel>
          <Activities
            ref="activities"
            doctype="CRM Lead"
            :docname="docId"
            :tabs="tabs"
            v-model:reload="reload"
            v-model:tabIndex="tabIndex"
            @beforeSave="saveChanges"
            @afterSave="reloadAssignees"
          />
        </template>
      </Tabs>
    </div>
    <ErrorPage
      v-else-if="errorTitle"
      :errorTitle="errorTitle"
      :errorMessage="errorMessage"
    />
  </div>
  <ConvertToDealModal
    v-if="showConvertToDealModal"
    v-model="showConvertToDealModal"
    :lead="doc"
  />
  <FilesUploader
    v-model="showFilesUploader"
    doctype="CRM Lead"
    :docname="docId"
    @after="
      () => {
        activities?.all_activities?.reload()
        changeTabTo('attachments')
      }
    "
  />
  <DeleteLinkedDocModal
    v-if="showDeleteLinkedDocModal"
    v-model="showDeleteLinkedDocModal"
    :doctype="'CRM Lead'"
    :docname="docId"
    name="Leads"
  />
</template>
<script setup>
import DeleteLinkedDocModal from '@/components/DeleteLinkedDocModal.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Icon from '@/components/Icon.vue'
import ActivityIcon from '@/components/Icons/ActivityIcon.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import CameraIcon from '@/components/Icons/CameraIcon.vue'
import HashIcon from '@/components/Icons/HashIcon.vue'
import MobileIcon from '@/components/Icons/MobileIcon.vue'
import UploadFileIcon from '@/components/Icons/UploadFileIcon.vue'
import CommentIcon from '@/components/Icons/CommentIcon.vue'
import DetailsIcon from '@/components/Icons/DetailsIcon.vue'
import EventIcon from '@/components/Icons/EventIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import NoteIcon from '@/components/Icons/NoteIcon.vue'
import WhatsAppIcon from '@/components/Icons/WhatsAppIcon.vue'
import IndicatorIcon from '@/components/Icons/IndicatorIcon.vue'
import LinkIcon from '@/components/Icons/LinkIcon.vue'
import AttachmentIcon from '@/components/Icons/AttachmentIcon.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'
import Activities from '@/components/Activities/Activities.vue'
import AssignTo from '@/components/AssignTo.vue'
import FilesUploader from '@/components/FilesUploader/FilesUploader.vue'
import CustomActions from '@/components/CustomActions.vue'
import ConvertToDealModal from '@/components/Modals/ConvertToDealModal.vue'
import {
  openWebsite,
  setupCustomizations,
  copyToClipboard,
  validateIsImageFile,
} from '@/utils'
import { getView } from '@/utils/view'
import { getSettings } from '@/stores/settings'
import { globalStore } from '@/stores/global'
import { statusesStore } from '@/stores/statuses'
import { getMeta } from '@/stores/meta'
import { useDocument } from '@/data/document'
import { whatsappEnabled, callEnabled } from '@/composables/settings'
import {
  createResource,
  FileUploader,
  Breadcrumbs,
  call,
  usePageMeta,
  toast,
} from 'frappe-ui'
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useActiveTabManager } from '@/composables/useActiveTabManager'
import Dropdown from 'frappe-ui/src/components/Dropdown/Dropdown.vue'
import Tabs from '@/components/frappe-ui/Tabs.vue'
import { isMobileView } from '@/composables/settings'

const { brand } = getSettings()
const { $dialog, $socket, makeCall } = globalStore()
const { statusOptions, getLeadStatus } = statusesStore()
const { doctypeMeta } = getMeta('CRM Lead')

const route = useRoute()
const router = useRouter()

const props = defineProps({
  docId: {
    type: String,
    required: true,
  },
})

const reload = ref(false)
const activities = ref(null)
const errorTitle = ref('')
const errorMessage = ref('')
const showDeleteLinkedDocModal = ref(false)
const showConvertToDealModal = ref(false)
const showFilesUploader = ref(false)

const { triggerOnChange, assignees, document, scripts, error } = useDocument(
  'CRM Lead',
  props.docId,
)

const doc = computed(() => document.doc || {})

watch(error, (err) => {
  if (err) {
    errorTitle.value = __(
      err.exc_type == 'DoesNotExistError'
        ? 'Document not found'
        : 'Error occurred',
    )
    errorMessage.value = __(err.messages?.[0] || 'An error occurred')
  } else {
    errorTitle.value = ''
    errorMessage.value = ''
  }
})

watch(
  () => document.doc,
  async (_doc) => {
    if (scripts.data?.length) {
      let s = await setupCustomizations(scripts.data, {
        doc: _doc,
        $dialog,
        $socket,
        router,
        toast,
        updateField,
        createToast: toast.create,
        deleteDoc: deleteLead,
        call,
      })
      document._actions = s.actions || []
      document._statuses = s.statuses || []
    }
  },
  { once: true },
)

const breadcrumbs = computed(() => {
  let items = [{ label: __('Leads'), route: { name: 'Leads' } }]

  if (route.query.view || route.query.viewType) {
    let view = getView(route.query.view, route.query.viewType, 'CRM Lead')
    if (view) {
      items.push({
        label: __(view.label),
        icon: view.icon,
        route: {
          name: 'Leads',
          params: { viewType: route.query.viewType },
          query: { view: route.query.view },
        },
      })
    }
  }

  items.push({
    label: title.value,
    route: { name: 'Lead', params: { docId: props.docId } },
  })
  return items
})

const title = computed(() => {
  let t = doctypeMeta['CRM Lead']?.title_field || 'name'
  return doc.value?.[t] || props.docId
})

const statuses = computed(() => {
  let customStatuses = document.statuses?.length
    ? document.statuses
    : document._statuses || []
  return statusOptions('lead', customStatuses, triggerStatusChange)
})

usePageMeta(() => {
  return { title: title.value, icon: brand.favicon }
})

const tabs = computed(() => {
  let tabOptions = [
    {
      name: 'Activity',
      label: __('Activity'),
      icon: ActivityIcon,
    },
    {
      name: 'Emails',
      label: __('Emails'),
      icon: EmailIcon,
    },
    {
      name: 'Comments',
      label: __('Comments'),
      icon: CommentIcon,
    },
    {
      name: 'Data',
      label: __('Data'),
      icon: DetailsIcon,
    },
    {
      name: 'Events',
      label: __('Events'),
      icon: EventIcon,
    },
    {
      name: 'Calls',
      label: __('Calls'),
      icon: PhoneIcon,
    },
    {
      name: 'Tasks',
      label: __('Tasks'),
      icon: TaskIcon,
    },
    {
      name: 'Notes',
      label: __('Notes'),
      icon: NoteIcon,
    },
    {
      name: 'Attachments',
      label: __('Attachments'),
      icon: AttachmentIcon,
    },
    {
      name: 'WhatsApp',
      label: __('WhatsApp'),
      icon: WhatsAppIcon,
      condition: () => whatsappEnabled.value,
    },
  ]
  return tabOptions.filter((tab) => (tab.condition ? tab.condition() : true))
})

const { tabIndex, changeTabTo } = useActiveTabManager(tabs, 'lastLeadTab')

const sections = createResource({
  url: 'crm.fcrm.doctype.crm_fields_layout.crm_fields_layout.get_sidepanel_sections',
  cache: ['sidePanelSections', 'CRM Lead'],
  params: { doctype: 'CRM Lead' },
  auto: true,
})

async function triggerStatusChange(value) {
  await triggerOnChange('status', value)
  document.save.submit()
}

function updateField(name, value) {
  value = Array.isArray(name) ? '' : value
  let oldValues = Array.isArray(name) ? {} : doc.value[name]

  if (Array.isArray(name)) {
    name.forEach((field) => (doc.value[field] = value))
  } else {
    doc.value[name] = value
  }

  document.save.submit(null, {
    onSuccess: () => (reload.value = true),
    onError: (err) => {
      if (Array.isArray(name)) {
        name.forEach((field) => (doc.value[field] = oldValues[field]))
      } else {
        doc.value[name] = oldValues
      }
      toast.error(err.messages?.[0] || __('Error updating field'))
    },
  })
}

function deleteLead() {
  showDeleteLinkedDocModal.value = true
}

function openEmailBox() {
  let currentTab = tabs.value[tabIndex.value]
  if (!['Emails', 'Comments', 'Activities'].includes(currentTab.name)) {
    activities.value.changeTabTo('emails')
  }
  nextTick(() => (activities.value.emailBox.show = true))
}

function saveChanges(data) {
  document.save.submit(null, {
    onSuccess: () => reloadAssignees(data),
  })
}

function reloadAssignees(data) {
  if (data?.hasOwnProperty('lead_owner')) {
    assignees.reload()
  }
}
</script>
