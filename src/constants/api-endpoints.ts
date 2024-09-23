const AUTH = '/auth';
const USER = '/users';
const UPLOAD = '/upload';
const REQUEST = '/requests';
const COMPANY = '/companies';
const REFERRAL = '/referrals';
const DASHBOARD = '/dashboard';
const CANDIDATE = '/candidates';
const AUTOCOMPLETE = '/autocomplete';
const NOTIFICATION = '/notifications';
const EXTERNAL_REQUEST = '/external-requests';

const API_ENDPOINTS = {
  dashboard: {
    root: DASHBOARD,
    companyStatus: `${DASHBOARD}/company-status`,
  },
  auth: {
    me: `${AUTH}/me`,
    login: `${AUTH}/login`,
    logout: `${AUTH}/logout`,
    checkCode: `${AUTH}/check-code`,
    resetPassword: `${AUTH}/reset-password`,
    forgotPassword: `${AUTH}/forgot-password`,
  },
  notification: {
    root: NOTIFICATION,
    markAsReadWithId: `${NOTIFICATION}/mark-as-read/:id`,
  },
  user: {
    root: USER,
    withId: `${USER}/:id`,
  },
  company: {
    root: COMPANY,
    withId: `${COMPANY}/:id`,
    sendReqForm: `${COMPANY}/send-request-form`,
    contractWithId: `${COMPANY}/contract/:id`,
  },
  candidate: {
    root: CANDIDATE,
    search: `${CANDIDATE}/search`,
    withId: `${CANDIDATE}/:id`,
    cvWithId: `${CANDIDATE}/cv/:id`,
  },
  autocomplete: {
    search: {
      company: `${AUTOCOMPLETE}/search/companies`,
      user: `${AUTOCOMPLETE}/search/users`,
      location: `${AUTOCOMPLETE}/search/locations`,
      sector: `${AUTOCOMPLETE}/search/sectors`,
      position: `${AUTOCOMPLETE}/search/positions`,
    },
    position: `${AUTOCOMPLETE}/positions`,
    sector: `${AUTOCOMPLETE}/sectors`,
    location: `${AUTOCOMPLETE}/locations`,
  },
  request: {
    root: REQUEST,
    withId: `${REQUEST}/:id`,
    allowWithId: `${REQUEST}/allow/:id`,
    changeStatusWithId: `${REQUEST}/change-status/:id`,
  },
  referral: {
    root: REFERRAL,
    withId: `${REFERRAL}/:id`,
  },
  externalRequest: {
    root: EXTERNAL_REQUEST,
    withCode: `${EXTERNAL_REQUEST}/:code`,
  },
  upload: {
    getFile: `${UPLOAD}/:bucket/:fileId`,
  },
};

export default API_ENDPOINTS;
