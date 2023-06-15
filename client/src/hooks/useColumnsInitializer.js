import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'

const sortColumnsBySequence = (a, b) => (a.seq > b.seq ? 1 : -1)

const useColumnsInitializer = (columnsState, cellConfigs) => {
    const { t } = useTranslation()

    let columns = []
    for (const [key, value] of Object.entries(columnsState)) {
        // restore checkbox state - merge defaults render functions with saved state
        let columnItem = {
            field: key,
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            ...cellConfigs[key],
            ...value,
            ...(cellConfigs[key]?.headerName ? { headerName: t(cellConfigs[key].headerName) } : {})
        }

        // and with MUI specific for checkbox
        if (key === GRID_CHECKBOX_SELECTION_COL_DEF.field) {
            columnItem = {
                ...GRID_CHECKBOX_SELECTION_COL_DEF,
                ...columnItem
            }
        }

        columns.push(columnItem)
    }

    columns.sort(sortColumnsBySequence)

    return [columns]
}

export default useColumnsInitializer
