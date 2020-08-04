import actions from "@actions";

const initialState = {
  overallPaymentMethodList: [],
  overallPMFilterId: undefined,
  overallPMFilters: [],
};

function appReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_REPORT_OVERALL_PAYMENT_METHOD_SUCCESS":
      return {
        ...state,
        overallPaymentMethodList: action.payload,
      };
    case actions.report.ACTION_TYPES.OPMFilterId:
      return {
        ...state,
        overallPMFilterId: action.payload,
      };
    case actions.report.ACTION_TYPES.OPMFilters:
      return {
        ...state,
        overallPMFilters: action.payload,
      };
    default:
      return state;
  }
}

module.exports = appReducer;
