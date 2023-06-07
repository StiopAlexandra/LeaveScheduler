import { CHECKBOX_COL_DEF } from './constants'

const UserUIDefaultState = {
	UsersTableUIKey: {
		columns: {
			[CHECKBOX_COL_DEF.field]: {
				// from MUI X
			},
			name: {},
			email: {},
		},
		density: 'standard' // ENUM - standard / comfortable / compact
	},
	UsersFiltersUIKey: {
		filters: []
	},
	UsersOrderUIKey: {}
}

export default UserUIDefaultState
