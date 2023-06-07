import React, {useCallback, memo} from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {IconButton} from '@mui/material'

import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';

const CustomToolbar = ({
                           setColumnsButtonEl,
                           setFilterButtonEl,
                           setFilterActive,
                           selectedItems,
                           onDelete
                       }) => {

    return (
        <GridToolbarContainer>
            {!!selectedItems.length &&
                <IconButton color={'error'} size={'large'} onClick={onDelete} sx={{padding: '7px'}}><DeleteOutlineOutlinedIcon/></IconButton>}
            <div style={{flex: 1}}/>
            <GridToolbarFilterButton
                ref={setFilterButtonEl}
                componentsProps={{
                    button: {
                        onClick: () => {
                            setFilterActive(true);
                        }
                    }
                }}
            />
            <GridToolbarColumnsButton
                ref={setColumnsButtonEl}
                onClick={() => {
                    setFilterActive(false);
                }}
            />
            <GridToolbarDensitySelector/>
        </GridToolbarContainer>
    )
}

export default memo(CustomToolbar)
