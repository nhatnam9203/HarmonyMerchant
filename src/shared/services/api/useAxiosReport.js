import Configs from "@configs";
import { getAuthTokenReport } from "@shared/storages/authToken";
import Axios from "axios";
import { makeUseAxios } from "axios-hooks";
import { Platform } from "react-native";

export const axios = Axios.create({
  baseURL: Configs.API_REPORT_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": `HarmonyMerchant/${`${Configs.APP_VERSION}.${Configs.CODEPUSH_VERSION}`}/${
      Platform.OS
    }`,
    // DeviceID: `${encodeURIComponent(deviceName)}_${deviceId}`,
  },
});

// request interceptor to add token to request headers
axios.interceptors.request.use(
  async (config) => {
    const reportToken = await getAuthTokenReport();
    if (reportToken) {
      config.headers = Object.assign({}, config.headers, {
        authorization: `Bearer ${reportToken}`,
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const useAxiosReport = makeUseAxios({
  axios: axios,
});
