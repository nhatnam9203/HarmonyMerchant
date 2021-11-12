import Configs from '@configs';
import axios from 'axios';
import { Platform } from 'react-native';
import { ErrorHandler } from './ErrorHandler';
import * as route from './route';

const request = async (action, header = {}) => {
  let errors = [];
  let headers = Object.assign({}, header, {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  let { versionApp, deviceName, deviceId, payload, token } = action;
  let { api, body, method } = payload;

  if (!api) {
    errors.push('url'); // lỗi không tìm thấy api path
  }

  if (!body && !['get', 'delete'].includes(`${method}`.toLowerCase())) {
    errors.push('body');
  }

  if (errors.length) {
    throw new Error(`Error! You must pass \`${errors.join('`, `')}\``);
  }

  // HEADERS
  headers = Object.assign({}, headers, {
    ...(token && { Authorization: `Bearer ${token}` }), // Auth Token
    'User-Agent': `HarmonyMerchant/${
      versionApp
        ? `${versionApp}.${Configs.CODEPUSH_VERSION}`
        : `${Configs.APP_VERSION}.${Configs.CODEPUSH_VERSION}`
    }/${Platform.OS}`,
    DeviceID: `${encodeURIComponent(deviceName)}_${deviceId}`,
  });

  // API Configs
  let options = {
    method: `${method}`.toLowerCase(),
    baseURL: Configs.API_URL,
    url: api,
    headers: headers,
    timeout: action?.timeoutIncrease ? 90000 : 30000,
    validateStatus: (status) => status >= 200 && status < 600,
  };

  if (method !== 'GET') {
    options.data = JSON.stringify(body);
  }

  let response;
  try {
    let result = await axios(options);
    response = ErrorHandler(result, null);

    // const codeNumber = response.status ? response.status : 0;
    // if (codeNumber === 401) {
    //   return { codeNumber: codeNumber };
    // }
  } catch (error) {
    response = ErrorHandler(null, error);
  }

  return response;
};

module.exports = { request, route };
