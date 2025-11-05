<template>
	<Dialog
		v-model="show"
		:options="{
			title: __('New Expense Claim'),
			size: '3xl',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div class="space-y-6">
				<!-- Tabs -->
				<div class="flex items-center justify-center gap-4">
					<Button
						theme="green"
						variant="ghost"
						:label="__('Expenses')"
						class="rounded-none !border-0 !border-b-2 hover:bg-transparent focus:!bg-transparent"
						:class="
							activeTab === 'expenses'
								? '!border-green-600 !text-[#00664D] !font-bold'
								: '!border-gray-300 !text-[#666e]'
						"
						@click="activeTab = 'expenses'"
					/>
					<Button
						theme="green"
						variant="ghost"
						:label="__('Advances')"
						class="rounded-none !border-0 !border-b-2 hover:bg-transparent focus:!bg-transparent"
						:class="
							activeTab === 'advances'
								? '!border-green-600 !text-[#00664D] !font-bold'
								: '!border-gray-300 !text-[#666e]'
						"
						@click="activeTab = 'advances'"
					/>
					<Button
						theme="green"
						variant="ghost"
						:label="__('Totals')"
						class="rounded-none !border-0 !border-b-2 hover:bg-transparent focus:!bg-transparent"
						:class="
							activeTab === 'totals'
								? '!border-green-600 !text-[#00664D] !font-bold'
								: '!border-gray-300 !text-[#666e]'
						"
						@click="activeTab = 'totals'"
					/>
				</div>
				<!-- contents -->
				<div class="min-h-96 space-y-5">
					<template v-if="activeTab === 'expenses'">
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Employee')
							}}</label>
							<Link
								doctype="Employee"
								variant="outline"
								size="xl"
								v-model="data.employee"
								:placeholder="__('Select employee')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Expenses Approver')
							}}</label>
							<Link
								doctype="User"
								hide-me
								variant="outline"
								size="xl"
								v-model="data.expense_approver"
								:placeholder="__('Select expenses approver')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Expenses')
							}}</label>
							<Grid
							v-model="data.expenses"
							v-model:parent="parent"
							doctype="Expense Claim Detail"
							parentDoctype="Expense Claim"
							parentFieldname="expenses" />
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Attachments')
							}}</label>
							<CustomUploadArea
								ref="uploadArea"
								doctype="Expense Claim"
								:docname="null"
							/>
						</div>
					</template>
					<template v-else-if="activeTab === 'advances'">
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Settle against advances')
							}}</label>
							<h2>Grid Table</h2>
						</div>
					</template>
					<template v-else-if="activeTab === 'totals'">
						<div class="space-y-2">
							<h3 class="text-[20px] font-bold text-subheading">
								{{ __('Accounting Details:') }}
							</h3>
						</div>
						<div class="space-y-2 ">
							<label class="text-[#666] text-lg font-bold">{{
								__('Posting Date')
							}}
						<span class="text-red-500">*</span>	
						</label>
							<DatePicker
								variant="outline"
								size="xl"
								icon-left="calendar"
								:placeholder="__('dd/mm/yyyy')"
								input-class="border-none"
								@change="
									(val) => (data.posting_date = dayjs(val).format('YYYY-MM-DD'))
								"
								v-model="data.posting_date"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Payable Account')
							}}</label>
							<Link
								doctype="Account"
								variant="outline"
								size="xl"
								v-model="data.payable_account"
								:placeholder="__('Select account')"
							/>
						</div>
						<div class="space-y-2">
							<h3 class="text-[20px] font-bold text-subheading">
								{{ __('Accounting Dimensions:') }}
							</h3>
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Project')
							}}</label>
							<Link
								doctype="Project"
								variant="outline"
								size="xl"
								v-model="data.project"
								:placeholder="__('Select project')"
							/>
						</div>
						<div class="space-y-2">
							<label class="text-[#666] text-lg font-bold">{{
								__('Cost Center')
							}}</label>
							<Link
								doctype="Cost Center"
								variant="outline"
								size="xl"
								v-model="data.cost_center"
								:placeholder="__('Select cost center')"
							/>
						</div>
					</template>
				</div>
				<div class="">
					<Add
						label="Save"
						@click="submit"
						:loading="loading"
						:disabled="loading"
						:class="['w-full', isMobileView ? 'min-h-[44px]' : '']"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup lang="ts">
import Add from '@/components/Modals/Actions/Add.vue'
import { isMobileView } from '@/composables/settings'
import { call, dayjs, toast } from 'frappe-ui'
import { reactive, ref } from 'vue'
import { usersStore } from '@/stores/users'
import Grid from '@/components/Controls/Grid.vue'
import DatePicker from '@/components/frappe-ui/DatePicker.vue'



const show = defineModel()
const { getUser } = usersStore()
const emits = defineEmits(['reload'])

type expenseClaim = {
	employee: string
	expense_approver: string
	expenses: expenseClaimTable[]
	posting_date: string
	cost_center: string
	project: string
	payable_account: string
}
type expenseClaimTable = {
	expense_date: string
	expense_type: string
	default_account: string
	amount: string
	sanctioned_amount: string
	cost_center: string
	project: string
	description: string
	payable_account: string
}

const parent = ref('Expense Claim')
const data = reactive<expenseClaim>({
	employee: getUser().employee?.name || '',
	expense_approver: getUser().employee?.expense_approver,
	expenses: [{
		expense_date: dayjs(new Date()).format("YYYY-MM-DD"),
		expense_type: '',
		default_account:'',
		amount: '',
		sanctioned_amount:'',
		cost_center:'',
		project:'',
		description:'',
		payable_account:''

	}],
	posting_date: '',
	cost_center: '',
	project: '',
	payable_account:''
})

const loading = ref(false)
const uploadArea = ref(null)

async function submit() {
	loading.value = true
	try {
		let res = await call('frappe.client.insert', {
			doc: {
				doctype: 'Expense Claim',
				...data,
			},
		})
		if (res.name) {
			if (uploadArea.value && uploadArea.value.files?.length > 0) {
				await uploadArea.value.uploadFilesWithDocname(res.name)
			}
			show.value = false
			toast.success(__('Expense claim requested successfully'))
			emits('reload')
		}
	} catch (error: any) {
		toast.error(__(error?.messages?.join('/n')))
	} finally {
		loading.value = false
	}
}

const activeTab = ref<'expenses' | 'advances' | 'totals'>('expenses')
</script>
