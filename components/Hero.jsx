import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Dialog, DialogContent, Box, IconButton, Typography, Paper, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import heroPhoto from './herophoto.png';
import heroVideo from './herovideo.mp4';
import './buttonAnimation.css'; // Add this for custom animations

// Create a light theme for the minimalist design
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

const HeroImage = styled(Image)({
  borderRadius: '0px', // Sharp edges
  width: '100%',
});

const StyledButton = styled(Button)({
  borderRadius: '20px', // More rounded buttons
  margin: '10px 0', // Adding more space between buttons
  width: '100%', // Ensuring buttons are full width
});

const Hero = ({ eventDetailsRef }) => {
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [showVideoTourModal, setShowVideoTourModal] = useState(false);
  const [buttonText, setButtonText] = useState("Get Instant Quote");

  useEffect(() => {
    const texts = ["Get An Instant Quote", "Book Now"];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setButtonText(texts[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBookNowClick = () => {
    eventDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCalendlyOpen = () => {
    setShowCalendlyModal(true);
  };

  const handleCalendlyClose = () => {
    setShowCalendlyModal(false);
  };

  const handleVideoTourOpen = () => {
    setShowVideoTourModal(true);
  };

  const handleVideoTourClose = () => {
    setShowVideoTourModal(false);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Helvetica+Neue:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Container elevation={3}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, letterSpacing: '0.1em', marginBottom: '40px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          STUDIO SUNSET CHICAGO.LLC
        </Typography>
        <Box sx={{ position: 'relative', width: '100%', height: 'auto', mb: 4 }}>
          <HeroImage src={heroPhoto} alt="Hero" layout="responsive" objectFit="cover" />
        </Box>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 400, marginBottom: '30px', maxWidth: '80%' }}>
          CHICAGO'S PREMIER DAYLIGHT STUDIO
        </Typography>
        <StyledButton 
          variant="contained" 
          onClick={handleBookNowClick} 
          sx={{ backgroundColor: '#000000', color: '#ffffff', '&:hover': { backgroundColor: '#333333' } }}
          className="animated-button"
        >
          {buttonText}
        </StyledButton>
        <Link href="mailto:Hello@studiosunsetchicago.com" passHref legacyBehavior>
          <StyledButton component="a" variant="outlined" sx={{ borderColor: '#000000', color: '#000000', '&:hover': { backgroundColor: '#000000', color: '#ffffff' } }}>
            Contact us
          </StyledButton>
        </Link>
        <Link href="https://www.studiosunsetchicago.com/gallery" passHref legacyBehavior>
          <StyledButton component="a" variant="outlined" sx={{ borderColor: '#000000', color: '#000000', '&:hover': { backgroundColor: '#000000', color: '#ffffff' } }}>
            Gallery
          </StyledButton>
        </Link>
      </Container>

      <Dialog
        open={showCalendlyModal}
        onClose={handleCalendlyClose}
        PaperProps={{
          style: {
            margin: 0,
            maxWidth: 'unset',
            maxHeight: 'unset',
            width: 'fit-content',
            height: 'fit-content',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ padding: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            aria-label="close"
            onClick={handleCalendlyClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#000000',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: { xs: '320px', sm: '480px' }, height: { xs: '400px', sm: '630px' }, position: 'relative' }}>
            <iframe
              src="https://calendly.com/oravew/visit?hide_event_type_details=1&hide_gdpr_banner=1&background_color=ffffff&text_color=000000&primary_color=000000"
              title="Calendly Inline Widget"
              style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showVideoTourModal}
        onClose={handleVideoTourClose}
        PaperProps={{
          style: {
            margin: 0,
            maxWidth: 'unset',
            maxHeight: 'unset',
            width: 'fit-content',
            height: 'fit-content',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ padding: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton
            aria-label="close"
            onClick={handleVideoTourClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#000000',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ width: { xs: '320px', sm: '640px' }, height: { xs: '180px', sm: '360px' }, position: 'relative' }}>
            <video
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
              autoPlay
              loop
              muted
              controls
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default Hero;
