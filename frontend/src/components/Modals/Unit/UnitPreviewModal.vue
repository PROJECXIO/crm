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
					@click="() => router.push({ name: 'Unit', params: { docId: unit.name } })"
				/>
			</div>
		</template>
		<template #body-title> {{ null }}</template>
		<template #body-content>
			<div v-if="loading">
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
						<p class="flex items-center gap-2" v-if="unit?.baths">
							<BathIcon class="size-5" />
							<span class="text-lg font-medium text-[#00291F]">{{
								unit.baths
							}}</span>
						</p>
						<p class="flex items-center gap-2" v-if="unit?.beds">
							<BedIcon class="size-5 fill-[#00291F]" />
							<span class="text-lg font-medium text-[#00291F]">{{ unit.beds }}</span>
						</p>
						<p class="flex items-center gap-2" v-if="unit?.ref">
							<FeatherIcon name="hash" class="size-5 fill-[#00291F]" />
							<span class="text-lg font-medium text-[#00291F]">{{ unit.ref }}</span>
						</p>
						<p class="flex items-center gap-2" v-if="unit?.name">
							<span class="text-lg font-medium text-[#00291F]">
								{{ __('Ref. No.') }}: {{ unit.name }}</span
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
								{{ unit.city || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Building') }}
							</p>
							<p class="unit-preview-input">
								{{ unit.building || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Community') }}
							</p>
							<p class="unit-preview-input">
								{{ unit.community || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Sub Community') }}
							</p>
							<p class="unit-preview-input">
								{{ unit.sub_community || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Built-up Area') }}
							</p>
							<p class="unit-preview-input">
								{{ unit.built_up_area || '--' }}
							</p>
						</div>
						<div class="unit-preview-container">
							<p class="unit-preview-label">
								{{ __('Plot Size') }}
							</p>
							<p class="unit-preview-input">
								{{ unit.plot_size || '--' }}
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

const router = useRouter()

const props = defineProps({
	unit: {
		type: Object,
		default: {},
	},
	loading: {
		type: Boolean,
		default: false,
	},
})

const show = defineModel()

const title = computed(() => {
	if (props.unit) {
		return [props.unit?.community, props.unit?.sub_community, props.unit?.city]
			.filter((el) => el !== '--' && el)
			.join(', ')
	}
	return 'N/A'
})
</script>
