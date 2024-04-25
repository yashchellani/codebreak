// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const ICONS = {
  user: getIcon('ic_user'),
  dashboard: getIcon('ic_dashboard'),
  file: getIcon('ic_kanban'),
  home: getIcon('ic_calendar'),
  history: getIcon('ic_booking')
};

const navConfig2 = [
  // GENERAL
  // ----------------------------------------------------------------------

  {
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },

    ],
  },

];

export default navConfig2;