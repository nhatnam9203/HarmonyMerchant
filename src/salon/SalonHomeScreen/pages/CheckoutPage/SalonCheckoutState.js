export const initState = {
  isShowColProduct: false,
  isShowColAmount: false,
  categorySelected: {
    categoryId: -1,
    categoryType: "",
  },
  productSeleted: {
    name: "",
  },
  categoryTypeSelected: "",
  extraSelected: {
    extraId: -1,
    name: "",
  },
  basket: [],
  visibleDiscount: false,
  paymentSelected: "",
  tabCurrent: 0,
  subTotalLocal: 0,
  tipLocal: 0,
  discountTotalLocal: 0,
  taxLocal: 0,
  totalLocal: 0,
  total: 0,
  isInitBasket: false,
  appointmentId: -1,
  infoUser: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
  visiblePaymentCompleted: false,
  changeButtonDone: false,
  methodPayment: "",
  visibleProcessingCredit: false,
  visibleConfirm: false,
  visibleChangeStylist: false,
  visibleChangeMoney: false,

  customDiscountPercentLocal: 0,
  customDiscountFixedLocal: 0,
  visibleSendLinkPopup: false,
  visiblePopupDiscountLocal: false,
  visibleCustomerName: false,
  visibleCustomerPhone: false,
  appointmentIdChangeStylist: -1,
  // visiblePopupPaymentDetails: false, // useState
  isCancelHarmonyPay: false,
  customerInfoByPhone: {
    userId: 0,
  },
  visibleScanCode: false,
  appointmentOfflineMode: {},
  staffIdOfline: 0,
  fromTime: "",
  visiblePrintInvoice: false,
  visibleChangePriceAmountProduct: false,
  visibleChangeTip: false,
  isDrawer: false,
  visiblePopupAddItemIntoBasket: false,
  visiblePopupGiftCardDetails: false,

  arrSelectedExtra: [],

  // -------- New State ------
  isShowCategoriesColumn: false,
  selectedStaff: {},
  visibleAddEditCustomerPopup: false,
  isBlockBookingFromCalendar: false,

  visibleErrorMessageFromPax: false,
  errorMessageFromPax: "",

  isGotoCheckout: false,
  isLoadingCategory: false,
  categoryStaff: [],
  isLoadingService: false,
  serviceStaff: [],
  productStaff: [],
  staffOfService: [],

  visibleInvoice: false,
  isBookingFromAppointmentTab: false,
  customServiceSelected: null,
};

