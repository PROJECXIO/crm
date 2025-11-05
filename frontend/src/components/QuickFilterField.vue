<template>
  <FormControl
    v-if="filter.fieldtype == 'Check'"
    :label="filter.label"
    type="checkbox"
    v-model="filter.value"
    @change.stop="updateFilter(filter, $event.target.checked)"
  />
  <FormControl
    v-else-if="filter.fieldtype === 'Select'"
    class="form-control cursor-pointer [&_select]:cursor-pointer w-36"
    type="select"
    v-model="filter.value"
    :options="filter.options"
    :placeholder="filter.label"
    @change.stop="updateFilter(filter, $event.target.value)"
    variant="outline"
  />
  <Link
    v-else-if="filter.fieldtype === 'Link'"
    :value="filter.value"
    :doctype="filter.options"
    :placeholder="filter.label"
    @change="(data) => updateFilter(filter, data)"
    variant="outline"
    class="w-36"

  />
  <component
    v-else-if="['Date', 'Datetime'].includes(filter.fieldtype)"
    class="border-none w-36"
    :is="filter.fieldtype === 'Date' ? DatePicker : DateTimePicker"
    :value="filter.value"
    @change="(v) => updateFilter(filter, v)"
    :placeholder="filter.label"
  />
  <FormControl
    v-else
    v-model="filter.value"
    type="text"
    :placeholder="filter.label"
    @input.stop="debouncedFn(filter, $event.target.value)"
    variant="outline"
    class="w-36"
  />
</template>
<script setup>
import Link from '@/components/Controls/Link.vue'
import { FormControl, DatePicker, DateTimePicker } from 'frappe-ui'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  filter: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['applyQuickFilter'])

const debouncedFn = useDebounceFn((f, value) => {
  emit('applyQuickFilter', f, value)
}, 500)

function updateFilter(f, value) {
  emit('applyQuickFilter', f, value)
}
</script>
