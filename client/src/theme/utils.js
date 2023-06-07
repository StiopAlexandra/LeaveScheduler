export const getThemeZIndex = ({ baseZIndex = 1000 }) => {
	return {
		mobileStepper: baseZIndex,
		speedDial: baseZIndex + 50,
		appBar: baseZIndex + 100,
		drawer: baseZIndex + 200,
		modal: baseZIndex + 300,
		snackbar: baseZIndex + 400,
		tooltip: baseZIndex + 500,
	}
}

export function remToPx(value) {
	return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
	return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
	return {
		'@media (min-width:576px)': {
			fontSize: pxToRem(sm),
		},
		'@media (min-width:834px)': {
			fontSize: pxToRem(md),
		},
		'@media (min-width:1200px)': {
			fontSize: pxToRem(lg),
		},
	};
}
