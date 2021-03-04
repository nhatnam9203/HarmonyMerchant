import moment from 'moment';

import apiConfigs from '../../configs/api';
import { formatWithMoment, splitPlusInPhoneNumber } from "@utils";


export function getAppointmentById(id) {
    return {
        type: 'GET_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${id}`,
        token: true
    }
}

export function getGroupAppointmentById(id, isNotShowMessage = true) {
    return {
        type: 'GET_GROUP_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/getGroupById/${id}`,
        token: true,
        isNotShowMessage
    }
}

export function addItemIntoAppointment(body, appointmentId, isGroup = false, isBlock = false) {
    return {
        type: 'ADD_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/additem/${appointmentId}`,
        appointmentId,
        isGroup,
        isBlock
    }
}

export function addItemIntoMultiAppointment(body, appointmentId, mainAppointmentId, isGroup = false, isBlock = false) {
    return {
        type: 'ADD_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/additem/${appointmentId}`,
        appointmentId: mainAppointmentId,
        isGroup,
        isBlock
    }
}



export function removeItemIntoAppointment(body, appointmentId, isGroup = false, isBlock = false) {
    return {
        type: 'REMOVE_ITEM_INTO_APPOINTMENT',
        body: body,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeitem/${appointmentId}`,
        appointmentId,
        isGroup,
        isBlock
    }
}

export function resetBasketEmpty() {
    return {
        type: 'RESET_BASKET_EMPTY'
    }
}

export function resetKeyUpdateAppointment() {
    return {
        type: 'RESET_KEY_GET_APPOINTMENT'
    }
}


export function checkoutAppointment(appointmentId, checkoutGroupId = 0) {
    return {
        type: 'CHECK_OUT_APPOINTMENT',
        body: {
            checkoutGroupId,
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/checkout/${appointmentId}`,
        checkoutGroupId,
        appointmentId
    }
}

export function paymentAppointment(groupId, method, amount, creditCardInfo = false, merchantId = -1, giftCardId = 0) {
    return {
        type: 'PAY_APPOINTMENT',
        body: {
            method,
            amount,
            giftCardId
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/selectpaymentmethod/${groupId}`,
        paymentMethod: method,
        amount,
        creditCardInfo,
        merchantId
    }
}

export function closeModalPaymentCompleted() {
    return {
        type: 'CLOSE_MODAL_PAYMENT_COMPLETED'
    }
}

export function createAnymousAppointment(merchantId, userId = 0, customerId = 0, staffId = 0, products = [], services = [], extras = [],
    paymentMethod, isLoading = true, customDiscountFixed, customDiscountPercent,
    firstName, lastName, phoneNumber, paidAmount = 0, creditCardInfo = false, isPayment = true,
) {
    return {
        type: 'CREATE_ANYMOUS_APPOINTMENT',
        body: {
            merchantId,
            userId: userId,
            staffId,
            customerId,
            status: 'checkin',
            services: services,
            extras: extras,
            products: products,
            fromTime: formatWithMoment(new Date(), 'MM/DD/YYYY hh:mm A'),
            customDiscountFixed,
            customDiscountPercent,
            firstName,
            lastName,
            phoneNumber
        },
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}appointment`,
        paymentMethod,
        isLoading,
        paidAmount,
        creditCardInfo,
        merchantId,
        isPayment
    }
}

export function createBlockAppointment(merchantId, fromTime = new Date(), userId = 0, customerId = 0, firstName = "", lastName = "", phoneNumber = "", bookingGroupId) {
    return {
        type: 'CREATE_BLOCK_APPOINTMENT',
        body: {
            merchantId,
            userId,
            customerId,
            status: 'confirm',
            services: [],
            extras: [],
            products: [],
            fromTime: moment.parseZone(fromTime).local().format('MM/DD/YYYY hh:mm A'),
            staffId: 0,
            customDiscountFixed: 0,
            customDiscountPercent: 0,
            firstName,
            lastName,
            phoneNumber,
            bookingGroupId
        },
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}appointment`,
        fromTimeBlockAppointment: fromTime
    }
}

export function getBlockAppointmentById(appointmentId, isGetBookingGroupId = false) {
    return {
        type: 'GET_BLOCK_APPOINTMENT_BY_ID',
        method: 'GET',
        api: `${apiConfigs.BASE_API}appointment/${appointmentId}`,
        token: true,
        appointmentId,
        isGetBookingGroupId
    }
}

export function resetPayment() {
    return {
        type: 'RESET_PAYMENT'
    }
}

export function showModalPrintReceipt() {
    return {
        type: 'SHOW_MODAL_PRINT_RECEIPT'
    }
}


export function donePaymentHarmony() {
    return {
        type: 'PAY_APPOINTMENT_SUCCESS'
    }
}

export function checkoutSubmit(appointmentId) {
    return {
        type: 'CHECKOUT_SUBMIT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}checkout/submit/${appointmentId}`,
    }
}

