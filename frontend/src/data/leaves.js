import { createResource, dayjs } from "frappe-ui"
import { userEmployeeResource } from "@/stores/user"
import { usersStore } from '@/stores/users'

const { isAdmin, getUser } = usersStore()

const transformLeaveData = (data) => {
	return data.map((leave) => {
		leave.leave_dates = getLeaveDates(leave)
		leave.doctype = "Leave Application"
		return leave
	})
}

export const getLeaveDates = (leave) => {
	if (leave.from_date == leave.to_date)
		return dayjs(leave.from_date).format("D MMM")
	else
		return `${dayjs(leave.from_date).format("D MMM")} - ${dayjs(
			leave.to_date
		).format("D MMM")}`
}

export const myLeaves = createResource({
	url: "hrms.api.get_leave_applications",
	params: {
		employee: getUser().employee?.name || userEmployeeResource.data?.name,
		limit: 10,
	},
	auto: true,
	cache: "hrms:my_leaves",
	transform(data) {
		return transformLeaveData(data)
	},
	onSuccess() {
		leaveBalance.reload()
	},
})

export const teamLeaves = createResource({
	url: "hrms.api.get_leave_applications",
	params: {
		employee: getUser().employee?.name || userEmployeeResource.data?.name,
		approver_id: getUser().employee?.user_id || userEmployeeResource.data?.user_id,
		for_approval: isAdmin() ? 0 : 1,
		limit: 10,
	},
	auto: true,
	cache: "hrms:team_leaves",
	transform(data) {
		return transformLeaveData(data)
	},
})

export const leaveBalance = createResource({
	url: "hrms.api.get_leave_balance_map",
	params: {
		employee: getUser().employee?.name || userEmployeeResource.data?.name,
	},
	auto: true,
	cache: "hrms:leave_balance",
	transform: (data) => {
		// Calculate balance percentage for each leave type
		return Object.fromEntries(
			Object.entries(data).map(([leave_type, allocation]) => {
				allocation.balance_percentage =
					(allocation.balance_leaves / allocation.allocated_leaves) * 100
				return [leave_type, allocation]
			})
		)
	},
})
