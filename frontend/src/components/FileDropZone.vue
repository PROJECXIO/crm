<template>
  <div
    class="drop-zone bg-[#f8fafc] dark:bg-dark"
    @click="$emit('click')"
    @dragover.prevent="$emit('dragover', $event)"
    @dragleave="$emit('dragleave', $event)"
    @drop.prevent="$emit('drop', $event)"
    :class="{ 'dragging-over': isDragging }"
  >
    <div class="drop-content hover:bg-green-50/50 p-2">
      <div class="flex items-center justify-center">
        <UploadFileIcon />
      </div>
      <div class="mt-2 text-center">
        <div class="flex items-center justify-center gap-2 text-[#00291F] text-base">
          <span class="font-bold">{{ __('Click to Upload') }}</span>
          <span>{{ __('or drag and drop') }}</span>
        </div>
        <div class="text-xs text-gray-400 mt-2">
          {{ __('Supported formats: JPG, PNG, GIF, PDF, XLSX, CSV') }}
        </div>
        <div class="text-xs text-gray-400 mt-2">
          {{ __(' (Max. File size: 25 MB)') }}
        </div>
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      @change="$emit('fileSelect', $event)"
      multiple
      :accept="acceptedExtensions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import UploadFileIcon from '@/components/Icons/UploadFileIcon.vue'

defineProps({
  isDragging: {
    type: Boolean,
    default: false
  },
  acceptedExtensions: {
    type: String,
    default: 'image/*,.pdf,.xlsx,.xls,.csv'
  }
})

defineEmits(['click', 'dragover', 'dragleave', 'drop', 'fileSelect'])

const fileInput = ref(null)

defineExpose({
  fileInput
})
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.drop-zone.dragging-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.drop-content {
  margin: 0 auto;
}
</style>
