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
        @click="deleteDeal"
        class="!size-12"
      />
    </template>
  </LayoutHeader>

  <div class="space-y-8">
    <div
      v-if="doc.name"
      class="flex flex-col gap-5 min-h-[calc(100vh-100px)] overflow-hidden justify-center"
    >
      <!-- deal details -->
      <div
        class="mx-1 md:mx-3 lg:mx-8 flex flex-col items-start px-4 py-3 md:px-6 md:py-5 lg:items-center lg:flex-row rounded-xl bg-sidebar-bg dark:bg-[#313131] gap-4 mt-5"
        style="box-shadow: -9px 9px 40px 0px #00000014"
      >
        <div class="w-full gap-4">
          <div class="flex items-start gap-3 flex-col lg:flex-row">
            <!--personal image-->
            <div class="flex items-start justify-between w-full lg:w-auto">
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
                            :icon="AttachmentIcon"
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
            <div class="flex gap-3">
              <div class="size-12">
                <Avatar
                  size="3xl"
                  class="size-12"
                  :label="title"
                  :image="organization?.organization_logo"
                />
              </div>
              <div class="space-y-2">
                <div
                  class="flex items-center gap-1 mb-2 text-[#00291F] text-xl md:text-2xl font-bold md:font-semibold"
                  v-if="title"
                >
                  {{ title }}
                </div>
                <div class="flex flex-col space-y-1">
                  <div class="flex items-center gap-1 text-[#666666] text-xs">
                    <HashIcon class="stroke-[#666]" />
                    {{ doc.lead }}
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
            <Button
              v-if="callEnabled"
                variant="outline"
                theme="green"
                class="!w-12 !h-12"
              :tooltip="__('Make a call')"
              :icon="PhoneIcon"
              @click="triggerCall"
            />

            <Button
              variant="outline"
              theme="green"
              class="!w-12 !h-12"
              :tooltip="__('Send an email')"
              :icon="Email2Icon"
              @click="
                doc.email ? openEmailBox() : toast.error(__('No email set'))
              "
            />

            <Button
              variant="outline"
              theme="green"
              class="!w-12 !h-12"
              :tooltip="__('Go to website')"
              :icon="LinkIcon"
              @click="
                doc.website
                  ? openWebsite(doc.website)
                  : toast.error(__('No website set'))
              "
            />

            <Button
              variant="outline"
              theme="green"
              class="!w-12 !h-12"
              :tooltip="__('Attach a file')"
              :icon="AttachmentIcon"
              @click="showFilesUploader = true"
            />

            <div
              class="flex w-full md:w-auto gap-3 items-center justify-between md:justify-end"
            >
                <!-- <Tooltip :text="__('Assign to')">
                <AssignTo
                  v-model="assignees.data"
                  doctype="CRM Lead"
                  :docname="docId"
                  btnClass="!w-12 !h-12"
                />
              </Tooltip> -->
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
                      <IndicatorIcon :class="getDealStatus(doc.status).color" />
                    </template>
                  </Button>
                </template>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      <!--  deal tabs -->
      <Tabs as="div" v-model="tabIndex" :tabs="tabs">
        <template #tab-panel>
          <Activities
            ref="activities"
            doctype="CRM Deal"
            :docname="docId"
            :tabs="tabs"
            :dealContacts="dealContacts?.data"
            v-model:reload="reload"
            v-model:tabIndex="tabIndex"
            @beforeSave="beforeStatusChange"
            @afterSave="reloadAssignees"
            @removeContact="(contact) => removeContact(contact)"
            @setPrimaryContact="(contact) => setPrimaryContact(contact)"
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
  <OrganizationModal
    v-if="showOrganizationModal"
    v-model="showOrganizationModal"
    :data="_organization"
    :options="{
      redirect: false,
      afterInsert: (_doc) => updateField('organization', _doc.name),
    }"
  />
  <ContactModal
    v-if="showContactModal"
    v-model="showContactModal"
    :contact="_contact"
    :options="{
      redirect: false,
      afterInsert: (_doc) => addContact(_doc.name),
    }"
  />
  <FilesUploader
    v-model="showFilesUploader"
    doctype="CRM Deal"
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
    :doctype="'CRM Deal'"
    :docname="docId"
    name="Deals"
  />
  <LostReasonModal
    v-if="showLostReasonModal"
    v-model="showLostReasonModal"
    :deal="document"
  />
