import React, { useState } from 'react';
import { Paper, Typography, Button, createTheme, ThemeProvider, CircularProgress, Box, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import './shimmerComponent.css'; // Ensure you have the shimmer CSS

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
      secondary: '#555555', // Gray text
    },
  },
});

const useStyles = {
  container: {
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    maxWidth: '600px',
    margin: '40px auto',
    padding: '50px',
    borderRadius: '0px', // Sharp edges
    background: '#ffffff',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    color: '#000000',
    textAlign: 'center',
    '@media (max-width: 600px)': {
      padding: '30px',
    },
  },
  buttonPrimary: {
    borderRadius: '20px', // More rounded buttons
    backgroundColor: '#000000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#333333',
    },
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    borderRadius: '20px', // More rounded buttons
    border: '2px solid #000000',
    color: '#000000', // Change to black
    '&:hover': {
      backgroundColor: '#000000',
      color: '#ffffff',
    },
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  summaryItem: {
    marginBottom: '10px',
    textAlign: 'left',
  },
  errorMessage: {
    marginTop: '10px',
    color: 'red',
    textAlign: 'center',
  },
  shimmer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  shimmerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0))',
    animation: 'shimmer 1.5s infinite',
  },
  breakdownToggle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#000000',
    marginTop: '10px',
  },
  breakdownText: {
    marginLeft: '8px',
    fontSize: '14px',
    color: '#000000',
  },
  priceBreakdown: {
    textAlign: 'left',
    marginTop: '10px',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  breakdownItem: {
    textAlign: 'left',
    width: '100%',
  },
  totalBalance: {
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '20px',
  },
};

const PaymentSummary = ({ priceBreakdown, totalPrice, handlePaymentChange, handlePayNow }) => {
  const [loading, setLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const classes = useStyles;

  const handleClick = async (option) => {
    setLoading(true);
    handlePaymentChange({ target: { value: option } });
    await handlePayNow(option);
    setLoading(false);
  };

  const depositPrice = totalPrice / 2;

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Paper elevation={3} sx={{ ...classes.container, ...classes.shimmer }}>
          <Box sx={classes.shimmerContent} />
          <Typography variant="h4" gutterBottom>Loading Payment Summary...</Typography>
          <CircularProgress color="primary" />
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={classes.container}>
        <Typography variant="h4" gutterBottom>PAYMENT SUMMARY</Typography>
        <Typography variant="h5" gutterBottom sx={classes.totalBalance}>TOTAL BALANCE: ${totalPrice.toFixed(2)}</Typography>
        <Box sx={classes.breakdownToggle} onClick={() => setShowBreakdown(!showBreakdown)}>
          {showBreakdown ? <ExpandLess /> : <ExpandMore />}
          <Typography sx={classes.breakdownText}>SEE PRICE BREAKDOWN</Typography>
        </Box>
        <Collapse in={showBreakdown}>
          <Box sx={classes.priceBreakdown}>
            <Typography variant="body1" sx={classes.summaryItem} className={classes.breakdownItem}>BASE RATE: ${priceBreakdown.baseRate}</Typography>
            <Typography variant="body1" sx={classes.summaryItem} className={classes.breakdownItem}>EXTRA GUEST FEE: ${priceBreakdown.guestFee}</Typography>
            <Typography variant="body1" sx={classes.summaryItem} className={classes.breakdownItem}>CLEANING FEE: ${priceBreakdown.cleaningFee}</Typography>
            {Object.keys(priceBreakdown.addOns).map((addOn) => (
              <Typography key={addOn} variant="body1" sx={classes.summaryItem} className={classes.breakdownItem}>
                {addOn.charAt(0).toUpperCase() + addOn.slice(1)}: ${priceBreakdown.addOns[addOn]}
              </Typography>
            ))}
          </Box>
        </Collapse>
        <Button onClick={() => handleClick(1)} sx={classes.buttonSecondary}>
          PAY 50% DEPOSIT - ${depositPrice.toFixed(2)}
        </Button>
        <Button onClick={() => handleClick(2)} sx={classes.buttonPrimary}>
          PAY FULL BALANCE - ${totalPrice.toFixed(2)}
        </Button>
      </Paper>
    </ThemeProvider>
  );
};

export default PaymentSummary;
