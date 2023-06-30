import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

const CHECKBOX_COL_DEF = {
  ...GRID_CHECKBOX_SELECTION_COL_DEF,
  type: 'singleSelect'
};

const PendingRequestUIDefaultState = {
  PendingRequestsTableUIKey: {
    columns: {
      [CHECKBOX_COL_DEF.field]: {
        // from MUI X
      },
      user: {},
      department: {},
      leaveType: {},
      startDate: {},
      endDate: {},
      days: {},
      notes: {}
    },
    density: 'standard' // ENUM - standard / comfortable / compact
  },
  PendingRequestsFiltersUIKey: {
    filters: []
  },
  PendingRequestsOrderUIKey: {}
};

export default PendingRequestUIDefaultState;
