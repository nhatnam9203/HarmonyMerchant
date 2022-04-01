import actions from "@actions";

export const TYPES = {
  SET: "advance-setting-set",
  UPDATE_LOYALTY_PROGRAM: "advance-setting-update-loyalty-program",
  UPDATE_CASH_STAR_RATE: "advance-setting-update-cash-star-rate",
  UPDATE_HARMONY_PAY_STAR_RATE: "advance-setting-update-harmony-pay-star-rate",
  UPDATE_CREDIT_CARD_STAR_RATE: "advance-setting-update-credit-card-star-rate",
  UPDATE_OTHER_STAR_RATE: "advance-setting-update-other-star-rate",
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
