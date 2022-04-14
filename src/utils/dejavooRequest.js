import axios from "axios";
import {
    AUTHEN_KEY,
    stringIsEmptyOrWhiteSpaces
  } from '@utils';
import _ from "lodash";
import { parseString } from "react-native-xml2js";
import configureStore from "../redux/store";
const { store } = configureStore();
let headers = Object.assign(
  { Accept: "xml", "Content-Type": "xml" }
);

const api = 'https://spinpos.net/spin/cgi.html'

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
                `<AuthKey>${_.get(dejavooMachineInfo, 'authKey')}</AuthKey>`+
                `<RegisterId>${_.get(dejavooMachineInfo, 'registerId')}</RegisterId>`+
                `<PrintReceipt>No</PrintReceipt>`+
                `</request>`
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 420000,
    };
    const response = await handleRequest(configs)
    return response
  };

  export const requestEditTipDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const param = `<request>`+
                `<TransType>TipAdjust</TransType>`+
                `<Amount>${_.get(params, 'amount')}</Amount>`+
                `<InvNum>${_.get(params, 'invNum')}</InvNum>`+
                `<RefId>${_.get(params, 'refId', '1')}</RefId>`+
                `<Tip>${_.get(params, 'tip')}</Tip>`+
                `<AcntLast4>${_.get(params, 'last4')}</AcntLast4>`+
                `<AuthKey>${_.get(dejavooMachineInfo, 'authKey')}</AuthKey>`+
                `<RegisterId>${_.get(dejavooMachineInfo, 'registerId')}</RegisterId>`+
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

  const handleRequest = async (configs) => {
    try {
      const response = await axios(configs);
   
      if (parseInt(_.get(response, 'status')) == 200) {
        const xmlResponse = _.get(response, 'data')
        return xmlResponse
      } else {
        return '<xmp><response><ResultCode>999</ResultCode><Message>Error</Message></response></xmp>'
      }
    } catch (error) {
      return '<xmp><response><ResultCode>999</ResultCode><Message>Error</Message></response></xmp>'
    }
  }
  
  export const requestPrintDejavoo = async (params) => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const param = `<request>`+
                `<AuthKey>${_.get(dejavooMachineInfo, 'authKey')}</AuthKey>`+
                `<RegisterId>${_.get(dejavooMachineInfo, 'registerId')}</RegisterId>`+
                `<printer width="24">`+
                `${_.get(params, 'content')}`+
                // `<img>${_.get(params, 'image')}</img>`+
                `</printer>`+
                `</request>`
    
   const configs = {
    method: "post",
    baseURL: "https://spinpos.net/spin/",
    url: "Transaction",
    headers: headers,
    timeout: 90000,
    data: param,
    };
    console.log('configs', configs)
    const response = await handleRequest(configs)
    return response
  };

  export const requestSettlementDejavoo = async () => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    const param = `<request>`+
                `<AuthKey>${_.get(dejavooMachineInfo, 'authKey')}</AuthKey>`+
                `<RegisterId>${_.get(dejavooMachineInfo, 'registerId')}</RegisterId>`+
                `<RefId>${Date.now()}</RefId>`+
                `<TransType>Settle</TransType>`+
                `<Param>Close</Param>`+
                `</request>`
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?TerminalTransaction=${param}`,
    headers: headers,
    timeout: 420000,
    };
    const response = await handleRequest(configs)
    return response
  };

  export const requestGetProcessingStatus = async () => {
    const { hardware } = store.getState();
    const { dejavooMachineInfo } = hardware;
    
   const configs = {
    method: "get",
    baseURL: api,
    url: `?GetProcessingStatus?RegisterID=${_.get(dejavooMachineInfo, 'registerId')}`,
    headers: headers,
    timeout: 90000,
    };
    const response = await axios(configs);
   
    if (parseInt(_.get(response, 'status')) == 200) {
      if(_.get(response, 'data') == "Transaction in progress"){
        return true
      } else {
        return false
      }
    }else{
      return true
    }
  };

  export const handleResponseDejavoo = (message) => {
    return new Promise((resolve) => {
      try {
        parseString(message, (err, result) => {
          const errorCode = _.get(result, "xmp.response.0.ResultCode.0");
          if (err || errorCode != 0) {
            // let detailMessage = _.get(result, "xmp.response.0.RespMSG.0", "")
            //   .replace(/%20/g, " ");
            // detailMessage = !stringIsEmptyOrWhiteSpaces(detailMessage)
            //   ? `: ${detailMessage}`
            //   : detailMessage;
    
            // const resultTxt =
            //   `${_.get(result, "xmp.response.0.Message.0")}${detailMessage}` ||
            //   "Transaction failed";
              resolve(false)
          } else {
            resolve(true)
          }
        });
      } catch (error) {
        resolve(false)
      }
    })
  }