import { createSlice } from '@reduxjs/toolkit';

const reducerName = 'retailer.setting';
const initialState = { activeTab: null };
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    setActiveTab: {
      reducer: (state, action) => {
        state.activeTab = action.payload;
      },
      // prepare: (params) => {
      //   console.log(params);
      // },
    },
  },
});

const { actions, reducer } = slices;

module.exports = {
  reducer,
  actions: { ...actions },
};
