import { buttonClasses, styled } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/common/Button/Button';

const RejectButtonStyled = styled(Button)(({ theme }) => ({
  [`&.${buttonClasses.disabled}`]: {
    backgroundColor: theme.palette.error.main,
    opacity: 0.4
  }
}));

const GridToolbarContainerStyled = styled(GridToolbarContainer)(({ theme }) => ({
  padding: '8px 15px'
}));

const CustomToolbar = ({
  setColumnsButtonEl,
  setFilterButtonEl,
  setFilterActive,
  selectedItems,
  onDelete
}) => {
  const { t } = useTranslation();

  return (
    <GridToolbarContainerStyled>
      <RejectButtonStyled
        variant="contained"
        color="error"
        size={'small'}
        onClick={onDelete}
        disabled={!selectedItems.length}>
        {t('Delete')}
      </RejectButtonStyled>
      <div style={{ flex: 1 }} />
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
        <GridToolbarDensitySelector />
      </div>
    </GridToolbarContainerStyled>
  );
};

export default memo(CustomToolbar);
