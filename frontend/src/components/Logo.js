import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {Box, Typography } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
};

export default function Logo({ disabledLink = false }) {

  const logo = (
    <Box sx={{ width: 160, height: 80 }}>
        <Typography variant="h6" sx={{ pt: 3, textDecoration: 'none' }} color="text.primary" align="start">
          Codebreak.
        </Typography>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
