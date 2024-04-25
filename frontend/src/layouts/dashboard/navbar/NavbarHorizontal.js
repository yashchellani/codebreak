import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
// config
import { HEADER } from '../../../config';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
//
import navConfig from './NavConfig';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '100%',
  position: 'flex',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {


  const config = navConfig;

  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={config} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
