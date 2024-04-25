import PropTypes from 'prop-types';
// @mui
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
// hooks

// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
  children: PropTypes.node,
};

export default function ThemeLocalization({ children }) {
  const defaultTheme = useTheme();

  const theme = createTheme(defaultTheme);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