export const ACTION_TYPES = {
  SET_CATEGORIES: "SET_CATEGORIES",
  SELECT_STAFF_FROM_APPOINTMENT_TAB: "SELECT_STAFF_FROM_APPOINTMENT_TAB",
  SELECT_STAFF: "SELECT_STAFF",
  SELECT_CATEGORY: "SELECT_CATEGORY",
  SET_SERVICE_BY_STAFF: "SET_SERVICE_BY_STAFF",
  SET_PRODUCT_BY_STAFF: "SET_PRODUCT_BY_STAFF",
  SELECT_CATEGORY_ITEM: "SELECT_CATEGORY_ITEM",
  SELECT_EXTRA: "SELECT_EXTRA",
  SET_BASKET: "SET_BASKET",
  VISIBLE_EDIT_PRODUCT_FORM: "VISIBLE_EDIT_PRODUCT_FORM",
  VISIBLE_POPUP_DISCOUNt_LOCAL: "VISIBLE_POPUP_DISCOUNt_LOCAL",
  VISIBLE_POPUP_CHANGE_TIP: "VISIBLE_POPUP_CHANGE_TIP",
  UPDATE_BASKET: "UPDATE_BASKET",
  RESET_PAYMENT: "RESET_PAYMENT",
  RESET_STATE: "RESET_STATE",
  SELECT_GIFT_CARD: "SELECT_GIFT_CARD",
  CLOSE_BILL_PAYMENT: "CLOSE_BILL_PAYMENT",
  SET_CUSTOM_SERVICE: "SET_CUSTOM_SERVICE",
  SET_PAYMENT: "SET_PAYMENT",
  SIGNAL_PAYMENT: "SIGNAL_PAYMENT",
  CHANGE_BUTTON_DONE: "CHANGE_BUTTON_DONE",
  UPDATE_CREDIT_CARD: "UPDATE_CREDIT_CARD",
  BLOCK_SELECT_STAFF: "BLOCK_SELECT_STAFF",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CATEGORIES:
    case ACTION_TYPES.SELECT_STAFF_FROM_APPOINTMENT_TAB:
    case ACTION_TYPES.SELECT_CATEGORY:
    case ACTION_TYPES.SET_SERVICE_BY_STAFF:
    case ACTION_TYPES.SET_PRODUCT_BY_STAFF:
    case ACTION_TYPES.SELECT_CATEGORY_ITEM:
    case ACTION_TYPES.SELECT_EXTRA:
    case ACTION_TYPES.SET_BASKET:
    case ACTION_TYPES.VISIBLE_EDIT_PRODUCT_FORM:
    case ACTION_TYPES.VISIBLE_POPUP_DISCOUNt_LOCAL:
    case ACTION_TYPES.VISIBLE_POPUP_CHANGE_TIP:
    case ACTION_TYPES.UPDATE_BASKET:
    case ACTION_TYPES.RESET_PAYMENT:
    case ACTION_TYPES.SELECT_GIFT_CARD:
    case ACTION_TYPES.CLOSE_BILL_PAYMENT:
    case ACTION_TYPES.SET_CUSTOM_SERVICE:
    case ACTION_TYPES.SIGNAL_PAYMENT:
    case ACTION_TYPES.CHANGE_BUTTON_DONE:
    case ACTION_TYPES.UPDATE_CREDIT_CARD:
    case ACTION_TYPES.BLOCK_SELECT_STAFF:
    default:
      return Object.assign({}, state, action.payload);

    case ACTION_TYPES.SELECT_STAFF:
      const { selectedStaff } = state;
      const staff = action.payload;

      const isExist = selectedStaff?.staffId === staff?.staffId ? true : false;

      return Object.assign({}, state, {
        selectedStaff: isExist ? {} : staff,
        isShowCategoriesColumn: !isExist,
        isShowColProduct: false,
        isShowColAmount: false,
        categorySelected: {
          categoryId: -1,
          categoryType: "",
        },
        productSeleted: null,
        categoryTypeSelected: "",
        arrSelectedExtra: [],
        customServiceSelected: null,
      });

    case ACTION_TYPES.RESET_STATE: {
      return initState;
    }

    case ACTION_TYPES.SET_PAYMENT: {
      const { paymentSelected } = state;
      if (paymentSelected === action.payload) {
        return Object.assign({}, state, { paymentSelected: "" });
      } else {
        return Object.assign({}, state, { paymentSelected: action.payload });
      }
    }
  }
};

export const setCategories = (data = []) => {
  return {
    type: ACTION_TYPES.SET_CATEGORIES,
    payload: {
      isLoadingCategory: false,
      categoryStaff: data,
    },
  };
};

export const setSelectStaffFromCalendar = (staffId) => {
  return {
    type: ACTION_TYPES.SELECT_STAFF_FROM_APPOINTMENT_TAB,
    payload: {
      selectedStaff: { staffId },
      isShowCategoriesColumn: true,
      isBookingFromAppointmentTab: true, // book appointment from calendar
    },
  };
};

export const selectStaff = (staff) => {
  return {
    type: ACTION_TYPES.SELECT_STAFF,
    payload: staff,
  };
};

export const selectCategory = (category) => {
  return {
    type: ACTION_TYPES.SELECT_CATEGORY,
    payload: category
      ? {
          categorySelected: category,
          categoryTypeSelected: category?.categoryType,
          isShowColProduct: true,
          isShowColAmount: false,
          productSeleted: null,
          arrSelectedExtra: [],
          customServiceSelected: null,
        }
      : {
          isShowColProduct: false,
          isShowColAmount: false,
          categorySelected: {
            categoryId: -1,
            categoryType: "",
          },
          productSeleted: null,
          categoryTypeSelected: "",
          arrSelectedExtra: [],
          customServiceSelected: null,
        },
  };
};

