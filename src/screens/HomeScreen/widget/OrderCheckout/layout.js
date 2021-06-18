import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import _ from 'ramda';

import {
    scaleSize, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber, checkCategoryIsNotExist,
} from '@utils';
import {
    Text, ButtonCustom, Button, PopupConfirm, PopupPayCompleted, PopupChangeMoney,
    PopupActiveGiftCard, PopupScanCode, PopupProcessingCredit, PopupInvoicePrint,
    PopupChangePriceAmountProduct, ScrollableTabView, PopupCheckStaffPermission
} from '@components';
import styles from './style';
import ICON from '@resources';
import {
    ItemCategory, ItemProductService, ItemAmount,
    ItemExtra, PopupDiscount, PopupBill, ItemCustomerBasket, PopupPaymentDetails,
    ItemPaymentMethod,
    PopupAddItemIntoAppointments,
    PopupEnterAmountGiftCard, EnterCustomerPhonePopup, PopupAddEditCustomer,
    ProductDetailModal, ItemBasket
} from './widget';

const MONEY_COLOR = "#4CD964";

class Layout extends React.Component {

    renderHeader() {
        const { language, groupAppointment, customerInfoBuyAppointment } = this.props;
        let firstName = customerInfoBuyAppointment?.firstName || "";
        let lastName = customerInfoBuyAppointment?.lastName || "";
        let phone = customerInfoBuyAppointment?.phone || "";
        let customerId = customerInfoBuyAppointment?.customerId || 0;
        const displayName = `${firstName} ${lastName}`;
        const firstLetter = customerInfoBuyAppointment?.firstName ? customerInfoBuyAppointment?.firstName[0] : "";

        return (
            <View style={styles.headerContainer} >
                {
                    customerId ? <Button onPress={this.displayCustomerInfoPopup} style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={styles.avatar_box} >
                            <Text style={styles.txt_avatar} >
                                {`${firstLetter}`}
                            </Text>
                        </View>
                        <View style={{ marginLeft: scaleSize(12) }} >
                            <Text style={styles.txt_customer_name} >
                                {`${displayName}`}
                            </Text>
                            <Text style={styles.txt_customer_phone} >
                                {`${phone}`}
                            </Text>
                        </View>

                        {/* -------- Enter other number --------- */}
                        <Button onPress={this.displayEnterUserPhonePopup} >
                            <Text style={styles.txt_enter_other_phone_number} >
                                {`Enter another phone`}
                            </Text>
                        </Button>

                    </Button> :
                        <Button onPress={this.displayEnterUserPhonePopup} style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Image source={ICON.checkout_customer_icon} style={{ width: scaleSize(30), height: scaleSize(30) }} />
                            <Text style={{ color: "#404040", fontSize: scaleSize(12), fontWeight: "600", marginHorizontal: scaleSize(8) }} >
                                {`Walking Customer`}
                            </Text>
                            <Image source={ICON.add_customer_info_checkout_tab} style={{ width: scaleSize(20), height: scaleSize(20) }} />
                        </Button>
                }



                {/* -------- Button open cash -------- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }} >
                    {
                        !_.isEmpty(groupAppointment) ? <Button onPress={this.printTemptInvoice} style={[styles.btnCashier, { marginRight: scaleSize(8) }]} >
                            <Image source={ICON.print_btn}
                                style={{ width: scaleSize(14), height: scaleSize(16) }}
                            />
                            <Text style={[styles.textBtnCashier, { fontSize: scaleSize(9), fontWeight: "500" }]} >
                                {localize('Print receipt', language)}
                            </Text>
                        </Button> : <View />
                    }


                    <Button onPress={this.checkStatusCashier} style={styles.btnCashier} >
                        <Image source={ICON.cashier_btn}
                            style={{ width: scaleSize(16), height: scaleSize(13) }}
                        />
                        <Text style={[styles.textBtnCashier, { fontSize: scaleSize(9), fontWeight: "500" }]} >
                            {localize('Open Cashier', language)}
                        </Text>
                    </Button>

                </View>
            </View>
        );
    }

    renderCategoriesCheckout() {
        const { language, categoriesByMerchant, groupAppointment } = this.props;
        const { isShowColProduct } = this.state;
        let tempWidth = 200;
        tempWidth = isShowColProduct ? 120 : tempWidth;

        const temptColorHeader = isShowColProduct ? { color: '#6A6A6A' } : {};
        const categoriesFilter = categoriesByMerchant.filter((category, index) => category.isDisabled === 0);

        const appointments = groupAppointment?.appointments || [];
        let tempIdCategoriesList = [];
        for (let appointment of appointments) {
            let categories = appointment?.categories || [];
            for (let category of categories) {
                tempIdCategoriesList.push(category?.categoryId || 0);
            }
        }

        const IdCategoriesList = [...new Set(tempIdCategoriesList)];
        let selectCategories = [];
        let notSelectCategories = [];
        let tempCategories;

        if (IdCategoriesList.length > 0) {
            for (let i = 0; i < IdCategoriesList.length; i++) {
                for (let j = 0; j < categoriesFilter.length; j++) {
                    if (IdCategoriesList[i] === categoriesFilter[j].categoryId) {
                        selectCategories.push({
                            ...categoriesFilter[j],
                            isSelect: true
                        });
                        break
                    }
                }
            }
            notSelectCategories = categoriesFilter.filter((category, index) => checkCategoryIsNotExist(category, IdCategoriesList));
            tempCategories = [...selectCategories, ...notSelectCategories];
        } else {
            tempCategories = [...categoriesFilter];
        }

        return (
            <View style={[{ width: scaleSize(tempWidth) }, styles.categories_column_box]} >
                {/* ------- Header ----- */}
                <View style={[styles.categoriesHeader,]} >
                    <Text style={[styles.textHeader, temptColorHeader, styles.txt_category_header_extra]} >
                        {localize('Categories', language)}
                    </Text>
                </View>
                {/* ------- Body ----- */}
                <View style={styles.categoriesBody} >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        {
                            tempCategories.map((category, index) => <ItemCategory
                                key={index}
                                category={category}
                                onPressSelectCategory={this.onPressSelectCategory}
                                colorText={temptColorHeader}
                                categorySelected={this.state.categorySelected}
                            />)
                        }

                        {/* --------- Gift Card --------  */}
                        <ItemCategory
                            category={{
                                name: "Gift Card",
                                categoryId: 1
                            }}
                            onPressSelectCategory={this.onSelectGiftCard}
                            colorText={temptColorHeader}
                            categorySelected={this.state.categorySelected}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }

    renderProductCheckout() {
        const { language } = this.props;
        const { isShowColAmount, categorySelected,
            categoryTypeSelected, selectedSubCategory
        } = this.state;
        let tempWidth = 200
        tempWidth = isShowColAmount ? 130 : tempWidth;
        const temptColorHeader = isShowColAmount ? { color: '#6A6A6A' } : {};
        const subCategories = categorySelected?.subCategories || [];

        return (
            <View style={[{ width: scaleSize(tempWidth) }, styles.product_column_box]} >
                {/* ----- Header ---- */}
                <View style={[styles.categoriesHeader,]} >
                    <Text style={[styles.textHeader, temptColorHeader, styles.txt_category_header_extra]} >
                        {localize("Subcategories", language)}
                    </Text>
                </View>
                {/* --------- List ------- */}
                <View style={{ flex: 1 }} >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                    >
                        {
                            subCategories.map((subCategory, index) => <ItemProductService
                                key={index}
                                item={subCategory}
                                showColAmount={this.showColAmount}
                                colorText={temptColorHeader}
                                selectedItem={selectedSubCategory}
                                categoryTypeSelected={categoryTypeSelected}
                                isShowColAmount={isShowColAmount}
                            />)
                        }
                    </ScrollView>
                </View>
            </View>

        );
    }

    renderAmountCheckout() {
        const { language, groupAppointment } = this.props;
        const { arrSelectedExtra } = this.state;

        return (
            <View style={[{ flex: 1 }, styles.product_column_box]} >
                <View style={{
                    flex: 1, borderLeftColor: "#DDDDDD", borderLeftWidth: 1,
                    borderRightColor: "#DDDDDD", borderRightWidth: 1
                }} >
                    {/* ----- Header ---- */}
                    <View style={[styles.categoriesHeader,]} >
                        <Text style={[styles.textHeader, styles.txt_category_header_extra]} >
                            {localize("Products", language)}
                        </Text>
                    </View>
                    {/* ------- Content ----- */}
                    <View style={{ flex: 1 }} >
                        {
                            (this.getProductsBySubCategoryId()).map((product, index) => <ItemExtra
                                key={index}
                                extra={product}
                                onPressSelectExtra={this.onPressSelectExtra}
                                arrSelectedExtra={arrSelectedExtra}
                                groupAppointment={groupAppointment}
                            />)
                        }
                    </View>
                </View>
            </View>

        );

    }

    renderGroupAppointments() {
        const { language, groupAppointment, paymentDetailInfo, isOfflineMode, isBookingFromCalendar,
            productDetailRetail
        } = this.props;
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
        const temptGrandTotal = groupAppointment.total ? groupAppointment.total : 0;

        const totalLocal = roundFloatNumber(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal));
        const paidAmounts = paymentDetailInfo.paidAmounts ? paymentDetailInfo.paidAmounts.slice(0).reverse() : [];
        const tempTotal = isOfflineMode ? totalLocal : temptGrandTotal;

        const products = productDetailRetail?.products || [];

        return (
            <View style={{ flex: 1 }} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                >
                    {
                        products.map((item, index) => <ItemBasket
                            // disabled={checkoutPayments.length === 0 ? false : true}
                            key={index}
                            item={item}
                            removeItemBasket={(item) => removeItemBasket(item, appointmentId, true)}
                            onPress={(service) => changeStylist(service, appointmentId)}
                            changeProduct={product => changeProduct(product, appointmentId)}
                        // removeExtra={(extra) => removeItemBasket(extra, appointmentId, true)}
                        />)
                    }

                    <View style={{ flexDirection: 'row', marginTop: scaleSize(10) }} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }} >
                            {/* ---------- Price ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Subtotal', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                    {`$ ${formatMoney(productDetailRetail?.subTotal)}`}
                                </Text>
                            </View>
                            {/* ---------- Discount ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Button style={{ flexDirection: "row" }} onPress={this.showModalDiscount} >
                                    <Text style={styles.textPay} >
                                        {`${localize('Discount', language)}:  `}
                                    </Text>
                                    {/* {
                                        checkoutPayments.length === 0 ?
                                            <Image source={ICON.add_discount_checkout}
                                                style={{ width: scaleSize(20), height: scaleSize(20) }}
                                            /> : null
                                    } */}
                                </Button>
                                <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                    {`$ ${formatMoney(productDetailRetail?.discount)}`}
                                </Text>
                            </View>


