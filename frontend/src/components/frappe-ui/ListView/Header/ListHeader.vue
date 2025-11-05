<template>
	<div
		class="grid items-center space-x-4 p-2 border-b"
		:style="{
			gridTemplateColumns: getGridTemplateColumns(list.columns, list.options.selectable),
		}"
	>
		<Checkbox
			v-if="list.options.selectable"
			class="cursor-pointer duration-300 pr-2"
			size="lg"
			:modelValue="list.allRowsSelected"
			@click.stop="list.toggleAllRows"
		/>
		<slot>
			<ListHeaderItem
				v-for="column in list.columns"
				:key="column.key"
				:item="column"
				@columnWidthUpdated="emit('columnWidthUpdated', column)"
			/>
		</slot>
	</div>
</template>

<script setup>
import Checkbox from '@/components/frappe-ui/Checkbox.vue'
import ListHeaderItem from '@/components/frappe-ui/ListView/Header/ListHeaderItem.vue'
import { getGridTemplateColumns } from '@/components/frappe-ui/ListView/utils'
import { inject } from 'vue'

const emit = defineEmits(['columnWidthUpdated'])

const list = inject('list')
</script>
