import React from "react";
import {
  Platform,
  Dimensions,
  Linking,
  Alert,
  Text,
  StyleSheet,
  NativeModules,
} from "react-native";
import axios from "axios";
import { openSettings } from "react-native-permissions";
import moment from "moment";
import PrintManager from "@lib/PrintManager";

import Configs from "@configs";
import Localization from "../localization";
import ICON from "../resources";
import {
    AUTHEN_KEY,
    REGISTER_ID,
  } from '@utils';
import _ from "lodash";
import PushNotification from "react-native-push-notification";
import { parseString } from "react-native-xml2js";
import env from "react-native-config";
import { parseString } from "react-native-xml2js";
import configureStore from "../redux/store";
const { store } = configureStore();

export const requestTransactionDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const transType = _.get(params, 'transType')
    const param = `<request>`+
                `<PaymentType>${_.get(params, 'tenderType')}</PaymentType>`+
                `<TransType>${transType}</TransType>`+
                `<Amount>${_.get(params, 'amount')}</Amount>`+
                `<InvNum>${_.get(params, 'invNum')}</InvNum>`+
                `<RefId>${_.get(params, 'RefId', '1')}</RefId>`+
                `<AuthKey>${AUTHEN_KEY}</AuthKey>`+
                `<RegisterId>${REGISTER_ID}</RegisterId>`+
                transType == "Sale" && `<PrintReceipt>No</PrintReceipt>`+
                `</request>`
    
   const api = `http://${_.get(dejavooMachineInfo, 'ip')}:${_.get(dejavooMachineInfo, 'port')}/cgi.html`

   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
  };
    try {
      let xmlResponse = await axios(configs);
      parseString(xmlResponse, (err, result) => {
        if (err) {
            return {errorMessage: "Error"}
        } else {
          return result
        }
      });
    } catch (error) {
      return {errorMessage: "Error"}
    }
  };
  
  export const requestPrintDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const transType = _.get(params, 'transType')
    const param = `<request>`+
                `<AuthKey>${AUTHEN_KEY}</AuthKey>`+
                `<RegisterId>${REGISTER_ID}</RegisterId>`+
                `<printer width="24">`+
                `<img>${_.get(params, 'image')}</img>`+
                `</printer>`+
                `</request>`
    
    const api = `http://${_.get(dejavooMachineInfo, 'ip')}:${_.get(dejavooMachineInfo, 'port')}/cgi.html`

   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
  };
    try {
      let xmlResponse = await axios(configs);
      parseString(xmlResponse, (err, result) => {
        if (err) {
            return {errorMessage: "Error"}
        } else {
          return result
        }
      });
    } catch (error) {
      return {errorMessage: "Error"}
    }
  };

  export const requestSettlementDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const transType = _.get(params, 'transType')
    const param = `<request>`+
                `<AuthKey>${AUTHEN_KEY}</AuthKey>`+
                `<RegisterId>${REGISTER_ID}</RegisterId>`+
                `<RefId>${_.get(params, 'RefId', '1')}</RefId>`+
                `<TransType>Settle</TransType>`+
                `<Param>Close</Param>`+
                `</request>`
    
    
    const api = `http://${_.get(dejavooMachineInfo, 'ip')}:${_.get(dejavooMachineInfo, 'port')}/cgi.html`

   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
  };
    try {
      let xmlResponse = await axios(configs);
      parseString(xmlResponse, (err, result) => {
        if (err) {
            return {errorMessage: "Error"}
        } else {
          return result
        }
      });
    } catch (error) {
      return {errorMessage: "Error"}
    }
  };