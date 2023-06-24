import {
    alpha, buttonClasses,
    createTheme, darken,
    inputAdornmentClasses,
    inputLabelClasses,
    lighten,
    outlinedInputClasses
} from '@mui/material'

import {getThemeZIndex, pxToRem, responsiveFontSizes} from './utils'
import {common} from "@mui/material/colors";

const spacing = 10
const primary = '#26c644'
const secondary = '#22d0b8'
const error = '#ff4949'
const warning = '#FFA32C'
const grey = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
};

const getTheme = (mode) => {
    const theme = createTheme({
        spacing: spacing,
        breakpoints: {
            values: {
                xs: 0,
                sm: 576,
                //lg: 834
                md: 834,
                lg: 1200,
            },
        },
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    default: {
                        main: '#212B36',
                    },
                    primary: {
                        main: primary,
                        light: alpha(primary, 0.07),
                        dark: alpha(primary, 0.12),
                        contrastText: common.white,
                    },
                    secondary: {
                        main: secondary,
                        light: alpha(secondary, 0.07),
                        dark: alpha(secondary, 0.12),
                        contrastText: common.white,
                    },
                    info: {
                        main: secondary,
                        light: alpha(secondary, 0.07),
                        dark: alpha(secondary, 0.12),
                        contrastText: common.white,
                    },
                    warning: {
                        main: warning,
                        light: alpha(warning, 0.07),
                        dark: alpha(warning, 0.12),
                    },
                    error: {
                        main: error,
                        light: alpha(error, 0.07),
                        dark: alpha(error, 0.12),
                        contrastText: common.white,
                    },
                    grey: grey,
                    divider: alpha(grey[500], 0.24),
                    text: {
                        primary: grey[800],
                        secondary: grey[600],
                        disabled: grey[500],
                    },
                    background: {
                        paper: grey[100],
                        default: grey[200],
                        neutral: alpha(grey[500], 0.16),
                    },
                    action: {
                        active: grey[600],
                        hover: alpha(grey[500], 0.08),
                        selected: alpha(grey[500], 0.16),
                        disabled: alpha(grey[500], 0.8),
                        disabledBackground: alpha(grey[500], 0.24),
                        focus: alpha(grey[500], 0.24),
                        hoverOpacity: 0.08,
                        disabledOpacity: 0.48,
                    },
                } : {
                    default: {
                        main: common.white,
                    },
                    primary: {
                        main: primary,
                        light: alpha(primary, 0.07),
                        dark: alpha(primary, 0.12),
                        contrastText: common.white,
                    },
                    secondary: {
                        main: secondary,
                        light: alpha(secondary, 0.07),
                        dark: alpha(secondary, 0.12),
                        contrastText: common.white,
                    },
                    info: {
                        main: secondary,
                        light: alpha(secondary, 0.07),
                        dark: alpha(secondary, 0.12),
                        contrastText: common.white,
                    },
                    warning: {
                        main: warning,
                        light: alpha(warning, 0.07),
                        dark: alpha(warning, 0.12),
                    },
                    error: {
                        main: error,
                        light: alpha(error, 0.07),
                        dark: alpha(error, 0.12),
                        contrastText: common.white,
                    },
                    grey: grey,
                    divider: alpha(grey[500], 0.24),
                    text: {
                        primary: common.white,
                        secondary: grey[500],
                        disabled: grey[600],
                    },
                    background: {
                        paper: grey[900],
                        default: grey[800],
                        neutral: alpha(grey[500], 0.16),
                    },
                    action: {
                        active: grey[500],
                        hover: alpha(grey[500], 0.08),
                        selected: alpha(grey[500], 0.16),
                        disabled: alpha(grey[500], 0.8),
                        disabledBackground: alpha(grey[500], 0.24),
                        focus: alpha(grey[500], 0.24),
                        hoverOpacity: 0.08,
                        disabledOpacity: 0.48,
                    },
                }),
        },
        typography: {
            fontFamily: 'Public Sans, sans-serif',
            fontSize: 14,
            fontWeightRegular: 400,
            fontWeightMedium: 600,
            fontWeightBold: 700,
            h1: {
                fontWeight: 800,
                lineHeight: 80 / 64,
                fontSize: pxToRem(40),
                ...responsiveFontSizes({sm: 52, md: 58, lg: 64}),
            },
            h2: {
                fontWeight: 800,
                lineHeight: 64 / 48,
                fontSize: pxToRem(32),
                ...responsiveFontSizes({sm: 40, md: 44, lg: 48}),
            },
            h3: {
                fontWeight: 700,
                lineHeight: 1.5,
                fontSize: pxToRem(24),
                ...responsiveFontSizes({sm: 26, md: 30, lg: 32}),
            },
            h4: {
                fontWeight: 700,
                //lineHeight: 1.5,
                fontSize: pxToRem(20),
                ...responsiveFontSizes({sm: 20, md: 24, lg: 24}),
            },
            h5: {
                fontWeight: 700,
                lineHeight: 1.5,
                fontSize: pxToRem(18),
                ...responsiveFontSizes({sm: 19, md: 20, lg: 20}),
            },
            h6: {
                fontWeight: 700,
                lineHeight: 28 / 18,
                fontSize: pxToRem(17),
                ...responsiveFontSizes({sm: 18, md: 18, lg: 18}),
            },
            subtitle1: {
                fontWeight: 600,
                lineHeight: 1.5,
                fontSize: pxToRem(16),
            },
            subtitle2: {
                fontWeight: 600,
                lineHeight: 22 / 14,
                fontSize: pxToRem(14),
            },
            body1: {
                lineHeight: 1.5,
                fontSize: pxToRem(16),
            },
            body2: {
                lineHeight: 22 / 14,
                fontSize: pxToRem(14),
            },
            caption: {
                lineHeight: 1.5,
                fontSize: pxToRem(12),
            },
            overline: {
                fontWeight: 700,
                lineHeight: 1.5,
                fontSize: pxToRem(12),
                textTransform: 'uppercase',
            },
            button: {
                fontWeight: 700,
                lineHeight: 24 / 14,
                fontSize: pxToRem(14),
                textTransform: 'capitalize',
            },
            tag: {
                height: 24,
                maxHeight: 24,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 10px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '12px'
            }
        }
    })

    return createTheme({
        ...theme,
        components: {
            MuiPaper: {
                defaultProps: {
                    elevation: 0,
                },
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor: alpha(theme.palette.grey[800], 0.8),
                    },
                    invisible: {
                        background: 'transparent',
                    },
                },
            },
            MuiButton: {
                defaultProps: {
                    color: 'default',
                    disableRipple: true,
                    disableElevation: true,
                },

                styleOverrides: {
                    // startIcon: {
                    //     marginLeft: 0,
                    //     marginRight: theme.spacing(0.8),
                    //     '& > *:nth-of-type(1)': {
                    //         fontSize: '14px',
                    //     },
                    // },
                    // endIcon: {
                    //     marginRight: 0,
                    //     marginLeft: theme.spacing(0.8),
                    //     '& > *:nth-of-type(1)': {
                    //         fontSize: '14px',
                    //     },
                    // },
                    // root: {
                    //     borderRadius: '3px',
                    //     fontSize: theme.typography.button.fontSize,
                    //     lineHeight: '19px', //theme.typography.button.lineHeight,
                    //     minWidth: 0,
                    //     textOverflow: 'ellipsis',
                    //     overflow: 'hidden',
                    //     whiteSpace: 'nowrap',
                    //     fontWeight: 600,
                    // },
                    // sizeSmall: {
                    //     height: 25,
                    //     padding: theme.spacing(0.3, 1),
                    // },
                    // sizeMedium: {
                    //     height: 35,
                    //     padding: theme.spacing(0.8, 1.5),
                    // },
                    // sizeLarge: {
                    //     height: 40,
                    //     padding: theme.spacing(0.8, 2),
                    //     fontSize: pxToRem(16),
                    // },
                    // outlinedSizeSmall: {
                    //     padding: theme.spacing(0.2, 1),
                    // },
                    // outlinedMediumLarge: {
                    //     padding: theme.spacing(0.7, 1.5),
                    // },
                    // outlinedSizeLarge: {
                    //     padding: theme.spacing(0.7, 2),
                    // },
                },
                variants: [
                    ...['default', 'primary', 'secondary', 'error'].map((color) => ({
                        props: {variant: 'text', color},
                        style: {
                            '&:hover': {
                                backgroundColor: theme.palette[color].light,
                            },
                            '&:active': {
                                backgroundColor: theme.palette[color].light,
                                outline: `1px solid ${alpha(
                                    theme.palette[color].main,
                                    0.1
                                )}`,
                                outlineOffset: `-1px`,
                            },
                            [`&.${buttonClasses.focusVisible}`]: {
                                boxShadow: `0px 0px 0px 3px ${lighten(
                                    theme.palette.secondary.main,
                                    0.5
                                )}`,
                            },
                        },
                    })),
                    // ...['default', 'primary', 'secondary', 'error'].map((color) => {
                    //     const paletteColor =
                    //         theme.palette[color]?.main || theme.palette.secondary.main
                    //
                    //     return {
                    //         props: {
                    //             variant: 'outlined',
                    //             color,
                    //         },
                    //         style: {
                    //             backgroundColor: theme.palette.background.paper,
                    //             border: `1px solid ${lighten(paletteColor, 0.83)}`,
                    //             '&:hover': {
                    //                 backgroundColor: theme.palette.background.paper,
                    //                 border: `1px solid ${lighten(paletteColor, 0.575)}`,
                    //             },
                    //             '&:active': {
                    //                 backgroundColor: lighten(paletteColor, 0.935),
                    //                 border: `1px solid ${lighten(paletteColor, 0.83)}`,
                    //             },
                    //             [`&.${buttonClasses.focusVisible}`]: {
                    //                 boxShadow: `0px 0px 0px 3px ${lighten(
                    //                     theme.palette.secondary.main,
                    //                     0.5
                    //                 )}`,
                    //             },
                    //             [`&.${buttonClasses.disabled}`]: {
                    //                 border: `1px solid ${lighten(
                    //                     theme.palette.default.main,
                    //                     0.83
                    //                 )}`,
                    //                 boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
                    //                 color: alpha(theme.palette.default.main, 0.25),
                    //             },
                    //         },
                    //     }
                    // }),
                    ...['default', 'primary', 'secondary', 'error'].map((color) => ({
                        props: {variant: 'contained', color},
                        style: {
                            '&:hover': {
                                backgroundColor: lighten(theme.palette[color].main, 0.1),
                            },
                            '&:active': {
                                backgroundColor: darken(theme.palette[color].main, 0.04),
                            },
                            [`&.${buttonClasses.focusVisible}`]: {
                                boxShadow: `0px 0px 0px 3px ${lighten(
                                    theme.palette.secondary.main,
                                    0.5
                                )}`,
                            },
                            [`&.${buttonClasses.disabled}`]: {
                                color: theme.palette[color].contrastText,
                                backgroundColor: theme.palette.grey[300],
                            },
                            [`&.loading`]: {
                                backgroundColor: alpha(theme.palette[color].main, 0.2),
                            },
                        },
                    })),
                ],
            },
            // 	MuiOutlinedInput: {
            // 		styleOverrides: {
            // 			root: {
            // 				fontSize: '16px', // label shrink fix: 16px * 0.75(scale) = 12px
            // 				backgroundColor: theme.palette.background.default,
            // 				[`&.${outlinedInputClasses.focused}`]: {
            // 					[`& .${outlinedInputClasses.notchedOutline}`]: {
            // 						borderWidth: 1,
            // 						borderColor: theme.palette.secondary.main,
            // 					},
            // 				},
            // 				[`&.${outlinedInputClasses.error}`]: {
            // 					[`& .${outlinedInputClasses.notchedOutline}`]: {
            // 						borderWidth: 1,
            // 						borderColor: theme.palette.error.main,
            // 					},
            // 				},
            // 				[`& .${inputAdornmentClasses.root}`]: {
            // 					fontSize: 12,
            // 				},
            // 				[`&.${outlinedInputClasses.disabled}`]: {
            // 					opacity: 0.5,
            // 					[`& .${outlinedInputClasses.notchedOutline}`]: {
            // 						borderColor: theme.palette.grey.border3,
            // 					},
            // 				},
            // 			},
            // 			adornedStart: {
            // 				paddingLeft: 10,
            // 				paddingRight: 15,
            // 				[`& .${outlinedInputClasses.input}`]: {
            // 					paddingLeft: 0,
            // 				},
            // 			},
            // 			notchedOutline: {
            // 				'& > legend': {
            // 					height: 9,
            // 				},
            // 			},
            // 		},
            // 		variants: [
            // 			...['default', 'primary', 'secondary'].map((color) => {
            // 				const paletteColor =
            // 					theme.palette[color]?.main || theme.palette.secondary.main
            //
            // 				return {
            // 					props: { color },
            // 					style: {
            // 						[`&:not(.${outlinedInputClasses.disabled})`]: {
            // 							[`& .${inputAdornmentClasses.positionStart}`]: {
            // 								color: lighten(paletteColor, 0.49),
            // 							},
            // 							[`& .${inputAdornmentClasses.positionEnd}`]: {
            // 								color: lighten(paletteColor, 0.42),
            // 							},
            // 							[`&:not(.${outlinedInputClasses.focused}):hover .${outlinedInputClasses.notchedOutline}`]:
            // 								{
            // 									borderColor: lighten(paletteColor, 0.575),
            // 								},
            // 						},
            // 						[`& .${outlinedInputClasses.input}::placeholder`]: {
            // 							color: lighten(paletteColor, 0.49),
            // 						},
            // 						[`& .${outlinedInputClasses.notchedOutline}`]: {
            // 							borderColor: lighten(paletteColor, 0.83),
            // 						},
            // 					},
            // 				}
            // 			}),
            // 		],
            // 	},
            // 	MuiInputLabel: {
            // 		styleOverrides: {
            // 			root: {
            // 				color: 'inherit',
            // 				[`&.${inputLabelClasses.focused}`]: {
            // 					color: 'inherit',
            // 					[`&.${inputLabelClasses.outlined}`]: {
            // 						color: theme.palette.secondary.main,
            // 					},
            // 				},
            // 			},
            // 			asterisk: {
            // 				color: theme.palette.error.main,
            // 			},
            // 		},
            // 	},
            // 	MuiTextField: {
            // 		defaultProps: {
            // 			color: 'default',
            // 			size: 'large',
            // 		},
            // 		styleOverrides: {
            // 			root: {
            // 				input: {
            // 					height: '1.25em',
            // 					lineHeight: '1.25em',
            // 					fontSize: theme.typography.body1.fontSize,
            // 				},
            // 			},
            // 		},
            // 		variants: [
            // 			...['default', 'primary', 'secondary', 'error'].map((color) => {
            // 				const paletteColor =
            // 					theme.palette[color]?.main || theme.palette.secondary.main
            //
            // 				return {
            // 					props: { color, size: 'small' },
            // 					style: {
            // 						input: {
            // 							fontSize: theme.typography.body2.fontSize,
            // 							padding: theme.spacing(0.5),
            // 						},
            // 						[`& .${inputLabelClasses.root}`]: {
            // 							color: lighten(paletteColor, 0.32),
            // 							fontSize: theme.typography.body2.fontSize,
            // 							transform: 'translate(5px, 4px) scale(1)',
            // 							[`&.${inputLabelClasses.disabled}`]: {
            // 								opacity: 0.5,
            // 								color: lighten(textPrimary, 0.49),
            // 							},
            // 						},
            // 						[`& .${inputLabelClasses.shrink}`]: {
            // 							transform: 'translate(14px, -9px) scale(0.75)',
            // 							fontSize: '16px',
            // 						},
            // 					},
            // 				}
            // 			}),
            // 			...['default', 'primary', 'secondary', 'error'].map((color) => {
            // 				const paletteColor =
            // 					theme.palette[color]?.main || theme.palette.secondary.main
            //
            // 				return {
            // 					props: { color, size: 'medium' },
            // 					style: {
            // 						input: {
            // 							padding: theme.spacing(0.875, 1.5),
            // 						},
            // 						[`& .${inputLabelClasses.root}`]: {
            // 							color: lighten(paletteColor, 0.32),
            // 							transform: 'translate(15px, 8px) scale(1)',
            // 							[`&.${inputLabelClasses.disabled}`]: {
            // 								opacity: 0.5,
            // 								color: lighten(textPrimary, 0.49),
            // 							},
            // 						},
            // 						[`& .${inputLabelClasses.shrink}`]: {
            // 							transform: 'translate(14px, -10px) scale(0.75)',
            // 							fontSize: '16px',
            // 						},
            // 					},
            // 				}
            // 			}),
            // 			...['default', 'primary', 'secondary', 'error'].map((color) => {
            // 				const paletteColor =
            // 					theme.palette[color]?.main || theme.palette.secondary.main
            //
            // 				return {
            // 					props: { color, size: 'large' },
            // 					style: {
            // 						input: {
            // 							padding: theme.spacing(1.375, 1.5),
            // 						},
            // 						[`& .${inputLabelClasses.root}`]: {
            // 							color: lighten(paletteColor, 0.32),
            // 							transform: 'translate(15px, 12px) scale(1)',
            // 							[`&.${inputLabelClasses.disabled}`]: {
            // 								opacity: 0.5,
            // 								color: lighten(textPrimary, 0.49),
            // 							},
            // 						},
            // 						[`& .${inputLabelClasses.shrink}`]: {
            // 							transform: 'translate(14px, -10px) scale(0.75)',
            // 							fontSize: '16px',
            // 						},
            // 					},
            // 				}
            // 			}),
            // 		],
            // 	},
        },
    })
}

export default getTheme
