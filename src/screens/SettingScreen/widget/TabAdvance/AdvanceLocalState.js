import actions from "@actions";

export const TYPES = {
  SET: "advance-setting-set",
  UPDATE_LOYALTY_PROGRAM: "advance-setting-update-loyalty-program",
  UPDATE_CASH_STAR_RATE: "advance-setting-update-cash-star-rate",
  UPDATE_HARMONY_PAY_STAR_RATE: "advance-setting-update-harmony-pay-star-rate",
  UPDATE_CREDIT_CARD_STAR_RATE: "advance-setting-update-credit-card-star-rate",
  UPDATE_OTHER_STAR_RATE: "advance-setting-update-other-star-rate",
  UPDATE_IS_CASH_DISCOUNT: "advance-setting-is-cash-discount",
  UPDATE_IS_DEPOSIT_APPOINTMENT: "advance-setting-is-deposit-appointment",
  UPDATE_DEPOSIT_MINIUM_AMOUNT: "advance-setting-deposit-minium-amount",
  UPDATE_DEPOSIT_PERCENT_AMOUNT: "advance-setting-deposit-percent-amount",
};

const initState = {};

export const advanceReducer = (state = initState, action) => {
  switch (action.type) {
    case TYPES.SET:
      return action.payload;
    case TYPES.UPDATE_LOYALTY_PROGRAM:
      return Object.assign({}, state, { IsLoyaltyProgram: action.payload });
    case TYPES.UPDATE_CASH_STAR_RATE:
      return Object.assign({}, state, { CashStarRate: action.payload });
    case TYPES.UPDATE_HARMONY_PAY_STAR_RATE:
      return Object.assign({}, state, { HarmonyPayStarRate: action.payload });
    case TYPES.UPDATE_CREDIT_CARD_STAR_RATE:
      return Object.assign({}, state, { CreditCardStarRate: action.payload });
    case TYPES.UPDATE_OTHER_STAR_RATE:
      return Object.assign({}, state, { OtherStarRate: action.payload });
    case TYPES.UPDATE_IS_CASH_DISCOUNT:
      return Object.assign({}, state, { IsCashDiscount: action.payload });
    case TYPES.UPDATE_IS_DEPOSIT_APPOINTMENT:
      return Object.assign({}, state, { IsAppointmentDeposit: action.payload });
    case TYPES.UPDATE_DEPOSIT_MINIUM_AMOUNT:
      return Object.assign({}, state, {
        MinimumAppointmentAmountRequireDeposit: action.payload,
      });
    case TYPES.UPDATE_DEPOSIT_PERCENT_AMOUNT:
      return Object.assign({}, state, { DepositPercent: action.payload });
    default:
      return state;
  }
};

export const setAdvanceSetting = (data) => {
  return {
    type: TYPES.SET,
    payload: data,
  };
};

export const updateLoyaltyProgram = (bl) => {
  return {
    type: TYPES.UPDATE_LOYALTY_PROGRAM,
    payload: bl,
  };
};

export const updateCashStarRate = (value) => {
  return {
    type: TYPES.UPDATE_CASH_STAR_RATE,
    payload: value,
  };
};

export const updateHarmonyPayStarRate = (value) => {
  return {
    type: TYPES.UPDATE_HARMONY_PAY_STAR_RATE,
    payload: value,
  };
};

export const updateCreditCardStarRate = (value) => {
  return {
    type: TYPES.UPDATE_CREDIT_CARD_STAR_RATE,
    payload: value,
  };
};

export const updateOtherStarRate = (value) => {
  return {
    type: TYPES.UPDATE_OTHER_STAR_RATE,
    payload: value,
  };
};

export const updateIsCashDiscount = (value) => {
  return {
    type: TYPES.UPDATE_IS_CASH_DISCOUNT,
    payload: value,
  };
};

export const updateIsDepositAppointment = (value) => {
  return {
    type: TYPES.UPDATE_IS_DEPOSIT_APPOINTMENT,
    payload: value,
  };
};

export const updateDepositMiniumAmount = (value) => {
  return {
    type: TYPES.UPDATE_DEPOSIT_MINIUM_AMOUNT,
    payload: value,
  };
};

export const updateDepositPercentAmount = (value) => {
  return {
    type: TYPES.UPDATE_DEPOSIT_PERCENT_AMOUNT,
    payload: value,
  };
};
