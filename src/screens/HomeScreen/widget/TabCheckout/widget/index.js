import React from 'react';
import {
    View,
    Platform,
    Image
} from 'react-native';

import { ScaleSzie, checkIsTablet } from '@utils';
import {
    Text, Button,
} from '@components';
import ICON from "@resources";

import ItemCategory from './ItemCategory';
import ColPlaceHolder from './ColPlaceHolder';
import ItemBasket from './ItemBasket';
import ItemProductService from './ItemProductService';
import ItemAmount from './ItemAmount';
import ItemExtra from './ItemExtra';
import PopupDiscount from './PopupDiscount';
import PopupBill from './PopupBill';
import PopupDiscountLocal from './PopupDiscountLocal';
import ItemCustomerBasket from './ItemCustomerBasket';
import PopupPaymentDetails from './PopupPaymentDetails';
import ItemBlockBasket from "./ItemBlockBasket";
import PopupBlockDiscount from "./PopupBlockDiscount";
import PopupChangeCustomerInfo from "./PopupChangeCustomerInfo";
import PopupAddItemIntoAppointments from "./PopupAddItemIntoAppointments";
import PopupGiftCardDetail from "./PopupGiftCardDetail";
import PopupEnterAmountGiftCard from "./PopupEnterAmountGiftCard";
import EnterCustomerPhonePopup from "./EnterCustomerPhonePopup";
import PopupAddEditCustomer from "./PopupAddEditCustomer";
import ErrorMessagePaxModal from './ErrorMessagePaxModal';

function getPaymentLogoByName(name) {
    let logo = "";
    switch (name) {
        case "HarmonyPay":
            logo = "harmony_payment";
            break;
        case "Cash":
            logo = "cash_payment";
            break;
        case "Credit Card":
            logo = "credit_payment";
            break;
        case "Debit Card":
            logo = "debit_payment";
            break;
        case "Gift Card":
            logo = "giftcard_payment";
            break;
        case "Other":
            logo = "other_payment";
            break;
        default:
            logo = "harmony_payment";
    }
    return logo;
}

const ItemPaymentMethod = ({ title, selectedPayment, paymentSelected }) => {
    const temptBackground = title === paymentSelected ? { backgroundColor: '#0764B0' } : {};
    const temptTextColor = title === paymentSelected ? { color: '#fff' } : {};
    const logo = getPaymentLogoByName(title);
    const tempLogo = title === paymentSelected ? `${logo}_se` : logo;

    const isTablet = checkIsTablet();
    const tempHeight = isTablet ? ScaleSzie(65) : ScaleSzie(80);
    const icon_style = isTablet ? { width: ScaleSzie(30), height: ScaleSzie(30) } : {};
    const tempTitleMarginTop = isTablet ? ScaleSzie(2) : ScaleSzie(8);

    return (
        <Button onPress={() => selectedPayment(title)} style={[{
            width: ScaleSzie(190), height: tempHeight,
            backgroundColor: "#fff",
            justifyContent: 'center', alignItems: 'center',
            borderRadius: 8,
            ...Platform.select({
                ios: {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                },
                android: {
                    elevation: 2,
                },
            })
        }, temptBackground]} >
            <Image
                source={ICON[tempLogo]}
                style={icon_style}
            />
            <Text style={[{
                fontSize: ScaleSzie(13),
                color: '#404040', marginTop: tempTitleMarginTop
            }, temptTextColor]} >
                {title}
            </Text>
        </Button>
    );
}

const ShadowLineLeftToRight = ({ style }) => {
    return (
        <>
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.1)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.08)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.06)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.02)" }} />
            <View style={{ flex: 1 }} />
        </>
    )
}

const ShadowLineRightToLeft = ({ style }) => {
    return (
        <>
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.02)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.06)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.08)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.1)" }} />
            <View style={{ flex: 1 }} />
        </>
    )
}

const ShadowLineShort = ({ style }) => {
    return (
        <>
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.02)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
            <View style={{ width: 1, backgroundColor: "rgba(0, 0, 0,0.04)" }} />
        </>
    )
}

module.exports = {
    ItemCategory,
    ColPlaceHolder,
    ItemBasket,
    ItemProductService,
    ItemAmount,
    ItemExtra,
    PopupDiscount,
    PopupBill,
    PopupDiscountLocal,
    ItemCustomerBasket,
    PopupPaymentDetails,
    ItemBlockBasket,
    PopupBlockDiscount,
    PopupChangeCustomerInfo,
    ItemPaymentMethod,
    ShadowLineLeftToRight,
    ShadowLineRightToLeft,
    ShadowLineShort,
    PopupAddItemIntoAppointments,
    PopupGiftCardDetail,
    PopupEnterAmountGiftCard,
    EnterCustomerPhonePopup,
    PopupAddEditCustomer,
    ErrorMessagePaxModal
}


