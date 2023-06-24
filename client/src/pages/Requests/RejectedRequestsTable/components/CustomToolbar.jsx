import React, {memo} from 'react'

import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {styled} from '@mui/material'

const GridToolbarContainerStyled = styled(GridToolbarContainer)(({theme}) => ({
    padding: '8px 15px'
}))

const CustomToolbar = ({
                           setColumnsButtonEl,
                           setFilterButtonEl,
                           setFilterActive,
                       }) => {

    return (
        <GridToolbarContainerStyled>
            <div>
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
            </div>
        </GridToolbarContainerStyled>
    )
}

export default memo(CustomToolbar)
