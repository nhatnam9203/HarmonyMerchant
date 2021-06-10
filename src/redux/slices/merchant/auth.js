import { createSlice } from '@reduxjs/toolkit';

const reducerName = 'merchant.auth';
const initialState = { merchant: null, staff: null };
const authSlice = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    signInSuccess: {
      reducer: (state, action) => {
        return action.payload;
      },
      // prepare: (params) => {
      //   console.log(params);
      // },
    },
    staffSignIn: {
      reducer: (state, action) => {
        state.staff = action.payload;
      },
      // prepare: (params) => {
      //   console.log(params);
      // },
    },
    signOutApp: {
      reducer: (state, action) => {
        return initialState;
      },
    },
  },
});

const { actions, reducer } = authSlice;

module.exports = {
  reducer,
  actions: { ...actions },
};