export function referenceConnectionSignalR(connection) {
    return {
        type: 'REFERENCE_CONNECTION_SIGNALR',
        payload: connection
    }
}

export function resetConnectSignalR() {
    return {
        type: 'RESET_CONNECT_SIGNALR',
        payload: {}
    }
}

export function changeFlagSigninAppointment(flag = false) {
    return {
        type: 'CHANGE_FLAG_APPOINTMENT',
        payload: flag
    }
}


export function submitPaymentWithCreditCard(merchantId, responseData, checkoutPaymentId, moneyUserGiveForStaff) {
    return {
        type: 'SUBMIT_PAYMENT_WITH_CREDIT_CARD',
        body: {
            merchantId,
            userId: 0,
            title: 'pax',
            responseData,
            checkoutPaymentId: checkoutPaymentId
        },
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}paymentTransaction`,
        paymentMethod: "credit_card",
        amount: moneyUserGiveForStaff,
        checkoutPaymentId: checkoutPaymentId
    }
}

export function cancelHarmonyPayment(appointmentId) {
    return {
        type: 'CANCEL_HARMONY_PAYMENT',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/cancelmethod/${appointmentId}`,
    }
}

export function addAppointmentOfflineMode(body) {
    return {
        type: 'ADD_APPOINTMENT_OFFLINE_MODE',
        payload: body
    }
}

export function submitAppointmentOffline(body) {
    return {
        type: 'SUBMIT_APPOINTMENT_OFFLINE',
        body: body,
        method: 'POST',
        token: true,
        api: `${apiConfigs.BASE_API}appointmentOffline`,
    }
}


export function cancleAppointment(appointmentId, merchantId, userId, isBlock = false, isCancelManyAppointment = false) {
    return {
        type: 'CANCEL_APPOINTMENT',
        body: {
            staffId: 0,
            customerId: 0,
            merchantId,
            userId,
            status: "cancel",
            services: [],
            products: [],
            extras: [],
            fromTime: new Date(),
            toTime: new Date(),
        }
        ,
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/${appointmentId}`,
        isBlock,
        appointmentId,
        isCancelManyAppointment
    }
}

export function removeAppointmentInGroup(appointmentId) {
    return {
        type: 'REMOVE_APPOINTMENT_IN_GROUP',
        body: {},
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/removeGroup/${appointmentId}`,
    }
}

export function resetGroupAppointment() {
    return {
        type: 'RESET_GROUP_APPOINTMENT',
    }
}

export function closePopupPaymentDetail() {
    return {
        type: 'CLOSE_POPUP_PAYMENT_DETAIL',
    }
}

export function completeTransaction() {
    return {
        type: 'TRACSACTION_COMPLETED',
    }
}


export function updatePaymentInfoByHarmonyPayment(data) {
    return {
        type: 'UPDATE_PAYMENT_DETAIL_INFO_BY_HARMONY_PAYMENT',
        payload: data
    }
}

export function showPopupChangeMoney(data) {
    return {
        type: 'SHOW_POPUP_CHANGED_MONEY',
        payload: data
    }
}

export function showPopupPaymentDetails() {
    return {
        type: 'SHOW_POPUP_PAYMENT_DETAILS',
    }
}

export function handleVisibleActiveGiftCard(visible = true) {
    return {
        type: 'VISIBLE_POPUP_ACTIVE_GIFT_CARD',
        payload: visible
    }
}

export function checkSerialNumber(serialId, bodyAction = false, optionAction = false, isGiftCardPayment = false) {
    return {
        type: 'CHECK_SERIAL_NUMBER',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}giftcard/serialNumber/${serialId}?isActive=${isGiftCardPayment}`,
        bodyAction,
        optionAction,
        isGiftCardPayment
    }
}

export function addGiftCardIntoBlockAppointment(serialId, appointmentId) {
    return {
        type: 'ADD_GIFT_CARD_INTO_BLOCK_APPOINTMENT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}giftcard/serialNumber/${serialId}`,
        appointmentId

    }
}

