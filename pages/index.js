import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { calculatePrice } from '../components/priceCalculation';
import CheckoutForm from '../components/CheckoutForm';
import EventDetailsForm from '../components/EventDetailsForm';
import PaymentSummary from '../components/PaymentSummary';
import Hero from '../components/Hero';
import { Container, Box, ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../styles/theme';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const paymentSummaryRef = useRef(null);
  const eventDetailsRef = useRef(null);
  const [clientSecret, setClientSecret] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentOption, setPaymentOption] = useState(0);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState({
    baseRate: 0,
    guestFee: 0,
    cleaningFee: 0,
    addOns: {}
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(0);
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [balanceOwed, setBalanceOwed] = useState(0);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    name: '',
    phone: 0,
    email: '',
    amount: 0,
    balanceOwed: 0,
    eventDate: '',
    startTime: '',
    endTime: '',
    guestCount: 0,
    hostId: 0
  });

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    if (detailsConfirmed && paymentSummaryRef.current) {
      paymentSummaryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [detailsConfirmed]);

  const onConfirmDetails = async (data) => {
    const { name, phone, email, guests, startDateTime, endDateTime, eventDetails, hostId } = data;
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    try {
      const pricingDetails = await calculatePrice({ startDate, endDate, guests, hostId });

      setTotalPrice(pricingDetails.totalCost);
      setPriceBreakdown(pricingDetails.breakdown);
      setName(name);
      setPhone(phone);
      setEmail(email);
      setEventDate(startDate.toISOString().slice(0, 10));
      setStartTime(startDate.toTimeString().slice(0, 5));
      setEndTime(endDate.toTimeString().slice(0, 5));
      setGuestCount(guests);
      setPaymentDetails({
        name,
        phone,
        email,
        amount: pricingDetails.totalCost,
        balanceOwed: pricingDetails.totalCost - (paymentOption === 1 ? pricingDetails.totalCost / 2 : pricingDetails.totalCost),
        eventDate: startDate.toISOString(),
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        guestCount: guests,
        eventDetails: eventDetails,
        hostId: 0
      });
      setDetailsConfirmed(true);
      paymentSummaryRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentOption(Number(event.target.value));
  };

  const handlePayNow = (option) => {
    const amountToPay = option === 1 ? totalPrice / 2 : totalPrice;

    console.log('Amount to pay:', amountToPay);

    if (!paymentInitiated && amountToPay > 0) {
      const paymentMethod = option === 1 ? 'deposit' : 'full';

      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToPay, receipt_email: email })
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setPaymentInitiated(true);

          setPaymentDetails((prevDetails) => ({
            ...prevDetails,
            paymentIntentId: data.paymentIntentId,
            balanceOwed: totalPrice - amountToPay,
            paymentMethod
          }));
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  if (!clientSecret) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Hero className="brand-hero" eventDetailsRef={eventDetailsRef} />
          <Box ref={eventDetailsRef}>
            <EventDetailsForm className="brand-form" onConfirmDetails={onConfirmDetails} />
          </Box>
          {detailsConfirmed && (
            <Box ref={paymentSummaryRef} className="formGroup my-4">
              <PaymentSummary
                priceBreakdown={priceBreakdown}
                totalPrice={totalPrice}
                handlePaymentChange={handlePaymentChange}
                handlePayNow={handlePayNow}
              />
            </Box>
          )}
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App overflow-y-scroll bg-white text-gray-800 font-sans">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <Container maxWidth="md" className="formGroup my-4">
              <CheckoutForm className="paragraph" paymentDetails={paymentDetails} />
            </Container>
          </Elements>
        )}
      </Box>
    </ThemeProvider>
  );
}
