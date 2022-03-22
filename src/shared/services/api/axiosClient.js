import Axios from "axios";
import { configure } from "axios-hooks";
import Configs from "@configs";
import { Platform } from "react-native";
import { ErrorHandler } from "./ErrorHandler";
import { getAuthToken } from "@shared/storages/authToken";
import NavigationServices from "@navigators/NavigatorServices";
import * as ROUTE from "./route";
import { getAuthTokenReport } from "@shared/storages/authToken";

const log = (obj, message = "") => {
  Logger.log(`[axiosClient] ${message}`, obj);
};

const UseTokenReportPaths = [
  `${ROUTE.RETAILER_CUSTOMER.url}/export`,
  `${ROUTE.RETAILER_ORDER.url}/export`,
  `${ROUTE.RETAILER_PRODUCTS.url}/export`,
  `${ROUTE.RETAILER_REPORT_PRODUCT.url}/saleByCategory/export`,
  `${ROUTE.RETAILER_APPOINTMENT_REPORT.url}/customerSales/export`,
  `${ROUTE.RETAILER_REPORT_SALES.url}/order/export`,
  "merchantstafflogtime/export",
  `${ROUTE.RETAILER_APPOINTMENT_REPORT.url}/customerSales`,
  `${ROUTE.RETAILER_OVERALL.url}/marketingEfficiency`,
  `${ROUTE.RETAILER_OVERALL.url}/paymentMethod`,
  `${ROUTE.RETAILER_REPORT_PRODUCT.url}/saleByCategory`,
  `${ROUTE.RETAILER_REPORT_SALES.url}/order`,
  `${ROUTE.RETAILER_REPORT_SALES.url}/overall`,
  `${ROUTE.RETAILER_REPORT_PRODUCT.url}/saleByProduct`,
  `${ROUTE.RETAILER_STAFF.url}/salary`,
  `MerchantStaffLogtime`,
];

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
    // console.log(token);
    if (token) {
      config.headers = Object.assign({}, config.headers, {
        authorization: `Bearer ${token}`,
      });
    }

    // console.log("retailer axios", config)
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
        break;

      case 400: // thieu field
        if (codeStatus !== 2 && codeStatus !== 5 && codeStatus !== 4) {
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
