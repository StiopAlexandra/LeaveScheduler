import React, { useMemo } from 'react'
import { GridActionsCellItem } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import Status from "../../../../components/common/Status/Status";

const useColumns = () => {
	return useMemo(() => {
		return {
			user: {
				hide: false,
				seq: 0,
				minWidth: 200,
				headerName: 'Name',
				sortable: true,
			},
			department: {
				hide: false,
				seq: 2,
				width: 170,
				headerName: 'Department',
				sortable: true,
				renderCell: params => {
					return (
						<Status name={params.value.name} color={params.value.color}/>
					)
				}
			},
			leaveType: {
				hide: false,
				seq: 3,
				minWidth: 170,
				headerName: 'Leave Type',
				sortable: true,
				renderCell: params => {
					return (
						<Status name={params.value.name} color={params.value.color}/>
					)
				}
			},
			startDate: {
				hide: false,
				seq: 3,
				minWidth: 160,
				headerName: 'Start Date',
				sortable: true,
			},
			endDate: {
				hide: false,
				seq: 4,
				minWidth: 160,
				headerName: 'End Date',
				sortable: true,
			},
			days: {
				hide: false,
				seq: 5,
				minWidth: 160,
				headerName: 'Working Days',
			},
			reason: {
				hide: false,
				seq: 6,
				minWidth: 220,
				headerName: 'Reason',
			}
		}
	}, [])
}

export default useColumns
