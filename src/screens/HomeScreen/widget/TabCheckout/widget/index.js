import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie} from '@utils';
import {
    Text, Button,
} from '@components';

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

import styles from "../style";

const ItemPaymentMethod = ({ title, selectedPayment, paymentSelected }) => {
    const temptBackground = title === paymentSelected ? { backgroundColor: '#0764B0' } : {};
    const temptTextColor = title === paymentSelected ? { color: '#fff' } : {};

    return (
        <Button onPress={() => selectedPayment(title)} style={[{
            width: scaleSzie(180), height: scaleSzie(80), borderWidth: 1, borderColor: '#6A6A6A',
            justifyContent: 'center', alignItems: 'center'
        }, temptBackground]} >
            <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }, temptTextColor]} >
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
    ShadowLineShort
}


