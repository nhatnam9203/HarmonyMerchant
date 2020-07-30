const initialState = {
  overallPaymentMethodList: [],
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_REPORT_OVERALL_PAYMENT_METHOD_SUCCESS":
      return {
        ...state,
        overallPaymentMethodList: action.payload,
      };
    default:
      return state;
  }
}

module.exports = appReducer;
