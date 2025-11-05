<template>
  <div
    class="flex flex-col"
    :class="{
      ' rounded-lg': hasTabs,
      '': hasTabs,
    }"
  >
    <Tabs as="div" v-model="tabIndex" :tabs="tabs">
      <TabList :class="!hasTabs ? 'hidden' : ' !p-0 !py-1.5 !px-4 !justify-start'" />
      <TabPanel v-slot="{ tab }">
        <div
          class="sections overflow-hidden"
        >
          <template v-for="section in tab.sections" :key="section.name">
            <Section :section="section" :data-name="section.name" />
          </template>
        </div>
      </TabPanel>
    </Tabs>
  </div>
</template>

<script setup>
import Section from '@/components/FieldLayout/Section.vue'
import { Tabs, TabPanel } from 'frappe-ui'
import { ref, computed, provide } from 'vue'
import TabList from '@/components/frappe-ui/TabList.vue'

const props = defineProps({
  tabs: Array,
  data: Object,
  doctype: {
    type: String,
    default: 'CRM Lead',
  },
  isGridRow: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
})

const tabIndex = ref(0)

const hasTabs = computed(() => {
  return (
    props.tabs.length > 1 || (props.tabs.length == 1 && props.tabs[0].label)
  )
})

provide(
  'data',
  computed(() => props.data),
)
provide('hasTabs', hasTabs)
provide('doctype', props.doctype)
provide('preview', props.preview)
provide('isGridRow', props.isGridRow)
</script>
<style scoped>
.section:not(:has(.field)) {
  display: none;
}

.section:has(.field):nth-child(1 of .section:has(.field)) {
  /* border-top: none; */
  margin-top: 0;
  /* padding-top: 0; */
}
</style>
