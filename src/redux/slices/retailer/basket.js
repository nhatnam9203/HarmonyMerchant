import { createSlice } from "@reduxjs/toolkit";

const reducerName = "retailer.basket";
const initialState = {
  appointmentId: null,
  customer: null,
  purchasePoint: "Store",
  products: [],
  appointment: null,
};
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    setAppointmentTemp: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointment = action.payload;
      },
    },
    setAppointmentId: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointmentId = action.payload;
      },
    },
    // addBasketItem: {
    //   reducer: (state, action) => {
    //     state.products = [...(state.products || []), action.payload];
    //     state.hasSubmit = false;
    //   },
    //   // prepare: (params) => {
    //   //   console.log(params);
    //   //   return params;
    //   // },
    // },
    // removeBasketItem: {
    //   reducer: (state, action) => {
    //     state.products = state.products?.filter((x) => x.id !== action.payload);
    //   },
    //   // prepare: (params) => {
    //   //   console.log(params);
    //   //   return params;
    //   // },
    // },
    clearBasket: (state, action) => {
      return initialState;
    },
    setCustomer: (state, action) => {
      // !@@@@@@@@
      state.customer = action.payload;
    },
    deleteCustomer: (state, action) => {
      // !@@@@@@@@
      return initialState;
    },
  },
});

const { actions, reducer } = slices;

module.exports = {
  reducer,
  actions: { ...actions },
};
