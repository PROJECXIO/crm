<template>
	<Dialog
		v-model="show"
		:options="{
			title: null,
			size: 'xl',
			actions: [],
		}"
	>
		<template #body-header>
			<div class="w-full flex justify-end">
				<Button
					:icon="'arrow-right'"
					theme="green"
					variant="solid"
					size="lg"
					class="self-end"
					@click="() => router.push({ name: 'Project', params: { docId: doc.name } })"
				/>
			</div>
		</template>
		<template #body-title> {{ null }}</template>
		<template #body-content>
			<div v-if="document.loading">
				<h2>{{ __('Loading ...') }}</h2>
			</div>
			<div v-else class="flex flex-col gap-4 p-4 rounded">
				<div
					class="rounded bg-white shadow-sm p-4 space-y-2"
					style="box-shadow: -9px 9px 40px 0px #00000014"
				>
					<p class="text-[#00291F] sm:text-lg md:text-2xl font-bold">{{ title }}</p>
					<Badge label="available" theme="green" class="rounded-sm" />
					<div class="flex items-center gap-3 flex-wrap md:flex-nowrap">
						<p class="flex items-center gap-2" v-if="doc.project_type">
							<span class="text-lg font-medium text-[#00291F]">{{
								doc.project_type
							}}</span>
						</p>
						<p class="flex items-center gap-2" v-if="doc.max_rooms">
							<span class="text-lg font-medium text-[#00291F]">{{
								doc.max_rooms
							}}</span>
						</p>
						-
						<p class="flex items-center gap-2" v-if="doc.min_rooms">
							<span class="text-lg font-medium text-[#00291F]">{{
								doc.min_rooms
							}}</span>
						</p>
						<p class="flex items-center gap-2">
							<span class="text-lg font-medium text-[#00291F]">
								{{ __('ID') }}: {{ doc.name }}</span
							>
						</p>
					</div>
				</div>
				<div class="flex flex-col gap-10">
					<div
						class="rounded bg-white shadow-sm p-4 space-y-5 md:space-y-2 px-6 py-5"
						style="box-shadow: -9px 9px 40px 0px #00000014"
					>
						<h3 class="text-[#00291F] text-lg md:text-2xl font-bold mt-3 mb-5">
							{{ __('Property Address & Details') }}
						</h3>
						<div class="unit-preview-container">
							<p class="unit-preview-label">{{ __('City') }}</p>
							<p class="unit-preview-input">
								{{ doc.city || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Community') }}
							</p>
							<p class="unit-preview-input">
								{{ doc.community || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Sub Community') }}
							</p>
							<p class="unit-preview-input">
								{{ doc.sub_community || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Area From') }}
							</p>
							<p class="unit-preview-input">
								{{ doc.area_range || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Starting Price') }}
							</p>
							<p class="unit-preview-input">
								{{ doc.starting_price || '--' }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import { computed } from 'vue'

import BathIcon from '@/components/Icons/BathIcon.vue'
import BedIcon from '@/components/Icons/BedIcon.vue'
import { useRouter } from 'vue-router'
import { useDocument } from '@/data/document'

const props = defineProps({
	projectId: {
		type: String,
		default: '',
	},
})

const router = useRouter()

const show = defineModel()

const { document } = useDocument('CRM Unit Project', props?.projectId || '')

const doc = computed(() => document.doc || {})

</script>
