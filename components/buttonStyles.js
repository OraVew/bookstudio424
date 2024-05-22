import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#673ab7', // purplish color
    },
    secondary: {
      main: '#ff5722', // orangish color
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
});

const useButtonStyles = {
  primaryButton: {
    backgroundColor: '#ff5722',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#e64a19',
    },
    width: '100%',
    marginTop: '20px',
  },
  secondaryButton: {
    backgroundColor: '#673ab7', // Purple background
    color: '#fff', // White text color
    '&:hover': {
      backgroundColor: 'rgba(103, 58, 183, 0.8)', // Slightly darker purple on hover
    },
    width: '100%',
    marginTop: '20px',
  },
};

export { theme, useButtonStyles };
