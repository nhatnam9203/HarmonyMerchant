import { createSlice } from '@reduxjs/toolkit';

const reducerName = 'retailer.inventory';
const initialState = { categories: null };
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    saveCategories: {
      reducer: (state, action) => {
        state.categories = action.payload;
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
