<template>
	<Dialog
		v-model="show"
		:options="{
			title: doctype ? __(doctype) : __('List'),
			size: '3xl',
		}"
	>
		<template #body-content>
			<div class="py-5 bg-white">
				<div v-if="list && list.loading">
					<LoadingIndicator color="#00aa80" class="size-8" />
				</div>
				<template v-else>
					<div v-if="list && pagedItems.length" class="min-h-32">
						<table class="w-full">
							<thead>
								<tr>
									<th
										class="border border-gray-300 px-4 w-[5%] font-semibold text-base p-1"
									>
										#
									</th>
									<th
										class="border border-gray-300 px-4 w-[60%] font-semibold text-base p-1"
									>
										{{ __('Name') }}
									</th>
									<th
										class="border border-gray-300 px-4 font-semibold text-base p-1"
									>
										{{ __('Creation') }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, idx) in pagedItems" :key="item.name">
									<td
										class="border border-gray-300 px-4 text-base font-medium p-0.5 py-1"
									>
										{{ idx + 1 }}
									</td>
									<td
										class="border border-gray-300 px-4 text-base font-medium p-0.5 py-1"
									>
										{{ item.name }}
									</td>
									<td
										class="border border-gray-300 px-4 text-base font-medium p-0.5 py-1"
									>
										{{ dayjs(item.creation).format('DD MMMM, YYYY') }}
									</td>
								</tr>
							</tbody>
						</table>
						<!-- <div
							v-for="(item, idx) in pagedItems"
							:key="item.name"
							class="flex items-center justify-between mt-3 first:mt-0 hover:bg-bg-hover p-2 rounded-md group"
						>
							<div
								class="text-base font-medium text-subheading group-hover:text-white"
							>
								<span>{{ idx + 1 }}</span>
								{{ item.name }}
							</div>
							<div
								class="text-sm font-semibold text-ink-gray-5 group-hover:text-white"
							>
								{{ formatDate(item.creation) }}
							</div>
						</div> -->
					</div>
					<div class="flex items-center justify-between mt-5">
						<Button
							:icon="ArrowLeftIcon"
							variant="subtle"
							@click="onPrev"
							:disabled="pageIndex === 0 || (list && list.loading)"
						/>
						<div class="text-ink-gray-5 text-sm">
							{{ __('Page') }} {{ pageIndex + 1 }}
						</div>
						<Button
							:icon="ArrowRightIcon"
							variant="subtle"
							@click="onNext"
							:loading="list && list.loading"
							:disabled="!canGoNext"
						/>
					</div>
					<div v-if="!(list && pagedItems.length)" class="text-ink-gray-4">
						{{ __('No records found') }}
					</div>
				</template>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import { Dialog, createListResource, dayjs } from 'frappe-ui'
import { ref, watch, computed } from 'vue'
import LoadingIndicator from '@/components/Icons/LoadingIndicator.vue'
import Button from '@/components/frappe-ui/Button.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import ArrowLeftIcon from '@/components/Icons/ArrowLeftIcon.vue'

const props = defineProps({
	doctype: String,
})

const show = defineModel()

const list = ref(null)
const pageIndex = ref(0)
const pageSize = 15

function buildResource(doctype) {
	if (!doctype) return null
	return createListResource({
		doctype,
		fields: ['name', 'creation'],
		orderBy: 'modified desc',
		cache: ['hr-list', doctype],
		pageLength: 100,
		auto: true,
	})
}

watch(
	() => props.doctype,
	(newDoctype) => {
		pageIndex.value = 0
		list.value = buildResource(newDoctype)
	},
	{ immediate: true },
)

const pagedItems = computed(() => {
	const items = list.value?.data || []
	const start = pageIndex.value * pageSize
	const end = start + pageSize
	return items.slice(start, end)
})

const canGoNext = computed(() => {
	const items = list.value?.data || []
	const nextStart = (pageIndex.value + 1) * pageSize
	if (nextStart < items.length) return true
	return list.value?.hasNextPage || false
})

function onNext() {
	const items = list.value?.data || []
	const nextStart = (pageIndex.value + 1) * pageSize
	if (nextStart < items.length) {
		pageIndex.value += 1
		return
	}
	if (list.value?.hasNextPage && !list.value.loading) {
		list.value.next().then(() => {
			pageIndex.value += 1
		})
	}
}

function onPrev() {
	if (pageIndex.value > 0) {
		pageIndex.value -= 1
	}
}

function formatDate(value) {
	if (!value) return ''
	try {
		const d = new Date(value)
		if (isNaN(d.getTime())) return String(value)
		return d.toISOString().slice(0, 10)
	} catch (e) {
		return String(value)
	}
}
</script>
