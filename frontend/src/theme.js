import { createTheme } from '@mui/material/styles';

/**
 * Thème professionnel pour l'application de gestion de formation
 * Palette de couleurs sobre et moderne
 */
const theme = createTheme({
    palette: {
        primary: {
            main: '#1E2A32',      // Navbar, Sidebar, Header
            light: '#2D3E4A',
            dark: '#0F1519',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#0F4C75',      // Boutons principaux
            light: '#1A6BA3',
            dark: '#0A3552',
            contrastText: '#FFFFFF'
        },
        accent: {
            main: '#3282B8',      // Liens, badges, icônes
            light: '#5BA3D0',
            dark: '#25628F'
        },
        background: {
            default: '#BBE1FA',   // Background clair
            paper: '#FFFFFF'
        },
        text: {
            primary: '#1E2A32',
            secondary: '#6B7280'
        },
        error: {
            main: '#DC2626',
            light: '#EF4444',
            dark: '#B91C1C'
        },
        warning: {
            main: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706'
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669'
        },
        info: {
            main: '#3282B8',
            light: '#5BA3D0',
            dark: '#25628F'
        },
        grey: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827'
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        h1: {
            fontWeight: 600,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em'
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.3
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.5
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.5
        },
        body1: {
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: 1.5
        },
        body2: {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.5
        },
        button: {
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
            letterSpacing: '0.02em'
        },
        caption: {
            fontWeight: 400,
            fontSize: '0.75rem',
            lineHeight: 1.5
        },
        overline: {
            fontWeight: 600,
            fontSize: '0.75rem',
            lineHeight: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
        }
    },
    shape: {
        borderRadius: 8
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        ...Array(18).fill('none')
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                },
                elevation1: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                },
                elevation2: {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover fieldset': {
                            borderColor: '#3282B8'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3282B8',
                            borderWidth: '2px'
                        }
                    }
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: '#0F4C75',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em'
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E5E7EB'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1E2A32',
                    color: '#FFFFFF',
                    borderRight: 'none'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1E2A32',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '4px 8px',
                    '&:hover': {
                        backgroundColor: 'rgba(50, 130, 184, 0.1)'
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(50, 130, 184, 0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(50, 130, 184, 0.3)'
                        }
                    }
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        }
    }
});

export default theme;
