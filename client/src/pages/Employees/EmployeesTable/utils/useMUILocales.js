import { useTranslation } from 'react-i18next'

/**
 * `localeText` passed to Grid
 * https://mui.com/api/data-grid/data-grid-pro/#main-content
 * https://github.com/mui-org/material-ui-x/blob/HEAD/packages/grid/_modules_/grid/constants/localeTextConstants.ts
 * */
export const useMUILocales = () => {
	const { t } = useTranslation()
	return {
		// Root
		noRowsLabel: t('No rows'),
		noResultsOverlayLabel: t('No results found.'),
		errorOverlayDefaultLabel: t('An error occurred.'),

		// Density selector toolbar button text
		toolbarDensity: t('Density'),
		toolbarDensityLabel: t('Density'),
		toolbarDensityCompact: t('Compact'),
		toolbarDensityStandard: t('Standard'),
		toolbarDensityComfortable: t('Comfortable'),

		// Columns selector toolbar button text
		toolbarColumns: t('Columns'),
		toolbarColumnsLabel: t('Select columns'),

		// Filters toolbar button text
		toolbarFilters: t('Filters'),
		toolbarFiltersLabel: t('Show filters'),
		toolbarFiltersTooltipHide: t('Hide filters'),
		toolbarFiltersTooltipShow: t('Show filters'),
		toolbarFiltersTooltipActive: count =>
			count !== 1 ? `${count} ${t('active filters')}` : `${count} ${t('active filter')}`,

		// Export selector toolbar button text
		toolbarExport: t('Export'),
		toolbarExportLabel: t('Export'),
		toolbarExportCSV: t('Download as CSV'),
		toolbarExportPrint: t('Print'),

		// Columns panel text
		columnsPanelTextFieldLabel: t('Find column'),
		columnsPanelTextFieldPlaceholder: t('Column title'),
		columnsPanelDragIconLabel: t('Reorder column'),
		columnsPanelShowAllButton: t('Show all'),
		columnsPanelHideAllButton: t('Hide all'),

		// Filter panel text
		filterPanelAddFilter: t('Add filter'),
		filterPanelDeleteIconLabel: t('Delete'),
		filterPanelOperators: t('Operators'),
		filterPanelOperatorAnd: t('And'),
		filterPanelOperatorOr: t('Or'),
		filterPanelColumns: t('Columns'),
		filterPanelInputLabel: t('Value'),
		filterPanelInputPlaceholder: t('Filter value'),

		// Filter operators text
		filterOperatorContains: t('contains'),
		filterOperatorEquals: t('equals'),
		filterOperatorStartsWith: t('starts with'),
		filterOperatorEndsWith: t('ends with'),
		filterOperatorIs: t('is'),
		filterOperatorNot: t('is not'),
		filterOperatorAfter: t('is after'),
		filterOperatorOnOrAfter: t('is on or after'),
		filterOperatorBefore: t('is before'),
		filterOperatorOnOrBefore: t('is on or before'),
		filterOperatorIsEmpty: t('is empty'),
		filterOperatorIsNotEmpty: t('is not empty'),

		// Filter values text
		filterValueAny: t('any'),
		filterValueTrue: t('true'),
		filterValueFalse: t('false'),

		// Column menu text
		columnMenuLabel: t('Menu'),
		columnMenuShowColumns: t('Show columns'),
		columnMenuFilter: t('Filter'),
		columnMenuHideColumn: t('Hide'),
		columnMenuUnsort: t('Unsort'),
		columnMenuSortAsc: t('Sort by ASC'),
		columnMenuSortDesc: t('Sort by DESC'),

		// Column header text
		columnHeaderFiltersTooltipActive: count =>
			count !== 1 ? `${count} ${t('active filters')}` : `${count} ${t('active filter')}`,
		columnHeaderFiltersLabel: t('Show filters'),
		columnHeaderSortIconLabel: t('Sort'),

		// Rows selected footer text
		footerRowSelected: count =>
			count !== 1
				? `${count.toLocaleString()} ${t('rows selected')}`
				: `${count.toLocaleString()} ${t('row selected')}`,

		// Total rows footer text
		footerTotalRows: t('Total Rows:'),

		// Total visible rows footer text
		footerTotalVisibleRows: (visibleCount, totalCount) =>
			`${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

		// Checkbox selection text
		checkboxSelectionHeaderName: t('Checkbox selection'),

		// Boolean cell text
		booleanCellTrueLabel: t('true'),
		booleanCellFalseLabel: t('false'),

		// Actions cell more text
		actionsCellMore: t('more'),

		// Used core components translation keys
		MuiTablePagination: {}
	}
}
