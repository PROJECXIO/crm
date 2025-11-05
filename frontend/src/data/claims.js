import { createResource } from "frappe-ui"
import { reactive } from "vue"
import { userEmployeeResource } from "@/stores/user"
import { usersStore } from '@/stores/users'

const { isAdmin } = usersStore()

export const expenseClaimSummary = createResource({
	url: "hrms.api.get_expense_claim_summary",
	params: {
		employee: userEmployeeResource.data.name,
	},
	auto: true,
	cache: "hrms:expense_claim_summary",
})

const transformClaimData = (data) => {
	return data.map((claim) => {
		claim.doctype = "Expense Claim"
		return claim
	})
}

export const myClaims = createResource({
	url: "hrms.api.get_expense_claims",
	params: {
		employee: userEmployeeResource.data.name,
		limit: 10,
	},
	auto: true,
	cache: "hrms:my_claims",
	transform(data) {
		return transformClaimData(data)
	},
	onSuccess() {
		expenseClaimSummary.reload()
	},
})

export const teamClaims = createResource({
	url: "hrms.api.get_expense_claims",
	params: {
		employee: userEmployeeResource.data.name,
		approver_id: userEmployeeResource.data.user_id,
		for_approval: isAdmin() ? 0 : 1,
		limit: 10,
	},
	auto: true,
	cache: "hrms:team_claims",
	transform(data) {
		return transformClaimData(data)
	},
})

export let claimTypesByID = reactive({})

export const claimTypesResource = createResource({
	url: "hrms.api.get_expense_claim_types",
	auto: true,
	transform(data) {
		return data.map((row) => {
			claimTypesByID[row.name] = row
			return row
		})
	},
})
