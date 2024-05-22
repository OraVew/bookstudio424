import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Paper, Typography, Button, Box, createTheme, ThemeProvider, Divider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light', // Switch to light mode
    primary: {
      main: '#000000', // Black color
    },
    secondary: {
      main: '#000000', // Black color
    },
    background: {
      default: '#ffffff', // White background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#555555', // Grey text
    },
  },
  typography: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    h4: {
      fontWeight: 500,
      marginBottom: '20px',
      letterSpacing: '0.1em',
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 300,
    },
  },
});

const useStyles = {
  container: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    width: '90%',
    maxWidth: '600px',
    margin: '40px auto',
    padding: '50px',
    borderRadius: '0px', // Sharp edges
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
    border: '1px solid #ccc',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  button: {
    borderRadius: '20px', // More rounded buttons
    backgroundColor: '#000000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#333333',
    },
    width: '100%',
    marginTop: '20px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  link: {
    color: '#000000',
    textAlign: 'center',
    marginTop: '20px',
    textDecoration: 'none',
  },
  section: {
    marginBottom: '10px',
  },
  divider: {
    margin: '10px 0',
  },
};

export default function Success() {
  const [myObject, setMyObject] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const classes = useStyles;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");

    if (data) {
      const decodedJsonString = decodeURIComponent(data);
      const object = JSON.parse(decodedJsonString);
      setMyObject(object); // Set myObject here
    }
  }, []);

  useEffect(() => {
    if (myObject && myObject.eventDate) {
      const eventDate = new Date(myObject.eventDate);
      const formattedEventDate = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setFormattedDate(formattedEventDate);

      // Calculate the due date (3 days before the event date)
      eventDate.setDate(eventDate.getDate() - 3);
      const formattedDueDate = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      setDueDate(formattedDueDate);
    }
  }, [myObject]); // Depend on myObject to rerun this effect

  return (
    <ThemeProvider theme={theme}>
      <Box sx={classes.wrapper}>
        <Paper elevation={3} sx={classes.container}>
          {myObject ? (
            <>
              <Box sx={classes.header}>
                <Typography variant="h4" gutterBottom>Your booking is reserved, {myObject.name}!</Typography>
              </Box>
              <Box sx={classes.section}>
                <Typography variant="body1">We look forward to your booking from {myObject.startTime} - {myObject.endTime} on {formattedDate}.</Typography>
                <Divider sx={classes.divider} />
                <Typography variant="body1">Balance Paid: ${myObject.amount - myObject.balanceOwed}</Typography>
                <Typography variant="body1">Balance Owed: ${myObject.balanceOwed}</Typography>
                <Divider sx={classes.divider} />
                <Typography variant="body1">Final payment is due by {dueDate}.</Typography>
                <Divider sx={classes.divider} />
                <Typography variant="body2">Keep an eye on your email and phone for your receipt and updates on your booking with OraVew!</Typography>
              </Box>
            </>
          ) : (
            <Typography variant="body1" gutterBottom>Loading your booking details...</Typography>
          )}
          <Link href="/" passHref>
            <Button sx={classes.button}>Return to Home</Button>
          </Link>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
