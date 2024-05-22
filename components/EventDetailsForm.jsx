import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Typography, Paper, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAvailableTimes } from './useAvailableTimes'; // Custom hook
import Head from 'next/head';
import './datepicker.css';
import './shimmer.css';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      paper: '#ffffff',
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

const Container = styled(Paper)(({ theme }) => ({
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '90%',
  maxWidth: '600px',
  margin: '40px auto',
  padding: '50px',
  borderRadius: '0px', // Sharp edges
  background: '#ffffff',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
  color: '#000000',
  [theme.breakpoints.down('sm')]: {
    padding: '30px',
    margin: '20px auto',
  },
}));

const FormGroup = styled(Box)({
  marginBottom: '20px',
  width: '100%',
});

const StyledButtonPrimary = styled(Button)({
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
});

const StyledButtonSecondary = styled(Button)({
  borderRadius: '20px', // More rounded buttons
  borderColor: '#000000',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#000000',
    color: '#ffffff',
  },
  width: '100%',
  marginTop: '20px',
  padding: '10px',
  fontSize: '16px',
  fontWeight: 'bold',
});

const ErrorMessage = styled(Typography)({
  marginTop: '10px',
  color: 'red',
  minHeight: '24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px', // Sharp edges
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px', // Sharp edges
  },
});

const TickerText = ({ texts, interval = 5000, charInterval = 50 }) => {
  const [displayText, setDisplayText] = useState(texts[0]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    const textTicker = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      setCurrentCharIndex(0);
    }, interval);

    return () => clearInterval(textTicker);
  }, [texts, interval]);

  useEffect(() => {
    const charTicker = setInterval(() => {
      setDisplayText((prevText) => {
        const newText = texts[currentTextIndex].substring(0, currentCharIndex + 1);
        return newText + texts[currentTextIndex].substring(currentCharIndex + 1).replace(/./g, ' ');
      });
      setCurrentCharIndex((prevIndex) => prevIndex + 1);
    }, charInterval);

    if (currentCharIndex >= texts[currentTextIndex].length) {
      clearInterval(charTicker);
    }

    return () => clearInterval(charTicker);
  }, [texts, currentTextIndex, currentCharIndex, charInterval]);

  return (
    <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, letterSpacing: '0.1em', marginBottom: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
      {displayText}
    </Typography>
  );
};

