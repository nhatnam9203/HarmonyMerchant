import { ACTION_TYPES } from "./SalonHomePageActions";
import { ScreenName } from "@src/ScreenName";

export const InitState = {
  previousTab: "",
  currentTab: ScreenName.SALON.APPOINTMENT_LAYOUT,
  nextTab: ScreenName.SALON.APPOINTMENT_LAYOUT,
  isBlockChangeTab: false,
  visiblePopupConfirmCancelCheckout: false,
};

export const SalonHomePageReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SELECT_TAB:
      const temp = state.currentTab;
      return Object.assign({}, state, {
        previousTab: temp,
        currentTab: action.payload,
      });
    case ACTION_TYPES.RESET_CHECKOUT_TAB:
      const prev = state.currentTab;

      console.log(state);
      return Object.assign({}, state, {
        previousTab: prev,
        visiblePopupConfirmCancelCheckout: false,
        isBlockChangeTab: false,
        currentTab: action?.payload || "",
        nextTab: "",
      });
    case ACTION_TYPES.BLOCK_CHANGE_TAB:
    case ACTION_TYPES.SHOW_POPUP_CONFIRM_CANCEL_CHECK_OUT:
    case ACTION_TYPES.PRESS_TAB:
    default:
      return Object.assign({}, state, action.payload);
  }
};
