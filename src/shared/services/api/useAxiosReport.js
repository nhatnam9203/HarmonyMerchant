import axios from 'axios'
import { makeUseAxios } from 'axios-hooks'
import Configs from "@configs";
import { getAuthTokenReport } from "@shared/storages/authToken";
import { Platform } from "react-native";

export const useAxiosReport = async() => {

  const token = await getAuthTokenReport()

  return makeUseAxios({
    axios: axios.create(
        { 
          baseURL: Configs.API_REPORT_URL,
          timeout: 30000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": `HarmonyMerchant/${`${Configs.APP_VERSION}.${Configs.CODEPUSH_VERSION}`}/${Platform.OS}`,
            authorization: `Bearer ${token}`,
          },
        }
      )
    })
}