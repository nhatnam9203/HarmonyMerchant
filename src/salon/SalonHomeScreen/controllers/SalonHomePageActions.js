export const ACTION_TYPES = {
  SELECT_TAB: "SELECT_TAB",
  BLOCK_CHANGE_TAB: "BLOCK_CHANGE_TAB",
  SHOW_POPUP_CONFIRM_CANCEL_CHECK_OUT: "SHOW_POPUP_CONFIRM_CANCEL_CHECK_OUT",
  RESET_CHECKOUT_TAB: "RESET_CHECKOUT_TAB",
  PRESS_TAB: "PRESS_TAB",
  SHOW_APPOINTMENT_FROM_NOTIFY: "SHOW_APPOINTMENT_FROM_NOTIFY",
  HAD_SHOW_APPOINTMENT_FROM_NOTIFY: "HAD_SHOW_APPOINTMENT_FROM_NOTIFY",
};

export const ChangeTab = (tabName) => {
  return {
    type: ACTION_TYPES.SELECT_TAB,
    payload: tabName,
  };
};

export const blockChangeTab = () => {
  return {
    type: ACTION_TYPES.BLOCK_CHANGE_TAB,
    payload: { isBlockChangeTab: true },
  };
};

export const unBlockChangeTab = () => {
  return {
    type: ACTION_TYPES.BLOCK_CHANGE_TAB,
    payload: { isBlockChangeTab: false },
  };
};

export const showPopupConfirmCancelCheckout = () => {
  return {
    type: ACTION_TYPES.SHOW_POPUP_CONFIRM_CANCEL_CHECK_OUT,
    payload: { visiblePopupConfirmCancelCheckout: true },
  };
};

export const hidePopupConfirmCancelCheckout = () => {
  return {
    type: ACTION_TYPES.SHOW_POPUP_CONFIRM_CANCEL_CHECK_OUT,
    payload: { visiblePopupConfirmCancelCheckout: false },
  };
};

export const resetCheckOut = (tabName) => {
  return {
    type: ACTION_TYPES.RESET_CHECKOUT_TAB,
    payload: tabName,
  };
};

export const pressTab = (tabName) => {
  return {
    type: ACTION_TYPES.PRESS_TAB,
    payload: {
      nextTab: tabName,
    },
  };
};

export const pushNotifyDataToAppointment = (notify) => {
  return {
    type: ACTION_TYPES.SHOW_APPOINTMENT_FROM_NOTIFY,
    payload: notify,
  };
};

export const hadShowNotifyDataToAppointment = () => {
  return {
    type: ACTION_TYPES.HAD_SHOW_APPOINTMENT_FROM_NOTIFY,
  };
};
