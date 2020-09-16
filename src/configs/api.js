import env from 'react-native-config';

const apiConfigs = {
    // BASE_API: env.BASE_API,
    // BASE_URL: env.BASE_URL,
    // CALENDAR_URL: env.CALENDAR_URL,
    // PRODUCTION_KEY_CODE_PUSH :env.PRODUCTION_KEY_CODE_PUSH,
    // STAGING_KEY_CODE_PUSH : env.STAGING_KEY_CODE_PUSH

    BASE_API: "https://dev.harmonypayment.com/api/",
    BASE_URL: "https://dev.harmonypayment.com/",
    CALENDAR_URL:"https://dev.harmonypayment.com/calendar/index.html",
    PRODUCTION_KEY_CODE_PUSH :env.PRODUCTION_KEY_CODE_PUSH,
    STAGING_KEY_CODE_PUSH : env.STAGING_KEY_CODE_PUSH
}

export default apiConfigs;



