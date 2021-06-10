// import fs from 'fs';
const fs = require('fs');

// import path from 'path';
const path = require('path');

const appPath = process.argv[2];
const name = process.argv[3];
const func = process.argv[4] ?? 'test';
const sagaDir = path.resolve(__dirname, `../src/redux/saga/${appPath}`);

const sagaScript = `
import { request } from '@shared/services/api';
import { all, call, takeLatest } from 'redux-saga/effects';
import { actions } from '@redux/saga/${appPath}/${name}';
/**
|--------------------------------------------------
| ${name.toUpperCase()} SAGA
|--------------------------------------------------
*/
function* ${func}({ payload }) {
  try {
    let body = payload?.body || {};

    // body = Object.assign({}, body, {});
    // payload.body = body;

    const response = yield call(request, payload);
  } catch (e) {
    console.log(e);
  }
}

export default function* saga() {
  yield all([takeLatest(actions.${func}().type, ${func})]);
}
`;

if (!fs.existsSync(sagaDir)) {
  fs.mkdirSync(sagaDir);
}
fs.writeFileSync(sagaDir + `/${name}.js`, sagaScript);

const sliceDir = path.resolve(__dirname, `../src/redux/slices/${appPath}`);
const sliceScript = `
import { createSlice } from '@reduxjs/toolkit';
import { route } from '@shared/services/api';
/**
|--------------------------------------------------
| ${name.toUpperCase()} SLICES
|--------------------------------------------------
*/
const reducerName = '${appPath}.${name}';
const initialState = {};
const ${name}Slice = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    ${func}: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (params) => {
        return {
          payload: params,
        };
      },
    },
  },
});

const { actions, reducer } = ${name}Slice;

module.exports = {
  reducer,
  actions: { ...actions },
};

`;
if (!fs.existsSync(sliceDir)) {
  fs.mkdirSync(sliceDir);
}
fs.writeFileSync(sliceDir + `/${name}.js`, sliceScript);
