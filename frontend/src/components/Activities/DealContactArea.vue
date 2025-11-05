<template>
    <div v-for="(contact, i) in contacts" :key="contact.name">
        <div class="px-2 pb-2.5" :class="[i == 0 ? 'pt-3' : 'pt-2.5']">
          <Section :opened="contact.opened">
            <template #header="{ opened, toggle }">
              <div
                class="flex cursor-pointer items-center justify-between gap-2 p-2 rounded-md text-base leading-5 text-ink-gray-7 hover:bg-bg-hover hover:ms-2 transition-all duration-300"
              >
                <div
                  class="flex h-7 items-center gap-2 truncate"
                  @click="toggle()"
                >
                  <Avatar
                    :label="contact.full_name"
                    :image="contact.image"
                    size="md"
                  />
                  <div class="truncate">
                    {{ contact.full_name }}
                  </div>
                  <Badge
                    v-if="contact.is_primary"
                    class="ml-2"
                    variant="outline"
                    :label="__('Primary')"
                    theme="green"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <Dropdown :options="contactOptions(contact)">
                    <Button
                      icon="more-vertical"
                      theme="green"
                      variant="outline"
                    />
                  </Dropdown>
                  <Button
                    variant="outline"
                    :title="__('View contact')"
                    theme="purple"
                    :icon="ArrowUpRightIcon"
                    @click="
                      router.push({
                        name: 'Contact',
                        params: { docId: contact.name },
                      })
                    "
                  />
                  <Button
                    variant="solid"
                    theme="gray"
                    :title="__('View details')"
                    class="transition-all duration-300 ease-in-out"
                    :class="{ 'rotate-90': opened }"
                    icon="chevron-right"
                    @click="toggle()"
                  />
                </div>
              </div>
            </template>
            <div class="flex flex-col gap-1.5 text-base text-ink-gray-8">
              <div class="flex items-center gap-3 pb-1.5 pl-1 pt-4">
                <Email2Icon class="h-4 w-4" />
                {{ contact.email }}
              </div>
              <div class="flex items-center gap-3 p-1 py-1.5">
                <PhoneIcon class="h-4 w-4" />
                {{ contact.mobile_no }}
              </div>
            </div>
          </Section>
        </div>
        <div
          v-if="i != contacts.length - 1"
          class="mx-2 h-px border-t border-outline-gray-modals"
        />
      </div>
</template>

<script setup>
import Dropdown from '@/components/frappe-ui/Dropdown.vue'
import Section from '@/components/Section.vue'
import ArrowUpRightIcon from '@/components/Icons/ArrowUpRightIcon.vue'
import { useRouter } from 'vue-router'

defineProps({
    contacts: {
        type: Array,
        default: ()=> []
    }
})

const router = useRouter()

const emit = defineEmits(['removeContact', 'setPrimaryContact'])

// deal contacts
function contactOptions(contact) {
  let options = [
    {
      label: __('Remove'),
      icon: 'trash-2',
      theme: 'red',
      onClick: () =>  emit('removeContact', contact.name),
    },
  ]

  if (!contact.is_primary) {
    options.push({
      label: __('Set as Primary Contact'),
      icon: h(SuccessIcon, { class: 'h-4 w-4' }),
      onClick: () => emit('setPrimaryContact', contact.name),
    })
  }

  return options
}
//
</script>