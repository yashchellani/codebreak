// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import {
  AppWidgetSummary,
  AppCurrentDownload,
} from '../../sections/@dashboard/general/app';

import CycleList from './CycleTable';
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const theme = useTheme();
  const { themeStretch } = useSettings();



  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ mt: -10 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total User Submissions in Past 7 Days"
              percent={2.6}
              total={765}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Plagiarism Detected in Past 7 Days"
              percent={0.2}
              total={54}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Confirmed Plagiarism Cases in Past 7 Days"
              percent={+9.6}
              total={49}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <CycleList />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