const EventDetailsForm = ({ onConfirmDetails }) => {
  const { register, handleSubmit, watch, formState: { errors }, setValue, control } = useForm({
    defaultValues: {
      date: null,
    },
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false);
  const secondSectionRef = useRef(null);

  const watchedDate = watch("date");
  const { loadingTimes, startTimes, endTimes, convertTo24HourFormat } = useAvailableTimes(watchedDate);

  const onFormSubmit = useCallback(data => {
    const formattedStartDateTime = combineDateAndTime(data.date, startTime);
    const formattedEndDateTime = combineDateAndTime(data.date, endTime);

    if (formattedEndDateTime < formattedStartDateTime) {
      formattedEndDateTime.setDate(formattedEndDateTime.getDate() + 1);
    }

    onConfirmDetails({
      name: data.name,
      email: data.email,
      phone: data.phone,
      guests: data.guests,
      startDateTime: formattedStartDateTime.toISOString(),
      endDateTime: formattedEndDateTime.toISOString(),
      startdate: formattedStartDateTime.toISOString().slice(0, 10),
      starttime: startTime,
      enddate: formattedEndDateTime.toISOString().slice(0, 10),
      endtime: endTime,
      eventDetails: data.eventDetails,
      hostId: 0,
    });
  }, [startTime, endTime, onConfirmDetails]);

  const combineDateAndTime = useCallback((date, time) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0);
    return dateTime;
  }, []);

  const wordCountValidator = useCallback(text => {
    return text.split(/\s+/).filter(Boolean).length <= 200;
  }, []);

  const isSectionOneValid = useCallback(() => {
    return selectedDate && startTime && endTime && !errors.guests;
  }, [selectedDate, startTime, endTime, errors]);

  const handleNextClick = useCallback(() => {
    setAttemptedNext(true);
    if (isSectionOneValid()) {
      setShowSecondSection(true);
      setTimeout(() => {
        secondSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isSectionOneValid]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Head></Head>
      <Container elevation={3}>
        <TickerText texts={['BOOK NOW', 'RESERVE THE STUDIO']} />
        <form onSubmit={handleSubmit(onFormSubmit)} style={{ width: '100%' }}>
          <FormGroup>
            <StyledFormControl variant="outlined" fullWidth>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setValue("date", date);
                      setStartTime('');
                      setEndTime('');
                    }}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    customInput={<StyledTextField label="Date" variant="outlined" fullWidth />}
                    popperClassName="popperClass"
                  />
                )}
              />
            </StyledFormControl>
          </FormGroup>
          <FormGroup>
            <StyledFormControl variant="outlined" fullWidth className={loadingTimes ? 'shimmer' : ''}>
              <InputLabel>{selectedDate ? "Start Time" : "Select Date First"}</InputLabel>
              <Select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={!selectedDate || loadingTimes}
                label="Start Time"
              >
                {!loadingTimes && startTimes.map((timeSlot, index) => (
                  <MenuItem key={index} value={timeSlot.time} disabled={!timeSlot.isAvailable}>
                    {timeSlot.time}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </FormGroup>
          <FormGroup>
            <StyledFormControl variant="outlined" fullWidth className={loadingTimes ? 'shimmer' : ''}>
              <InputLabel>{startTime ? "End Time" : "Select Start Time First"}</InputLabel>
              <Select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!startTime || loadingTimes}
                label="End Time"
              >
                {!loadingTimes && endTimes
                  .filter(timeSlot => {
                    const startCondition = convertTo24HourFormat(startTime);
                    let endCondition = convertTo24HourFormat(timeSlot.time);
                    if (endCondition < startCondition) {
                      if (endCondition <= 2) {
                        endCondition += 24;
                      } else {
                        return false;
                      }
                    }
                    return startCondition !== null && endCondition !== null && endCondition > startCondition;
                  })
                  .map((timeSlot, index) => (
                    <MenuItem key={index} value={timeSlot.time} disabled={!timeSlot.isAvailable}>
                      {timeSlot.time}
                    </MenuItem>
                  ))}
                {!loadingTimes && endTimes.some(timeSlot => convertTo24HourFormat(timeSlot.time) === 1) && (
                  <MenuItem value="02:00">2:00 AM</MenuItem>
                )}
              </Select>
            </StyledFormControl>
          </FormGroup>
          <FormGroup>
            <StyledTextField
              label="Number of Attendees"
              type="number"
              variant="outlined"
              fullWidth
              {...register("guests", {
                required: "Number of guests is required",
                min: { value: 1, message: "Minimum 1 guest required" },
                max: { value: 100, message: "Maximum 100 guests allowed" }
              })}
              error={!!errors.guests}
              helperText={errors.guests?.message}
            />
          </FormGroup>
          {!showSecondSection && (
            <FormGroup>
              <StyledButtonPrimary 
                variant="contained" 
                fullWidth 
                onClick={handleNextClick}
              >
                Next
              </StyledButtonPrimary>
              {attemptedNext && !isSectionOneValid() && (
                <ErrorMessage variant="body2" color="error" align="center">
                  Please fill out all required fields in this section.
                </ErrorMessage>
              )}
            </FormGroup>
          )}
          {showSecondSection && (
            <Box ref={secondSectionRef}>
              <FormGroup>
                <StyledTextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </FormGroup>
              <FormGroup>
                <StyledTextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Invalid email address" }
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </FormGroup>
              <FormGroup>
                <StyledTextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number, must be 10 digits" }
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </FormGroup>
              <FormGroup>
                <StyledTextField
                  label="Details"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  {...register("eventDetails", {
                    validate: wordCountValidator,
                    required: "Details are required"
                  })}
                  error={!!errors.eventDetails}
                  helperText={errors.eventDetails?.message || "Max 200 words allowed"}
                />
              </FormGroup>
              <FormGroup>
                <StyledButtonPrimary type="submit" variant="contained" fullWidth>Confirm Details</StyledButtonPrimary>
              </FormGroup>
            </Box>
          )}
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default EventDetailsForm;
