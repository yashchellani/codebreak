// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  sendEmail: path(ROOTS_AUTH, '/send-email'),
  activate: path(ROOTS_AUTH, '/activate/:uid/:token'),
  confirmReset: path(ROOTS_AUTH, '/confirm-reset/:uid/:token'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  page404: '/404',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    billing : path(ROOTS_DASHBOARD, '/billing'),
    social : path(ROOTS_DASHBOARD, '/social'),
    code : path(ROOTS_DASHBOARD, '/code'),
  },
  

  question: {
    root: path(ROOTS_DASHBOARD, '/question'),
    list: path(ROOTS_DASHBOARD, '/question/:id/list'),
    view: path(ROOTS_DASHBOARD, '/question/:cycleId/:id/view'),
    code: path(ROOTS_DASHBOARD, '/question/:cycleId/:questionId/:id/view'),
    newQuestion: path(ROOTS_DASHBOARD, '/question/new/:id'),
    editById: path(ROOTS_DASHBOARD, `/question/:cycleId/:id/edit`),
  },

};
