import React, { useMemo } from 'react'

import { CHECKBOX_COL_DEF } from './constants'

const useColumns = () => {
	return useMemo(() => {
		return {
			[CHECKBOX_COL_DEF.field]: {
				headerName: 'Checkbox selection',
				...CHECKBOX_COL_DEF,
				width: 50, // will end up in 50 after MUI calcs
				hide: false,
				seq: 0,
				minWidth: 40
			},
			name: {
				hide: false,
				seq: 1,
				width: 180,
				headerName: 'Name',
				sortable: true,
			},
			email: {
				hide: false,
				seq: 2,
				width: 280,
				headerName: 'Email',
				sortable: true,
			},
		}
	}, [])
}

export default useColumns
