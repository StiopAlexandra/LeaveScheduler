import React, { useMemo } from 'react'
import CircleIcon from '@mui/icons-material/Circle';
const useColumns = () => {
	return useMemo(() => {
		return {
			color: {
				hide: false,
				seq: 0,
				width: 55,
				headerName: '',
				renderCell: (params) => {
					return (
						<CircleIcon sx={{color: params.value}}/>
					)
				}
			},
			name: {
				hide: false,
				seq: 1,
				minWidth: 180,
				headerName: 'Type',
				sortable: true,
			},
			days: {
				hide: false,
				seq: 2,
				minWidth: 130,
				headerName: 'Taken',
				sortable: true,
			},
			available: {
				hide: false,
				seq: 3,
				minWidth: 130,
				headerName: 'Available',
				sortable: true,
			},
			allowanceDays: {
				hide: false,
				seq: 4,
				minWidth: 130,
				headerName: 'Allowance',
				sortable: true,
			},
		}
	}, [])
}

export default useColumns