                            {/* ---------- Tax ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tax', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                    {`$ ${formatMoney(productDetailRetail?.tax)}`}
                                </Text>
                            </View>
                            {/* ---------- Line ------ */}
                            <View style={{
                                height: 2, backgroundColor: "#DDDDDD", marginTop: scaleSize(2),
                                marginBottom: scaleSize(6)
                            }} />
                            {/* ---------- Total ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600" }]} >
                                    {`${localize('Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: MONEY_COLOR, fontSize: scaleSize(16), fontWeight: "600" }]} >
                                    {`$ ${formatMoney(`${productDetailRetail?.total}`)}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* ----------- Grand Total ----------- */}
                    {
                        parseFloat(tempTotal) > 0 ? <View style={{ paddingHorizontal: scaleSize(10) }} >
                            <View style={{ height: 2, backgroundColor: "#0764B0", marginTop: scaleSize(10), marginBottom: scaleSize(15) }} />
                            <View style={styles.payNumberTextContainer} >
                                <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: "#0764B0" }]} >
                                    {`${localize('Grand Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: '#4CD964' }]} >
                                    {`$ ${formatMoney(tempTotal)}`}
                                </Text>
                            </View>
                        </View> : null
                    }

                    {/* ----------- Paid Amount ----------- */}
                    {
                        !isBookingFromCalendar && !_.isEmpty(paymentDetailInfo) ? <View style={{ paddingHorizontal: scaleSize(10), marginBottom: scaleSize(8) }} >
                            <View style={{ height: 2, backgroundColor: "#DDDDDD", marginTop: scaleSize(10), marginBottom: scaleSize(15) }} />
                            {/* ---------- Paid amount ------ */}
                            {
                                paidAmounts.map((paidAmountInfo, index) => <View key={index} style={[styles.payNumberTextContainer, { justifyContent: 'space-between', marginBottom: scaleSize(8) }]} >
                                    <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: "#404040" }]} >
                                        {`${localize('Paid ', language)}`}
                                        <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "300", color: '#404040' }]} >
                                            {` (${paidAmountInfo.paymentMethod})`}
                                        </Text>
                                    </Text>
                                    <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: '#404040' }]} >
                                        {`  $ ${formatMoney(paidAmountInfo.amount)}`}
                                    </Text>

                                </View>)
                            }


                            {/* ---------- Due amount ------ */}
                            {
                                !isBookingFromCalendar && paymentDetailInfo.dueAmount ? <View style={[styles.payNumberTextContainer, { justifyContent: 'space-between', }]} >
                                    <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: "#FF3B30" }]} >
                                        {`${localize('Amount Due', language)}:`}
                                    </Text>
                                    <Text style={[styles.textPay, { fontSize: scaleSize(16), fontWeight: "600", color: '#FF3B30' }]} >
                                        {`   $ ${formatMoney(paymentDetailInfo.dueAmount)}`}

                                    </Text>
                                </View> : <View />
                            }
                        </View> : <View />
                    }
                    <View style={{ height: scaleSize(50) }} />
                </ScrollView>
            </View>
        );
    }



    renderBasket() {
        const { language, } = this.props;
        const { isShowColAmount } = this.state;
        const tempStyle = !isShowColAmount ? { borderLeftWidth: 3, borderLeftColor: "#EEEEEE" } : {};

        return (
            <View style={[styles.basket_box, tempStyle]} >
                {/* -------- Header Basket -------- */}
                <View style={[styles.headerBasket, {
                    flexDirection: "row", paddingHorizontal: scaleSize(8),
                    backgroundColor: "#F1F1F1"
                },]} >
                    <View style={{ flex: 1 }} />
                    <Text style={[styles.textHeader, { fontWeight: "600", fontSize: scaleSize(16) }]} >
                        {localize('Basket', language)}
                    </Text>
                    <View style={{ flex: 1 }} />
                </View>
                {/* -------- Content Basket -------- */}
                {this.renderGroupAppointments()}
                {/* -------- Footer Basket -------- */}
                <View style={{ height: scaleSize(52), paddingHorizontal: scaleSize(8), paddingBottom: scaleSize(8) }} >
                    {this.renderButtonChekout()}
                </View>
            </View>
        );
    }

    renderPaymetsMethod() {
        const { language } = this.props;
        return (
            <View style={{ flex: 1, }} >
                <View style={[styles.payment_header, { paddingLeft: scaleSize(20) }]} >
                    <Text style={[styles.textHeader, { fontWeight: "600", fontSize: scaleSize(15) }]} >
                        {localize('Select payment method', language)}
                    </Text>
                </View>


                <View style={styles.box_payment_container} >
                    {
                        ['HarmonyPay', 'Cash'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)
                    }
                </View>
                <View style={styles.box_payment_container} >
                    {
                        ['Credit Card', 'Other'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)

                    }
                </View>
                <View style={styles.box_payment_container} >
                    {
                        ['Gift Card'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)

                    }
                </View>

                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSize(8) }} >
                    <ButtonCustom
                        width={scaleSize(300)}
                        title={localize('BACK', language)}
                        backgroundColor="#0764B0"
                        textColor="#fff"
                        onPress={this.backAddBasket}
                        style={styles.btn_back}
                        styleText={styles.txt_btn_basket}
                    />
                </View>

            </View>
        );
    }


    renderButtonChekout() {
        const { language, isDonePayment, groupAppointment, blockAppointments, isBookingFromCalendar } = this.props;
        const { tabCurrent, basket, paymentSelected, changeButtonDone, isCancelHarmonyPay
        } = this.state;

        let isAcceptPay = !_.isEmpty(groupAppointment) ? (groupAppointment.total && parseFloat(groupAppointment.total) > 0 ? true : false) : (basket.length > 0 ? true : false);
        isAcceptPay = paymentSelected === "Cash" ? true : isAcceptPay;

        if (tabCurrent === 1) {
            if (changeButtonDone && isCancelHarmonyPay) {
                if (paymentSelected === 'HarmonyPay') {
                    return (
                        <ButtonCustom
                            width={`100%`}
                            backgroundColor="#0764B0"
                            title={localize('CANCEL', language)}
                            textColor="#fff"
                            onPress={this.cancelHarmonyPayment}
                            style={styles.btn_basket}
                            styleText={styles.txt_btn_basket}
                        />
                    );
                }
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#F1F1F1"
                        title={localize('DONE', language)}
                        textColor="#6A6A6A"
                        onPress={() => { }}
                        style={styles.btn_basket}
                        styleText={styles.txt_btn_basket}
                        activeOpacity={1}
                    />
                );
            } else if (changeButtonDone && isDonePayment) {
                return <ButtonCustom
                    width={`100%`}
                    backgroundColor="#0764B0"
                    title={localize('DONE', language)}
                    textColor="#fff"
                    onPress={() => { }}
                    style={styles.btn_basket}
                    styleText={styles.txt_btn_basket}
                />
            } else if (paymentSelected === '' || paymentSelected === "Gift Card" || !isAcceptPay) {
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#F1F1F1"
                        title={localize('PAY', language)}
                        textColor="#6A6A6A"
                        onPress={() => { }}
                        style={styles.btn_basket}
                        activeOpacity={1}
                        styleText={styles.txt_btn_basket}
                    />
                );
            }
            return <ButtonCustom
                width={`100%`}
                backgroundColor="#0764B0"
                title={localize('PAY', language)}
                textColor="#fff"
                onPress={this.payBasket}
                style={styles.btn_basket}
                styleText={styles.txt_btn_basket}
            />

        } else if (tabCurrent === 2) {
            return (
                <ButtonCustom
                    width={`100%`}
                    backgroundColor="#0764B0"
                    title={localize('CONFIRM', language)}
                    textColor="#fff"
                    onPress={this.confimPayOfflinemode}
                    style={styles.btn_basket}
                    styleText={styles.txt_btn_basket}
                />
            );
        } else {
            if (blockAppointments.length > 0) {
                const isBooking = this.checkBlockAppointment(blockAppointments);
                if (isBooking) {
                    return (
                        <ButtonCustom
                            width={`100%`}
                            backgroundColor="#0764B0"
                            title={localize('BOOK', language)}
                            textColor="#fff"
                            onPress={this.bookBlockAppointment}
                            style={styles.btn_basket}
                            styleText={styles.txt_btn_basket}
                        />
                    );
                }
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#F1F1F1"
                        title={localize('BOOK', language)}
                        textColor="#6A6A6A"
                        onPress={() => { }}
                        style={styles.btn_basket}
                        activeOpacity={1}
                        styleText={styles.txt_btn_basket}
                    />
                );

            } else if (isBookingFromCalendar) {
                if (!_.isEmpty(groupAppointment) && formatNumberFromCurrency(groupAppointment?.total) > 0) {
                    return (
                        <ButtonCustom
                            width={`100%`}
                            backgroundColor="#0764B0"
                            title={localize('BOOK', language)}
                            textColor="#fff"
                            onPress={this.bookAppointmentFromCalendar}
                            style={styles.btn_basket}
                            styleText={styles.txt_btn_basket}
                        />
                    );
                } else {
                    return (
                        <ButtonCustom
                            width={`100%`}
                            backgroundColor="#F1F1F1"
                            title={localize('BOOK', language)}
                            textColor="#6A6A6A"
                            onPress={() => { }}
                            style={styles.btn_basket}
                            activeOpacity={1}
                            styleText={styles.txt_btn_basket}
                        />
                    );
                }


            } else if (basket.length > 0 || !_.isEmpty(groupAppointment)) {
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#0764B0"
                        title={localize('SELECT PAYMENT', language)}
                        textColor="#fff"
                        onPress={this.selectPayment}
                        style={styles.btn_basket}
                        styleText={styles.txt_btn_basket}
                    />
                );
            }
            return (
                <ButtonCustom
                    width={`100%`}
                    backgroundColor="#F1F1F1"
                    title={localize('SELECT PAYMENT', language)}
                    textColor="#6A6A6A"
                    onPress={() => { }}
                    style={styles.btn_basket}
                    activeOpacity={1}
                    styleText={styles.txt_btn_basket}
                />
            );
        }
    }


    renderOfflineMode() {
        const { language } = this.props;
        const { appointmentOfflineMode } = this.state;

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSize(22) }} >
                <Text style={[styles.textHeader, { fontSize: scaleSize(19), marginTop: scaleSize(10), marginBottom: scaleSize(12) }]} >
                    {localize('Offline mode', language)}
                </Text>
                <View style={{ alignItems: 'center', marginBottom: scaleSize(30) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]} >

                        {localize('Use consumer app to scan QR code below', language)}
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }} >
                    <View style={styles.containerQrcode} >
                        <QRCode
                            value={JSON.stringify(appointmentOfflineMode)}
                            size={scaleSize(200)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: scaleSize(25) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]} >
                        {localize('Then scan the QR code on the phone', language)}

                    </Text>
                    <Text style={[styles.textHeader, { fontSize: scaleSize(18) }]} >
                        {localize('to complete the transaction', language)}

                    </Text>
                </View>
                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSize(8) }} >
                    <ButtonCustom
                        width={scaleSize(300)}
                        title={localize('BACK', language)}
                        backgroundColor="#0764B0"
                        textColor="#fff"
                        onPress={() => this.scrollTabRef.current?.goToPage(1)}
                        style={styles.btn_back}
                        styleText={styles.txt_btn_basket}
                    />
                </View>
            </View>
        );
    }

    renderBodyCheckout() {
        const { isShowColProduct, isShowColAmount } = this.state;

        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ width: scaleSize(480) }} >
                    <ScrollableTabView
                        ref={this.scrollTabRef}
                        style={{
                            flex: 1,
                        }}
                        initialPage={0}
                        locked={true}
                        renderTabBar={() => <View />}
                        onChangeTab={(index) => {
                            this.setState({ tabCurrent: index.i })
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {this.renderCategoriesCheckout()}
                            {isShowColProduct ? this.renderProductCheckout() : null}
                            {isShowColAmount ? this.renderAmountCheckout() : null}
                            <View style={{ width: scaleSize(4) }} />
                        </View>
                        {this.renderPaymetsMethod()}
                        {this.renderOfflineMode()}
                    </ScrollableTabView>
                </View>
                {this.renderBasket()}
            </View>
        );
    }

    render() {
        const { language, visiblePopupPaymentDetails, visiblePopupCheckDiscountPermission, visiblePopupEnterGiftCardAmount,
            visibleProductDetailModalRetail
        } = this.props;
        const { visibleConfirm, visibleScanCode, visiblePopupAddItemIntoBasket, visibleAddEditCustomerPopup,
            visibleProductDetailModal
        } = this.state;

        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBodyCheckout()}
                <ProductDetailModal
                    ref={this.productDetailModalRef}
                    visible={visibleProductDetailModal}
                    onRequestClose={this.closeProductDetailModal}
                    addProductInfoToBasket={this.addProductInfoToBasket}
                    visibleProductDetailModalRetail={visibleProductDetailModalRetail}
                />
                <PopupDiscount
                    ref={this.popupDiscountRef}
                    title={localize('Discount', language)}
                />
                <PopupConfirm
                    visible={visibleConfirm}
                    title={localize('Confirmation', language)}
                    message="Are you sure you want to exit Check-Out?"
                    onRequestClose={() => { this.setState({ visibleConfirm: false }) }}
                    confimYes={this.clearDataCofrim}
                />
                <PopupChangeMoney
                    ref={this.cashBackRef}
                    title={localize('Confirmation', language)}
                    onRequestClose={() => { this.setState({ visibleChangeMoney: false }) }}
                    confimOK={this.doneBillByCash}
                />
                <PopupChangePriceAmountProduct
                    ref={this.changePriceAmountProductRef}
                    visible={this.state.visibleChangePriceAmountProduct}
                    title={localize('Modification', language)}
                    onRequestClose={() => { this.setState({ visibleChangePriceAmountProduct: false }) }}
                    changeProductBasketLocal={this.changeProductBasketLocal}
                />

                <PopupPayCompleted
                    onRequestClose={() => { }}
                    printBill={this.printBill}
                    donotPrintBill={this.donotPrintBill}
                />
                <PopupProcessingCredit
                    visible={this.state.visibleProcessingCredit}
                    onRequestClose={this.cancelTransaction}
                    language={language}
                />
                <PopupBill
                    ref={this.modalBillRef}
                    title={localize('Enter Amount', language)}
                    visible={this.state.visibleBillOfPayment}
                    onRequestClose={this.onRequestCloseBillModal}
                    language={language}
                    extractBill={this.extractBill}
                    doneBill={this.doneBill}
                />

                <PopupEnterAmountGiftCard
                    ref={this.popupEnterAmountGiftCardRef}
                    onRequestClose={this.onRequestCloseBillModal}
                    language={language}
                    extractBill={this.extractBill}
                    doneBill={this.doneBill}
                />

                <PopupActiveGiftCard
                    ref={this.activeGiftCardRef}
                    title={localize('Active Gift Card', language)}
                    onRequestClose={this.closePopupActiveGiftCard}
                    submitSerialCode={this.submitSerialCode}
                />
                <PopupPaymentDetails
                    title={localize('Payment Details', language)}
                    visible={visiblePopupPaymentDetails}
                    onRequestClose={this.closePopupProductPaymentDetails}
                    language={language}
                    nextPayment={this.nextPayment}
                />
                <PopupScanCode
                    visible={visibleScanCode}
                    onRequestClose={this.onRequestCloseScanCode}
                    resultScanCode={this.resultScanCode}
                />
                <PopupInvoicePrint
                    ref={this.invoicePrintRef}
                    visiblePrintInvoice={this.state.visiblePrintInvoice}
                    onRequestClose={this.cancelInvoicePrint}
                />
                <EnterCustomerPhonePopup
                    ref={this.popupCustomerInfoRef}
                    title={localize('Enter Phone Number', language)}
                    onRequestClose={() => { this.setState({ visibleCustomerName: false }) }}
                    changeStylistBasketLocal={this.changeStylistBasketLocal}
                />
                <PopupAddItemIntoAppointments
                    ref={this.popupAddItemIntoAppointmentsRef}
                    title={localize('Modification', language)}
                    visible={visiblePopupAddItemIntoBasket}
                    onRequestClose={() => this.setState({ visiblePopupAddItemIntoBasket: false })}
                />

                <PopupCheckStaffPermission
                    ref={this.popupCheckDiscountPermissionRef}
                    visiblePopupCheckStaffPermission={visiblePopupCheckDiscountPermission}
                    title={localize('Input PIN Number', language)}
                    tabName="CheckDiscountPermission"
                    onRequestClose={this.closePopupCheckDiscountPermission}
                />

                <PopupAddEditCustomer
                    ref={this.addEditCustomerInfoRef}
                    visible={visibleAddEditCustomerPopup}
                    title={"Customer Infomation"}
                    onRequestClose={() => this.setState({ visibleAddEditCustomerPopup: false })}
                    editCustomerInfo={this.editCustomerInfo}
                    addCustomerInfo={this.addCustomerInfo}
                />
            </View>
        );
    }

}


export default Layout;