export function updateCustomerInAppointment(appointmentId, body) {
    return {
        type: 'UPDATE_CUSTOMER_IN_APPOINTMENT',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}appointment/updateCustomer/${appointmentId}`,
    }
}


export function setWebviewRefToRedux(webviewRef) {
    return {
        type: 'SET_WEBVIEW_REF_TO_REDUX',
        payload: webviewRef
    }
}

export function convertBasketOfflineMode(appointment) {
    return {
        type: 'CONVERT_BASKET_OFFLINE_MODE',
        payload: appointment
    }
}

export function checkoutAppointmentOffline(appointmentId) {
    return {
        type: 'CHECK_OUT_APPOINTMENT_OFFLINE',
        payload: appointmentId
    }
}


export function checkAppointmentBeforOffline(isCheck = true) {
    return {
        type: "CHECK_APPOINTMENT_BEFORE_OFFLINE",
        payload: isCheck
    }
}

export function updateProductInAppointment(appointmentId, body, isGroup = true) {
    return {
        type: 'UPDATE_PRODUCT_IN_APPOINTMENT',
        method: 'PUT',
        body,
        token: true,
        api: `${apiConfigs.BASE_API}appointment/updateProduct/${appointmentId}`,
        appointmentId,
        isGroup
    }
}


export function addBlockAppointmentRef(ref) {
    return {
        type: "ADD_BLOCK_APPOINTMENT_REF",
        payload: ref
    }
}

export function bookBlockAppointment() {
    return {
        type: "BOOK_BLOCK_APPOINTMENT",
    }
}

export function updateIdBlockAppointmentOpen(blockAppointmentId) {
    return {
        type: "UPDATE_ID_APPOINTMENT_IS_OPEN",
        payload: blockAppointmentId
    }
}

export function getCustomerBuyAppointment(phoneNumber, customerInfoLocal = {
    customerId: 0,
    firstName: "",
    lastName: "",
    phone: ""
}) {
    return {
        type: 'GET_CUSTOMER_INFO_BUY_APPOINTMENT',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}customer/getbyphone/${splitPlusInPhoneNumber(phoneNumber)}`,
        customerInfoLocal
    }
}

export function switchVisibleEnterCustomerPhonePopup(visible = true) {
    return {
        type: "SWITCH_VISIBLE_ENTER_CUSTOMER_PHONE_POPUP",
        payload: visible
    }
}

export function updateFromTimeBlockAppointment(fromTime = new Date()) {
    return {
        type: "UPDATE_FROM_TIME_BLOCK_APPOINTMENT",
        payload: fromTime
    }
}

export function togglePopupGiftCardPaymentDetail(visible = true) {
    return {
        type: "TOGGLE_POPUP_GIFT_CARD_PAYMENT_DETAIL",
        payload: visible
    }
}

export function switchPopupGiftCardEnterAmount(visible = true) {
    return {
        type: "SWITCH_POPUP_GIFT_CARD_ENTER_AMOUNT",
        payload: visible
    }
}

export function handleEnterGiftCardAmount(amount = 0) {
    return {
        type: "HANDLE_ENTER_GIFT_CARD_AMOUNT",
        payload: amount
    }
}

export function updateQuantityOfGiftCard(visible) {
    return {
        type: "UPDATE_QUANTITY_OF_GIFT_CARD",
        payload: visible
    }
}

export function getGiftCardsActiveList(keySearch = "", page = 1, isShowLoading = true, isShowLoadMore = false, isRefreshing = false) {
    return {
        type: 'GET_GIFT_CARDS_ACTIVE_LIST',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}giftcard/getByMerchant?keySearch=${keySearch}&page=${page}`,
        currentPage: page,
        isShowLoading,
        isShowLoadMore,
        isRefreshing
    }
}

export function getGiftCardLogs(giftCardId = 0) {
    return {
        type: 'GET_GIFT_CARDS_LOGS',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}giftcardlog/${giftCardId}`,
    }
}

export function switchGiftCardTabPermission(visible = true) {
    return {
        type: 'SWITCH_GIFT_CARD_TAB_PERMISSION',
        payload: visible
    }
}

export function checkCreditPaymentToServer(groupId, amount, paxAmount) {
    return {
        type: 'CHECK_CREDIT_PAYMENT_TO_SERVER',
        body: {
            method: "credit_card",
            amount,
            giftCardId: 0
        },
        method: 'PUT',
        token: true,
        api: `${apiConfigs.BASE_API}appointment/selectpaymentmethod/${groupId}`,
        paxAmount,
        moneyUserGiveForStaff: amount
    }
}

export function resetStateCheckCreditPaymentToServer(visible = false) {
    return {
        type: 'RESET_STATE_CHECK_CREDIT_PAYMENT_TO_SERVER',
        payload: visible
    }
}


export function getStaffListByCurrentDate(merchantId) {
    const date = formatWithMoment(new Date(), "YYYY-MM-DD");
    return {
        type: 'GET_STAFF_LIST_BY_CURRENT_DATE',
        method: 'GET',
        token: true,
        api: `${apiConfigs.BASE_API}staff/getbydate/${merchantId}?date=${date}`,
    }
}

export function switchVisibleAddEditCustomerPopup(visible = true) {
    return {
        type: 'SWITCH_VISIBLE_ADD_EDIT_CUSTOMER_POPUP',
        payload: visible
    }
}
