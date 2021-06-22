import { createSlice } from "@reduxjs/toolkit";

const reducerName = "retailer.basket";
const initialState = {
  appointmentId: null,
  customer: null,
  purchasePoint: "Store",
  products: [],
  hasSubmit: true,
  appointment: null,
};
const slices = createSlice({
  name: reducerName,
  initialState: initialState,
  reducers: {
    setAppointmentTemp: {
      reducer: (state, action) => {
        state.appointment = action.payload;
        state.hasSubmit = false;
      },
    },
    setAppointmentId: {
      reducer: (state, action) => {
        state.appointmentId = action.payload;
        state.hasSubmit = false;
      },
    },
    addBasketItem: {
      reducer: (state, action) => {
        state.products = [...(state.products || []), action.payload];
        state.hasSubmit = false;
      },
      // prepare: (params) => {
      //   console.log(params);
      //   return params;
      // },
    },
    removeBasketItem: {
      reducer: (state, action) => {
        state.products = state.products?.filter((x) => x.id !== action.payload);
        state.hasSubmit = false;
      },
      // prepare: (params) => {
      //   console.log(params);
      //   return params;
      // },
    },
    clearBasket: (state, action) => {
      return initialState;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
      state.hasSubmit = false;
    },
    deleteCustomer: (state, action) => {
      if (state.appointmentId) return initialState;

      // state.customer = null;
      // state.hasSubmit = false;
    },
  },
});

const { actions, reducer } = slices;

module.exports = {
  reducer,
  actions: { ...actions },
};
