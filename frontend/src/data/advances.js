import { createResource } from "frappe-ui"
import { userEmployeeResource } from "@/stores/user"


const transformAdvanceData = (data) => {
	return data.map((claim) => {
		claim.doctype = "Employee Advance"
		return claim
	})
}

export const advanceBalance = createResource({
	url: "hrms.api.get_employee_advance_balance",
	params: {
		employee: userEmployeeResource.data.name,
	},
	auto: true,
	cache: "hrms:employee_advance_balance",
	transform(data) {
		return transformAdvanceData(data)
	},
})
