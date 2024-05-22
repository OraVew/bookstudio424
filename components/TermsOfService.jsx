// components/TermsOfService.jsx
import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Paper, ThemeProvider, createTheme } from '@mui/material';

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
      paper: '#f0f0f0', // Light grey background for terms section
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#555555', // Grey text
    },
  },
});

const termsText = `
  You accept that using the space and rental equipment has risks, like personal injury, property damage, and equipment malfunction. I agree to use everything responsibly.

  You release OraVew and its affiliates from any claims or expenses related to my use of the event space and rental equipment, including personal injury, property damage, or loss.

  You agree to cover all claims, costs, and expenses, including attorney's fees, connected to my use of the event space and rental equipment, including claims by third parties.

  You agree to use the event space and rental equipment responsibly, report any damage or malfunction, and take responsibility for any damage I cause.

  You agree to follow all laws, regulations, and rules while using the event space and rental equipment, and refrain from any illegal or dangerous activities.

  Some of our neighbors work long hours from the office. You acknowledge that you are responsible for keeping guests inside the space and away from the hallways during your reservation.

  You acknowledge that you are responsible for picking/cleaning up anything that you or your guests might have brought and taking the trash out.
`;

const TermsOfService = ({ onAgree }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onAgree(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: theme.palette.background.paper, borderRadius: '0px' }}>
        <Typography variant="h5" gutterBottom>TERMS OF SERVICE</Typography>
        <Box sx={{ maxHeight: '150px', overflowY: 'scroll', mb: 2, p: 1, backgroundColor: '#ffffff', borderRadius: '0px' }}>
          <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
            {termsText}
          </Typography>
        </Box>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleChange} />}
          label="I agree to these terms"
          sx={{ mt: 1 }}
        />
      </Paper>
    </ThemeProvider>
  );
};

export default TermsOfService;
