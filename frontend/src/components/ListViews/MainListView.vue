<template>
	<ListView
		class="mt-5"
		:class="$attrs.class"
		:columns="columns"
		:rows="rows"
		:options="{
			getRowRoute: (row) => ({
				name: routeName,
				params: { docId: row.name },
				query: { view: route.query.view, viewType: route.params.viewType },
			}),
			selectable: options.selectable,
			showTooltip: options.showTooltip,
			resizeColumn: options.resizeColumn,
			onRowClick: options.onRowClick,
		}"
		row-key="name"
		@update:selections="(selections) => emit('selectionsChanged', selections)"
	>
		<ListHeader class="sm:mx-5 mx-3" @columnWidthUpdated="emit('columnWidthUpdated')">
			<ListHeaderItem
				v-for="column in columns"
				:key="column.key"
				:item="column"
				@columnWidthUpdated="emit('columnWidthUpdated', column)"
			>
				<Button
					v-if="column.key == '_liked_by'"
					variant="ghosted"
					class="!h-4"
					:class="isLikeFilterApplied ? 'fill-red-500' : 'fill-white'"
					@click="() => emit('applyLikeFilter')"
				>
					<HeartIcon class="h-4 w-4" />
				</Button>
			</ListHeaderItem>
		</ListHeader>
		<ListRows :rows="rows" v-slot="{ idx, column, item, row }" :doctype="doctype">
			<div v-if="column.key === '_assign'" class="flex items-center">
				<MultipleAvatar
					:avatars="[item]"
					size="sm"
					labelClass="text-[#00291F] font-medium"
					@click="
						(event) =>
							emit('applyFilter', {
								event,
								idx,
								column,
								item,
								firstColumn: columns[0],
							})
					"
				/>
			</div>
			<ListRowItem
				v-else
				:item="item"
				:align="column.align"
				:class="[
					column.key === 'status'
						? `!rounded-sm  flex items-center justify-center !bg-${handleBgColor(item.color)}-400 truncate`
						: '',
				]"
			>
				<template #prefix>
					<div v-if="column.key === 'lead_name' || column.key === 'deal_name'">
						<Avatar
							v-if="item.label"
							class="flex items-center shadow-sm"
							:image="item.image"
							:label="item.image_label"
							:shape="'square'"
							size="sm"
						/>
					</div>
					<div v-else-if="column.key === 'lead_owner'">
						<Avatar
							v-if="item.full_name"
							class="flex items-center shadow-sm"
							:image="item.user_image"
							:label="item.full_name"
							:shape="'square'"
							size="sm"
						/>
					</div>
					<!-- <div v-else-if="column.key === 'mobile_no'">
						<PhoneIcon class="h-4 w-4" />
					</div> -->
				</template>
				<template #default="{ label }">
					<div
						v-if="
							[
								'modified',
								'creation',
								'first_response_time',
								'first_responded_on',
								'response_by',
							].includes(column.key)
						"
						class="truncate text-lg text-[#00291F] font-medium"
						@click="
							(event) =>
								emit('applyFilter', {
									event,
									idx,
									column,
									item,
									firstColumn: columns[0],
								})
						"
					>
						<Tooltip :text="item.label">
							<div>{{ item?.timeAgo || __(timeAgo(item)) }}</div>
						</Tooltip>
					</div>
					<div v-else-if="column.key === '_liked_by'">
						<Button
							v-if="column.key == '_liked_by'"
							variant="ghosted"
							:class="isLiked(item) ? 'fill-red-500' : 'fill-white'"
							@click.stop.prevent="
								() =>
									emit('likeDoc', {
										name: row.name,
										liked: isLiked(item),
									})
							"
						>
							<HeartIcon class="h-4 w-4" />
						</Button>
					</div>
					<div v-else-if="column.key === 'sla_status'" class="truncate text-lg">
						<Badge
							v-if="item.value"
							:variant="'subtle'"
							:theme="item.color"
							size="md"
							:label="item.value"
							@click="
								(event) =>
									emit('applyFilter', {
										event,
										idx,
										column,
										item,
										firstColumn: columns[0],
									})
							"
						/>
					</div>
					<div v-else-if="column.type === 'Check'">
						<Switch :modelValue="item" size="md" :checked="item" />
					</div>
					<div
						v-else
						:class="[
							'truncate font-medium',
							column.key === 'status'
								? `text-xs !text-center !text-${handleBgColor(item.color)}-900 py-1 px-2 rounded-sm !text-center`
								: 'text-lg text-[#00291F] ',
						]"
					>
						{{ label }}
					</div>
				</template>
			</ListRowItem>
		</ListRows>
		<ListSelectBanner>
			<template #actions="{ selections, unselectAll }">
				<Dropdown :options="listBulkActionsRef.bulkActions(selections, unselectAll)">
					<Button icon="more-horizontal" variant="outline" theme="green" />
				</Dropdown>
			</template>
		</ListSelectBanner>
	</ListView>
	<ListFooter
		v-if="pageLengthCount"
		class="border-t sm:px-5 px-3 py-2"
		v-model="pageLengthCount"
		:options="{
			rowCount: options.rowCount,
			totalCount: options.totalCount,
		}"
		@loadMore="emit('loadMore')"
	/>
	<ListBulkActions ref="listBulkActionsRef" v-model="list" :doctype="doctype" />
