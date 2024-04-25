// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ThemeColorPresets>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ChartStyle />
                <ScrollToTop />
                <Router />
              </MotionLazyContainer>
            </NotistackProvider>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
