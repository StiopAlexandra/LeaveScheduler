import { GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

const CHECKBOX_COL_DEF = {
  ...GRID_CHECKBOX_SELECTION_COL_DEF,
  type: 'singleSelect'
};

const UserUIDefaultState = {
  UsersTableUIKey: {
    columns: {
      [CHECKBOX_COL_DEF.field]: {
        // from MUI X
      },
      name: {},
      email: {},
      manager: {},
      department: {},
      phone: {},
      address: {},
      role: {},
      type: {},
      dateOfBirth: {},
      dateOfEmployment: {},
      status: {}
    },
    density: 'standard' // ENUM - standard / comfortable / compact
  },
  UsersFiltersUIKey: {
    filters: []
  },
  UsersOrderUIKey: {}
};

export default UserUIDefaultState;
