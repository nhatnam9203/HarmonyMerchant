import axios from "axios";
import {
    AUTHEN_KEY,
  } from '@utils';
import _ from "lodash";
import { parseString } from "react-native-xml2js";
import configureStore from "../redux/store";
const { store } = configureStore();
let headers = Object.assign(
  { Accept: "application/json", "Content-Type": "application/json" }
);

const api = 'https://spinpos.net/spin/cgi.html'

export const requestTransactionDejavoo = async (params) => {
    console.log('params', params)
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
                `<TPN>${_.get(dejavooMachineInfo, 'tpn')}</TPN>`+
                `<PrintReceipt>No</PrintReceipt>`+
                `</request>`
    console.log('param', param)
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
    };
    console.log('configs', configs)
    const response = await handleRequest(configs)
    return response
  };

  const handleRequest = async (configs) => {
    try {
      const response = await axios(configs);
      console.log('response', response)
   
      if (parseInt(_.get(response, 'status')) == 200) {
        const xmlResponse = _.get(response, 'data')
        console.log('xmlResponse', xmlResponse)
        return xmlResponse
      } else {
        return '<xmp><response><ResultCode>999</ResultCode><Message>Error</Message></response></xmp>'
      }
    } catch (error) {
      console.log('error', error)
      return '<xmp><response><ResultCode>999</ResultCode><Message>Error</Message></response></xmp>'
    }
  }
  
  export const requestPrintDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const param = `<request>`+
                `<AuthKey>${AUTHEN_KEY}</AuthKey>`+
                `<TPN>${_.get(dejavooMachineInfo, 'tpn')}</TPN>`+
                `<printer width="24">`+
                `<img>${_.get(params, 'image')}</img>`+
                `</printer>`+
                `</request>`
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
    };
    const response = await handleRequest(configs)
    return response
  };

  export const requestSettlementDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const param = `<request>`+
                `<AuthKey>${AUTHEN_KEY}</AuthKey>`+
                `<TPN>${_.get(dejavooMachineInfo, 'tpn')}</TPN>`+
                `<RefId>${_.get(params, 'RefId', '1')}</RefId>`+
                `<TransType>Settle</TransType>`+
                `<Param>Close</Param>`+
                `</request>`
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 90000,
    };
    handleRequest(configs)
  };