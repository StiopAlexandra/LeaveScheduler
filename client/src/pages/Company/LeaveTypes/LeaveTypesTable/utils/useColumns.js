import React, {useMemo} from 'react'
import {GridActionsCellItem} from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CircleIcon from '@mui/icons-material/Circle';

const useColumns = ({onDelete, onEdit}) => {
    return useMemo(() => {
        return {
            name: {
                hide: false,
                seq: 0,
                minWidth: 150,
                headerName: 'Name',
                sortable: true,
            },
            color: {
                hide: false,
                seq: 1,
                width: 100,
                headerName: 'Color',
                renderCell: (params) => {
                    return (
                        <CircleIcon sx={{color: params.value}}/>
                    )
                }
            },
            allowanceDays: {
                hide: false,
                seq: 2,
                minWidth: 150,
                headerName: 'Allowance Days',
                sortable: true,
            },
            actions: {
                seq: 3,
                type: 'actions',
                align: "right",
                flex: 1,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<EditOutlinedIcon/>}
                        label="Edit"
                        onClick={() => onEdit(params.row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlineIcon/>}
                        disabled={params.row.default}
                        label="Delete"
                        onClick={() => onDelete(params.id)}
                    />
                ]
            }
        }
    }, [onDelete, onEdit])
}

export default useColumns
