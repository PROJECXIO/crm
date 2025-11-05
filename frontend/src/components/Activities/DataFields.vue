<template>
  <div
    v-if="document.get.loading"
    class="flex flex-1 flex-col items-center justify-center gap-3 text-xl font-medium text-ink-gray-6"
  >
    <Loader />
  </div>
  <div v-else class="pb-8">
    <FieldLayout
      v-if="tabs.data"
      :tabs="tabs.data"
      :data="document.doc"
      :doctype="doctype"
    />
    <div class="h-8" />
    <div
      :class="[
        'fixed mt-20 bottom-0 right-0 z-auto py-3 px-7 sm:px-2 md:px-8 bg-white/95 backdrop-blur shadow-custom transition-all duration-300',
      ]"
      :style="{ width: fixedBarWidth }"
    >
      <div class="flex items-center justify-end gap-4 px-4 md:px-6">
        <Button
          v-if="isManager() && !isMobileView"
          :tooltip="__('Edit fields layout')"
          :icon="EditIcon"
          @click="showDataFieldsModal = true"
          size="lg"
        />
        <Button
          label="Save"
          :disabled="!document.isDirty"
          variant="solid"
          theme="green"
          size="lg"
          :loading="document.save.loading"
          @click="saveChanges"
        />
      </div>
    </div>
  </div>
  <DataFieldsModal
    v-if="showDataFieldsModal"
    v-model="showDataFieldsModal"
    :doctype="doctype"
    @reload="
      () => {
        tabs.reload()
        document.reload()
      }
    "
  />
</template>

<script setup>
import EditIcon from '@/components/Icons/EditIcon.vue'
import DataFieldsModal from '@/components/Modals/DataFieldsModal.vue'
import FieldLayout from '@/components/FieldLayout/FieldLayout.vue'
import { Badge, createResource } from 'frappe-ui'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import { usersStore } from '@/stores/users'
import { useDocument } from '@/data/document'
import { isMobileView } from '@/composables/settings'
import { ref, watch, getCurrentInstance, computed } from 'vue'
import Loader from '@/components/Loader.vue'
import { useStorage, watchDebounced } from '@vueuse/core'

const props = defineProps({
  doctype: {
    type: String,
    required: true,
  },
  docname: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['beforeSave', 'afterSave'])

const { isManager } = usersStore()

const instance = getCurrentInstance()
const attrs = instance?.vnode?.props ?? {}

const showDataFieldsModal = ref(false)

const { document } = useDocument(props.doctype, props.docname)

const isSidebarCollapsed = useStorage('isSidebarCollapsed', false)

const fixedBarWidth = computed(
  () => `calc(100vw - ${isSidebarCollapsed.value ? '80px' : '280px'})`,
)

const tabs = createResource({
  url: 'crm.fcrm.doctype.crm_fields_layout.crm_fields_layout.get_fields_layout',
  cache: ['DataFields', props.doctype],
  params: { doctype: props.doctype, type: 'Data Fields' },
  auto: true,
})

function saveChanges() {
  if (!document.isDirty) return

  const updatedDoc = { ...document.doc }
  const oldDoc = { ...document.originalDoc }

  const changes = Object.keys(updatedDoc).reduce((acc, key) => {
    if (JSON.stringify(updatedDoc[key]) !== JSON.stringify(oldDoc[key])) {
      acc[key] = updatedDoc[key]
    }
    return acc
  }, {})

  const hasListener = attrs['onBeforeSave'] !== undefined

  if (hasListener) {
    emit('beforeSave', changes)
  } else {
    document.save.submit(null, {
      onSuccess: () => emit('afterSave', changes),
    })
  }
}

watch(
  () => document.doc,
  (newValue, oldValue) => {
    if (!oldValue) return
    if (newValue && oldValue) {
      const isDirty =
        JSON.stringify(newValue) !== JSON.stringify(document.originalDoc)
      document.isDirty = isDirty
      if (isDirty) {
        document.save.loading = false
      }
    }
  },
  { deep: true },
)
</script>
