const RejectedRequestsUIDefaultState = {
	RejectedRequestsTableUIKey: {
		columns: {
			user: {},
			department: {},
			leaveType: {},
			startDate: {},
			endDate: {},
			days: {},
			reason: {},
		},
		density: 'standard' // ENUM - standard / comfortable / compact
	},
	RejectedRequestsFiltersUIKey: {
		filters: []
	},
	RejectedRequestsOrderUIKey: {}
}

export default RejectedRequestsUIDefaultState