export const setServiceByStaff = (data) => {
  return {
    type: ACTION_TYPES.SET_SERVICE_BY_STAFF,
    payload: {
      isLoadingService: false,
      serviceStaff: data,
    },
  };
};

export const setProductByStaff = (data) => {
  return {
    type: ACTION_TYPES.SET_PRODUCT_BY_STAFF,
    payload: {
      isLoadingService: false,
      productStaff: data,
    },
  };
};

export const selectCategoryItem = (item, isExist) => {
  return {
    type: ACTION_TYPES.SELECT_CATEGORY_ITEM,
    payload: isExist
      ? {
          productSeleted: null,
          isShowColAmount: false,
          arrSelectedExtra: [],
          customServiceSelected: null,
        }
      : {
          productSeleted: item,
          isShowColAmount: true,
          arrSelectedExtra: [],
          customServiceSelected: null,
        },
  };
};

export const selectExtraItem = (arr) => {
  return {
    type: ACTION_TYPES.SELECT_EXTRA,
    payload: { arrSelectedExtra: arr },
  };
};

export const setBasket = (obj) => {
  return {
    type: ACTION_TYPES.SET_BASKET,
    payload: obj,
  };
};

export const visibleEditProductForm = (bl) => {
  return {
    type: ACTION_TYPES.VISIBLE_EDIT_PRODUCT_FORM,
    payload: {
      visibleChangePriceAmountProduct: bl,
    },
  };
};

export const visiblePopupDiscountLocal = (bl) => {
  return {
    type: ACTION_TYPES.VISIBLE_POPUP_DISCOUNt_LOCAL,
    payload: {
      visiblePopupDiscountLocal: bl,
    },
  };
};

export const visibleChangeTip = (bl) => {
  return {
    type: ACTION_TYPES.VISIBLE_POPUP_DISCOUNt_LOCAL,
    payload: {
      visibleChangeTip: bl,
    },
  };
}; // bo dung useState

export const updateBasket = (args) => {
  return {
    type: ACTION_TYPES.UPDATE_BASKET,
    payload: args,
  };
};

export const resetPayment = () => {
  return {
    type: ACTION_TYPES.RESET_PAYMENT,
    payload: {
      changeButtonDone: false,
      isCancelHarmonyPay: false,
      paymentSelected: "",
    },
  };
};

export const signalPayment = () => {
  return {
    type: ACTION_TYPES.SIGNAL_PAYMENT,
    payload: {
      isCancelHarmonyPay: true,
      changeButtonDone: true,
    },
  };
};

export const resetState = () => {
  return {
    type: ACTION_TYPES.RESET_STATE,
  };
};

export const selectGiftCard = (category) => {
  return {
    type: ACTION_TYPES.SELECT_GIFT_CARD,
    payload: {
      categorySelected: category,
      categoryTypeSelected: category?.categoryType,
      productSeleted: null,
      isShowColProduct: false,
      isShowColAmount: false,
      arrSelectedExtra: [],
      customServiceSelected: null,
    },
  };
};

export const closeBillOfPayment = () => {
  return {
    type: ACTION_TYPES.CLOSE_BILL_PAYMENT,
    payload: {
      changeButtonDone: false,
      paymentSelected: "",
    },
  };
};

export const setCustomService = (params) => {
  return {
    type: ACTION_TYPES.SET_CUSTOM_SERVICE,
    payload: {
      customServiceSelected: params,
    },
  };
};

export const setPayment = (payment) => {
  return {
    type: ACTION_TYPES.SET_PAYMENT,
    payload: payment,
  };
};

export const changeButtonDone = (bl) => {
  return {
    type: ACTION_TYPES.CHANGE_BUTTON_DONE,
    payload: {
      changeButtonDone: false,
    },
  };
};

export const updateCreditCardPay = (params) => {
  return {
    type: ACTION_TYPES.UPDATE_CREDIT_CARD,
    payload: params,
  };
};

export const setBlockStateFromCalendar = (bl) => {
  return {
    type: ACTION_TYPES.BLOCK_SELECT_STAFF,
    payload: {
      isShowCategoriesColumn: true,
      isBlockBookingFromCalendar: bl,
      isBookingFromAppointmentTab: true,
    },
  };
};
