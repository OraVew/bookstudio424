import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createTheme, ThemeProvider, Paper, Typography, Button, Box } from '@mui/material';
import TermsOfService from './TermsOfService';

const theme = createTheme({
  palette: {
    mode: 'light',
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
  errorMessage: {
    marginTop: '10px',
    color: 'red',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  label: {
    color: '#000000',
    marginBottom: '8px',
  },
};

const CheckoutForm = ({ paymentDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("Please agree to the terms and conditions before proceeding.");
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const classes = useStyles;

  useEffect(() => {
    console.log("Updated payment details in CheckoutForm:", paymentDetails);
  }, [paymentDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !agreed) {
      setMessage("Please agree to the terms and conditions before proceeding.");
      return;
    }
    setIsLoading(true);

    savePaymentDetails();

    const jsonString = JSON.stringify(paymentDetails);
    const encodedJsonString = encodeURIComponent(jsonString);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?data=${encodedJsonString}`,
      },
    });

    if (error) {
      console.log("Error in Stripe payment:", error);
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment succeeded:", paymentIntent);
      setIsLoading(false);
    } else {
      setMessage("Your payment was not successful, please try again.");
      setIsLoading(false);
    }
  };

  const savePaymentDetails = () => {
    console.log("Attempting to save payment details", paymentDetails);
    fetch('/api/save-payment-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentDetails)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Payment details saved:', data);
    })
    .catch(error => {
      console.error('Failed to save payment details:', error);
      setMessage("Failed to save customer details, please contact support.");
    });
  };

  const handleAgreeChange = (checked) => {
    setAgreed(checked);
    if (checked) {
      setMessage(""); // Clear the error message when terms are agreed
    } else {
      setMessage("Please agree to the terms and conditions before proceeding.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={classes.container}>
        <Typography variant="h4" gutterBottom align="center">PAYMENT DETAILS</Typography>
        <TermsOfService onAgree={handleAgreeChange} />
        <form onSubmit={handleSubmit}>
          <Box sx={classes.formGroup}>
            <Typography variant="subtitle1" sx={classes.label}>CARD DETAILS</Typography>
            <PaymentElement options={{
              style: {
                base: {
                  color: '#000000',
                  '::placeholder': {
                    color: '#555555'
                  }
                },
                invalid: {
                  color: '#ff5722',
                },
              },
            }}/>
          </Box>
          <Button type="submit" disabled={isLoading || !agreed} sx={classes.button}>
            Confirm Reservation
          </Button>
          {!agreed && (
            <Typography variant="body2" sx={classes.errorMessage}>
              {message}
            </Typography>
          )}
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default CheckoutForm;
