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

axios.interceptors.response.use(
  (response) => {
    const { codeStatus = 0, codeNumber = 0, message } = response?.data;
    switch (parseInt(codeNumber, 10)) {
      case 401:
        if (parseInt(codeStatus) === 5) {
          alert("Permission Denied");
        } else {
          // NavigationServices.logout();
        }
        break;
      case 404: // not found
        break;

      case 400: // thieu field
        if (codeStatus !== 2 && codeStatus !== 4) {
          setTimeout(() => {
            alert(`${message}`);
          }, 100);
        }

        break;
      default:
        break;
    }

    return response;
  },
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;
      // localStorage.setItem('token', await refreshAccessToken());

      return axios(config);
    }

    return Promise.reject(error);
  }
);

export const useAxiosReport = makeUseAxios({
  axios: axios,
});
