import Axios from "axios";
import { configure } from "axios-hooks";
import Configs from "@configs";
import { Platform } from "react-native";
import { ErrorHandler } from "./ErrorHandler";
import { getAuthToken } from "@shared/storages/authToken";
import NavigationServices from "@navigators/NavigatorServices";

const log = (obj, message = "") => {
  Logger.log(`[axiosClient] ${message}`, obj);
};

export const axios = Axios.create({
  baseURL: Configs.API_URL,
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
    const token = await getAuthToken();
    if (token) {
      config.headers = Object.assign({}, config.headers, {
        authorization: `Bearer ${token}`,
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    log(response, "response");
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
      case 400: // thieu field
        if (codeStatus !== 2) {
          // exception cho phone not exist -> checkout
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
    log(error, "error");
    const config = error?.config;

    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;
      // localStorage.setItem('token', await refreshAccessToken());

      return axios(config);
    }

    return Promise.reject(error);
  }
);

configure({ axios });