</template>
<script setup>
import DeleteLinkedDocModal from '@/components/DeleteLinkedDocModal.vue'
import ErrorPage from '@/components/ErrorPage.vue'
import Icon from '@/components/Icon.vue'
import HashIcon from '@/components/Icons/HashIcon.vue'
import MobileIcon from '@/components/Icons/MobileIcon.vue'
import Resizer from '@/components/Resizer.vue'
import ContactIcon from '@/components/Icons/ContactIcon.vue'
import ActivityIcon from '@/components/Icons/ActivityIcon.vue'
import EmailIcon from '@/components/Icons/EmailIcon.vue'
import Email2Icon from '@/components/Icons/Email2Icon.vue'
import CommentIcon from '@/components/Icons/CommentIcon.vue'
import DetailsIcon from '@/components/Icons/DetailsIcon.vue'
import EventIcon from '@/components/Icons/EventIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import TaskIcon from '@/components/Icons/TaskIcon.vue'
import NoteIcon from '@/components/Icons/NoteIcon.vue'
import WhatsAppIcon from '@/components/Icons/WhatsAppIcon.vue'
import IndicatorIcon from '@/components/Icons/IndicatorIcon.vue'
import LinkIcon from '@/components/Icons/LinkIcon.vue'
import ArrowUpRightIcon from '@/components/Icons/ArrowUpRightIcon.vue'
import SuccessIcon from '@/components/Icons/SuccessIcon.vue'
import AttachmentIcon from '@/components/Icons/AttachmentIcon.vue'
import LayoutHeader from '@/components/LayoutHeader.vue'
import Activities from '@/components/Activities/Activities.vue'
import OrganizationModal from '@/components/Modals/OrganizationModal.vue'
import LostReasonModal from '@/components/Modals/LostReasonModal.vue'
import AssignTo from '@/components/AssignTo.vue'
import FilesUploader from '@/components/FilesUploader/FilesUploader.vue'
import ContactModal from '@/components/Modals/ContactModal.vue'
import Link from '@/components/Controls/Link.vue'
import Section from '@/components/Section.vue'
import SidePanelLayout from '@/components/SidePanelLayout.vue'
import SLASection from '@/components/SLASection.vue'
import CustomActions from '@/components/CustomActions.vue'
import { openWebsite, setupCustomizations, copyToClipboard } from '@/utils'
import { getView } from '@/utils/view'
import { getSettings } from '@/stores/settings'
import { globalStore } from '@/stores/global'
import { statusesStore } from '@/stores/statuses'
import { getMeta } from '@/stores/meta'
import { useDocument } from '@/data/document'
import { whatsappEnabled, callEnabled } from '@/composables/settings'
import {
  createResource,
  Dropdown,
  Tooltip,
  Avatar,
  Breadcrumbs,
  call,
  usePageMeta,
  toast,
  FileUploader,
} from 'frappe-ui'
import {
  ref,
  computed,
  h,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActiveTabManager } from '@/composables/useActiveTabManager'
import Tabs from '@/components/frappe-ui/Tabs.vue'
import { isMobileView } from '@/composables/settings'

const { brand } = getSettings()
const { $dialog, $socket, makeCall } = globalStore()
const { statusOptions, getDealStatus } = statusesStore()
const { doctypeMeta } = getMeta('CRM Deal')

const route = useRoute()
const router = useRouter()

const props = defineProps({
  docId: {
    type: String,
    required: true,
  },
})

const errorTitle = ref('')
const errorMessage = ref('')
const showDeleteLinkedDocModal = ref(false)

const { triggerOnChange, assignees, document, scripts, error } = useDocument(
  'CRM Deal',
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
        deleteDoc: deleteDeal,
        call,
      })
      document._actions = s.actions || []
      document._statuses = s.statuses || []
    }
  },
  { once: true },
)

const organizationDocument = ref(null)

watch(
  () => doc.value.organization,
  (org) => {
    if (org && !organizationDocument.value?.doc) {
      let { document: _organizationDocument } = useDocument(
        'CRM Organization',
        org,
      )
      organizationDocument.value = _organizationDocument
    }
  },
  { immediate: true },
)

const organization = computed(() => organizationDocument.value?.doc || {})

onMounted(() => {
  $socket.on('crm_customer_created', () => {
    toast.success(__('Customer created successfully'))
  })
})

onBeforeUnmount(() => {
  $socket.off('crm_customer_created')
})

const reload = ref(false)
const showOrganizationModal = ref(false)
const showFilesUploader = ref(false)
const _organization = ref({})

const breadcrumbs = computed(() => {
  let items = [{ label: __('Deals'), route: { name: 'Deals' } }]

  if (route.query.view || route.query.viewType) {
    let view = getView(route.query.view, route.query.viewType, 'CRM Deal')
    if (view) {
      items.push({
        label: __(view.label),
        icon: view.icon,
        route: {
          name: 'Deals',
          params: { viewType: route.query.viewType },
          query: { view: route.query.view },
        },
      })
    }
  }

  items.push({
    label: title.value,
    route: { name: 'Deal', params: { docId: props.docId } },
  })
  return items
})

