import merchantAuthSlice from './merchant/auth';
import merchantAppSlice from './merchant/app';
import retailerInventorySlice from './retailer/inventory';
import retailerBasketSlice from './retailer/basket';

const rootReducers = Object.assign(
  {},
  {
    authMerchant: merchantAuthSlice.reducer,
    appMerchant: merchantAppSlice.reducer,
    inventoryRetailer: retailerInventorySlice.reducer,
    basketRetailer: retailerBasketSlice.reducer,
  },
);

module.exports = {
  rootReducers,
  authMerchant: merchantAuthSlice.actions,
  appMerchant: merchantAppSlice.actions,
  inventoryRetailer: retailerInventorySlice.actions,
  basketRetailer: retailerBasketSlice.actions,
};
