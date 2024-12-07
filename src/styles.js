import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#CDDC39', // Lime green
      dark: '#AFB42B', // Dark lime green
    },
    grey: {
      100: '#F5F5F5', // Light gray
      700: '#616161', // Dark gray
    },
  },
  typography: {
    fontFamily: '"Parkinsans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
