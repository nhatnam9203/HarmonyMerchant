import actions from "@actions";

const initialState = {
  overallPaymentMethodList: [],
  overallFilterMethod: null,
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_REPORT_OVERALL_PAYMENT_METHOD_SUCCESS":
      return {
        ...state,
        overallPaymentMethodList: action.payload,
      };
    case actions.report.ACTION_TYPES.OverallPaymentMethodFilterId:
      return {
        ...state,
        overallFilterMethod: action.payload,
      };
    default:
      return state;
  }
}

module.exports = appReducer;
