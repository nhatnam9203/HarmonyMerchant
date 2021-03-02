export default {
    isShowColProduct: false,
    isShowColAmount: false,
    categorySelected: {
        categoryId: -1,
        categoryType: ''
    },
    productSeleted: {
        name: ''
    },
    categoryTypeSelected: '',
    extraSelected: {
        extraId: -1,
        name: ''
    },
    basket: [],
    visibleDiscount: false,
    paymentSelected: '',
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
        firstName: '',
        lastName: '',
        phoneNumber: ''
    },
    visiblePaymentCompleted: false,
    changeButtonDone: false,
    methodPayment: '',
    visibleProcessingCredit: false,
    visibleBillOfPayment: false,
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
    visiblePopupPaymentDetails: false,
    isCancelHarmonyPay: false,
    customerInfoByPhone: {
        userId: 0
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
    isShowCategoriesColumn: false
}