</template>

<script setup>
import HeartIcon from '@/components/Icons/HeartIcon.vue'
import PhoneIcon from '@/components/Icons/PhoneIcon.vue'
import MultipleAvatar from '@/components/MultipleAvatar.vue'
import ListBulkActions from '@/components/ListBulkActions.vue'
import ListRows from '@/components/frappe-ui/ListView/ListRows.vue'
import ListRowItem from '@/components/frappe-ui/ListView/ListRowItem.vue'
import ListHeader from '@/components/frappe-ui/ListView/Header/ListHeader.vue'
import ListHeaderItem from '@/components/frappe-ui/ListView/Header/ListHeaderItem.vue'
import ListFooter from '@/components/frappe-ui/ListFooter.vue'
import { Avatar, ListView } from 'frappe-ui'
import Tooltip from '@/components/frappe-ui/Tooltip.vue'
import Dropdown from '@/components/frappe-ui/Dropdown.vue'
import Switch from '@/components/frappe-ui/Switch.vue'
import ListSelectBanner from '@/components/frappe-ui/ListSelectBanner.vue'
import { sessionStore } from '@/stores/session'
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { timeAgo } from '@/utils'

const props = defineProps({
	doctype: {
		type: String,
		required: true,
	},
	routeName: {
		type: String,
	},
	rows: {
		type: Array,
		required: true,
	},
	columns: {
		type: Array,
		required: true,
	},
	options: {
		type: Object,
		default: () => ({
			selectable: true,
			showTooltip: true,
			resizeColumn: false,
			totalCount: 0,
			rowCount: 0,
		}),
	},
})
const emit = defineEmits([
	'loadMore',
	'updatePageCount',
	'columnWidthUpdated',
	'applyFilter',
	'applyLikeFilter',
	'likeDoc',
	'selectionsChanged',
])

const route = useRoute()

const pageLengthCount = defineModel()
const list = defineModel('list')

const isLikeFilterApplied = computed(() => {
	return list.value.params?.filters?._liked_by ? true : false
})

const { user } = sessionStore()

function isLiked(item) {
	if (item) {
		let likedByMe = JSON.parse(item)
		return likedByMe.includes(user)
	}
}

function handleBgColor(color) {
	if (color && typeof color === 'string') return color.split('-')[1] || color
	return 'white'
}

watch(pageLengthCount, (val, old_value) => {
	if (val === old_value) return
	emit('updatePageCount', val)
})

const listBulkActionsRef = ref(null)

defineExpose({
	customListActions: computed(() => listBulkActionsRef.value?.customListActions),
})
</script>
