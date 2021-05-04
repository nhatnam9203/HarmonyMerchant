import { Platform } from 'react-native';
import env from 'react-native-config';

const apiConfigs = {
  BASE_API:
    Platform.OS === 'ios'
      ? env.BASE_API
      : 'https://dev.harmonypayment.com/api/',
  BASE_URL:
    Platform.OS === 'ios' ? env.BASE_URL : 'https://dev.harmonypayment.com/',
  CALENDAR_URL:
    Platform.OS === 'ios'
      ? env.CALENDAR_URL
      : 'https://dev.harmonypayment.com/calendar/',
  // PRODUCTION_KEY_CODE_PUSH :env.PRODUCTION_KEY_CODE_PUSH,
  // STAGING_KEY_CODE_PUSH : env.STAGING_KEY_CODE_PUSH

  // BASE_API: "https://dev.harmonypayment.com/api/",
  // BASE_URL: "https://dev.harmonypayment.com/",
  // CALENDAR_URL:"https://dev.harmonypayment.com/calendar/index.html",
  // PRODUCTION_KEY_CODE_PUSH :env.PRODUCTION_KEY_CODE_PUSH,
  // STAGING_KEY_CODE_PUSH : env.STAGING_KEY_CODE_PUSH
};

export default apiConfigs;