const title = computed(() => {
  let t = doctypeMeta['CRM Deal']?.title_field || 'name'
  return doc.value?.[t] || props.docId
})

const statuses = computed(() => {
  let customStatuses = document.statuses?.length
    ? document.statuses
    : document._statuses || []
  return statusOptions('deal', customStatuses, triggerStatusChange)
})

usePageMeta(() => {
  return {
    title: title.value,
    icon: brand.favicon,
  }
})

const tabs = computed(() => {
  let tabOptions = [
    {
      name: 'Activity',
      label: __('Activity'),
      icon: ActivityIcon,
    },
    {
      name: 'Contacts',
      label: __('Contacts'),
      icon: ContactIcon,
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

const { tabIndex } = useActiveTabManager(tabs, 'lastDealTab')

const sections = createResource({
  url: 'crm.fcrm.doctype.crm_fields_layout.crm_fields_layout.get_sidepanel_sections',
  cache: ['sidePanelSections', 'CRM Deal'],
  params: { doctype: 'CRM Deal' },
  transform: (data) => getParsedSections(data),
})

if (!sections.data) sections.fetch()

function getParsedSections(_sections) {
  _sections.forEach((section) => {
    if (section.name == 'contacts_section') return
    section.columns[0].fields.forEach((field) => {
      if (field.fieldname == 'organization') {
        field.create = (value, close) => {
          _organization.value.organization_name = value
          showOrganizationModal.value = true
          close()
        }
        field.link = (org) =>
          router.push({
            name: 'Organization',
            params: { organizationId: org },
          })
      }
    })
  })
  return _sections
}

const showContactModal = ref(false)
const _contact = ref({})

async function addContact(contact) {
  if (dealContacts.data?.find((c) => c.name === contact)) {
    toast.error(__('Contact already added'))
    return
  }

  let d = await call('crm.fcrm.doctype.crm_deal.crm_deal.add_contact', {
    deal: props.docId,
    contact,
  })
  if (d) {
    dealContacts.reload()
    toast.success(__('Contact added'))
  }
}

async function removeContact(contact) {
  let d = await call('crm.fcrm.doctype.crm_deal.crm_deal.remove_contact', {
    deal: props.docId,
    contact,
  })
  if (d) {
    dealContacts.reload()
    toast.success(__('Contact removed'))
  }
}

async function setPrimaryContact(contact) {
  let d = await call('crm.fcrm.doctype.crm_deal.crm_deal.set_primary_contact', {
    deal: props.docId,
    contact,
  })
  if (d) {
    dealContacts.reload()
    toast.success(__('Primary contact set'))
  }
}

const dealContacts = createResource({
  url: 'crm.fcrm.doctype.crm_deal.api.get_deal_contacts',
  params: { name: props.docId },
  cache: ['deal_contacts', props.docId],
  transform: (data) => {
    data.forEach((contact) => {
      contact.opened = false
    })
    return data
  },
})

if (!dealContacts.data) dealContacts.fetch()

function triggerCall() {
  let primaryContact = dealContacts.data?.find((c) => c.is_primary)
  let mobile_no = primaryContact.mobile_no || null

  if (!primaryContact) {
    toast.error(__('No primary contact set'))
    return
  }

  if (!mobile_no) {
    toast.error(__('No mobile number set'))
    return
  }

  makeCall(mobile_no)
}

async function triggerStatusChange(value) {
  await triggerOnChange('status', value)
  setLostReason()
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

function deleteDeal() {
  showDeleteLinkedDocModal.value = true
}

const activities = ref(null)

function openEmailBox() {
  let currentTab = tabs.value[tabIndex.value]
  if (!['Emails', 'Comments', 'Activities'].includes(currentTab.name)) {
    activities.value.changeTabTo('emails')
  }
  nextTick(() => (activities.value.emailBox.show = true))
}

const showLostReasonModal = ref(false)

function setLostReason() {
  if (
    getDealStatus(document.doc.status).type !== 'Lost' ||
    (document.doc.lost_reason && document.doc.lost_reason !== 'Other') ||
    (document.doc.lost_reason === 'Other' && document.doc.lost_notes)
  ) {
    document.save.submit()
    return
  }

  showLostReasonModal.value = true
}

function beforeStatusChange(data) {
  if (
    data?.hasOwnProperty('status') &&
    getDealStatus(data.status).type == 'Lost'
  ) {
    setLostReason()
  } else {
    document.save.submit(null, {
      onSuccess: () => reloadAssignees(data),
    })
  }
}

function reloadAssignees(data) {
  if (data?.hasOwnProperty('deal_owner')) {
    assignees.reload()
  }
}
</script>
