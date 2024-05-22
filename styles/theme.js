import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Switch to light mode
    primary: { main: '#000000' }, // Set primary color to black
    secondary: { main: '#000000' }, // Set secondary color to black
    background: { default: '#ffffff', paper: '#ffffff' }, // Set background colors to white
    text: { primary: '#000000', secondary: '#555555' }, // Set text colors to black and gray
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", // Update to Helvetica Neue
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // More rounded buttons
          textTransform: 'none', // Disable uppercase transformation
        },
        contained: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0px', // Sharp edges for containers
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#000000',
            },
            '&:hover fieldset': {
              borderColor: '#333333',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontWeight: 500,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        },
      },
    },
  },
});

export default theme;
