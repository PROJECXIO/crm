import { createResource } from "frappe-ui"
import { userEmployeeResource } from "@/stores/user"
import { usersStore } from '@/stores/users'

const { getUser } = usersStore()


const transformAdvanceData = (data) => {
	return data.map((claim) => {
		claim.doctype = "Employee Advance"
		return claim
	})
}

export const advanceBalance = createResource({
	url: "hrms.api.get_employee_advance_balance",
	params: {
		employee: getUser().employee?.name || userEmployeeResource.data?.name,
	},
	auto: true,
	cache: "hrms:employee_advance_balance",
	transform(data) {
		return transformAdvanceData(data)
	},
})
