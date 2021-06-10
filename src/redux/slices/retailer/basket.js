import { createSlice } from '@reduxjs/toolkit';

const reducerName = 'retailer.basket';
const initialState = { customer: null, purchasePoint: 'Store', products: [] };
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    addBasketItem: {
      reducer: (state, action) => {
        state.products = [...(state.products || []), action.payload];
      },
      // prepare: (params) => {
      //   console.log(params);
      //   return params;
      // },
    },
    removeBasketItem: {
      reducer: (state, action) => {
        state.products = state.products?.filter((x) => x.id !== action.payload);
      },
      // prepare: (params) => {
      //   console.log(params);
      //   return params;
      // },
    },
    clearBasket: (state, action) => {
      state.products = [];
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    deleteCustomer: (state, action) => {
      state.customer = null;
    },
  },
});

const { actions, reducer } = slices;

module.exports = {
  reducer,
  actions: { ...actions },
};
