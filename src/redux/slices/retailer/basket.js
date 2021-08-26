import { createSlice } from "@reduxjs/toolkit";

const reducerName = "retailer.basket";
const initialState = {
  customer: null,
  appointmentTempId: null,
  appointmentId: null,
  appointment: null,
  appointmentTemp: null,
};
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    // setAppointmentTemp: {
    //   // !@@@@@@@@
    //   reducer: (state, action) => {
    //     state.appointment = action.payload;
    //   },
    // },
    setAppointment: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointmentTemp = null;
        state.appointment = action.payload;
      },
    },
    setAppointmentTemp: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointmentTemp = action.payload;
      },
    },
    setAppointmentTempId: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointmentTempId = action.payload;
      },
    },
    setAppointmentId: {
      // !@@@@@@@@
      reducer: (state, action) => {
        state.appointmentTempId = null;
        // state.appointment = null;
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
