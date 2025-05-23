import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3699FF',
      light: '#65B7FF',
      dark: '#0073CC',
    },
    secondary: {
      main: '#36B37E',
      light: '#65DFAE',
      dark: '#008652',
    },
    error: {
      main: '#F64E60',
      light: '#FF7B8C',
      dark: '#D62338',
    },
    warning: {
      main: '#FFA800',
      light: '#FFD566',
      dark: '#DB8B00',
    },
    info: {
      main: '#8950FC',
      light: '#BB8BFC',
      dark: '#5605FB',
    },
    success: {
      main: '#1BC5BD',
      light: '#58E1DA',
      dark: '#0B9D96',
    },
    background: {
      default: '#151521',
      paper: '#1E1E2D',
      card: '#212E48',
      darker: '#111118',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    text: {
      primary: '#FFFFFF',
      secondary: '#92929F',
      disabled: '#6D6D80',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#151521',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1E1E2D',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3F3F5F',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#4E4E6F',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1E1E2D',
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0073CC 0%, #3699FF 100%)',
          boxShadow: '0 4px 12px rgba(54, 153, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0073CC 0%, #3699FF 100%)',
            boxShadow: '0 4px 16px rgba(54, 153, 255, 0.4)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
      }
    },
  },
});

export default DarkTheme;
