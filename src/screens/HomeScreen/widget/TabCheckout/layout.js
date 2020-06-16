import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import QRCode from 'react-native-qrcode-svg';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney } from '@utils';
import {
    Text, ButtonCustom, Button, PopupConfirm, PopupPayCompleted, PopupChangeStylist, PopupChangeMoney,
    PopupSendLinkInstall, PopupActiveGiftCard, PopupScanCode, PopupProcessingCredit, PopupInvoicePrint,
    PopupChangePriceAmountProduct, PopupChangeTip
} from '@components';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemCategory, ColPlaceHolder, ItemProductService, ItemAmount,
    ItemExtra, PopupDiscount, PopupBill, PopupDiscountLocal, PopupEnterInfo,
    PopupEnterCustomerPhone, ItemCustomerBasket, PopupPaymentDetails, ItemBlockBasket,
    PopupBlockDiscount
} from './widget';

class Layout extends React.Component {

    renderHeader() {
        const { language, groupAppointment } = this.props;
        const { infoUser } = this.state;
        let firstName = '';
        let lastName = '';
        let phoneNumber = '';

        if (!_.isEmpty(groupAppointment)) {
            const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
            const appointmentMain = appointments.find(appointment => appointment.isMain === 1);
            if (appointmentMain) {
                firstName = appointmentMain.firstName ? appointmentMain.firstName : '';
                lastName = appointmentMain.lastName ? appointmentMain.lastName : '';
                phoneNumber = appointmentMain.phoneNumber ? appointmentMain.phoneNumber : '';
            }
        }
        firstName = infoUser.firstName !== '' ? infoUser.firstName : firstName;
        lastName = infoUser.lastName !== '' ? infoUser.lastName : lastName;
        phoneNumber = infoUser.phoneNumber !== '' ? infoUser.phoneNumber : phoneNumber;

        const name = `${firstName} ${lastName}`;
        return (
            <View style={styles.headerContainer} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text onPress={this.displayPopupCustomerName} style={styles.textHeader} >
                        {`${localize('Customer', language)}:`}
                    </Text>
                    {
                        name.trim() == '' ?
                            <ButtonCustom
                                width={scaleSzie(100)}
                                height={30}
                                backgroundColor="rgb(247,247,247)"
                                title={localize('Enter Name', language)}
                                textColor="rgb(63,63,63)"
                                onPress={this.displayPopupCustomerName}
                                style={{
                                    borderWidth: 1, borderColor: 'rgb(199,199,199)',
                                    borderRadius: scaleSzie(3),
                                    marginHorizontal: scaleSzie(14),
                                    alignItems: "flex-start",
                                    paddingHorizontal: scaleSzie(10)
                                }}
                                styleText={{ fontSize: scaleSzie(12), }}
                            />
                            : <Text onPress={this.displayPopupCustomerName} style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(30) }]} >
                                {`${firstName} ${lastName}`}
                            </Text>
                    }


                    <Text onPress={this.displayPopupCustomerPhone} style={styles.textHeader} >
                        {`${localize('Phone', language)}:`}
                    </Text>
                    {
                        phoneNumber.trim() == '' ?
                            <ButtonCustom
                                width={scaleSzie(100)}
                                height={30}
                                backgroundColor="rgb(247,247,247)"
                                title={localize('Enter Phone', language)}
                                textColor="rgb(63,63,63)"
                                onPress={this.displayPopupCustomerPhone}
                                style={{
                                    borderWidth: 1, borderColor: 'rgb(199,199,199)',
                                    borderRadius: scaleSzie(3),
                                    marginHorizontal: scaleSzie(14),
                                    alignItems: "flex-start",
                                    paddingHorizontal: scaleSzie(10)
                                }}
                                styleText={{ fontSize: scaleSzie(12), }}
                            />
                            : <Text onPress={this.displayPopupCustomerPhone} style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(12) }]} >
                                {phoneNumber}
                            </Text>
                    }

                </View>
                {/* -------- Button open cash -------- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }} >
                    {
                        !_.isEmpty(groupAppointment) ? <Button onPress={this.printTemptInvoice} style={[styles.btnCashier, { marginRight: scaleSzie(8) }]} >
                            <Image source={IMAGE.print_btn}
                                style={{ width: scaleSzie(14), height: scaleSzie(16) }}
                            />
                            <Text style={styles.textBtnCashier} >

                                {localize('Print receipt', language)}
                            </Text>
                        </Button> : <View />
                    }


                    <Button onPress={this.checkStatusCashier} style={styles.btnCashier} >
                        <Image source={IMAGE.cashier_btn}
                            style={{ width: scaleSzie(16), height: scaleSzie(13) }}
                        />
                        <Text style={styles.textBtnCashier} >
                            {localize('Open Cashier', language)}
                        </Text>
                    </Button>

                </View>
            </View>
        );
    }

    renderCategoriesCheckout() {
        const { language, categoriesByMerchant } = this.props;
        const { isShowColProduct } = this.state;
        const temptWidth = isShowColProduct ? 120 : 202;
        const temptColorHeader = isShowColProduct ? { color: '#6A6A6A' } : {};
        const categoriesFilter = categoriesByMerchant.filter((category, index) => category.isDisabled === 0);

        return (
            <View style={{
                width: scaleSzie(temptWidth),
                borderLeftColor: "#DDDDDD", borderLeftWidth: 1
            }} >
                {/* ------- Header ----- */}
                <View style={[styles.categoriesHeader,]} >
                    <Text style={[styles.textHeader, temptColorHeader]} >
                        {localize('Categories', language)}
                    </Text>
                </View>
                {/* ------- Body ----- */}
                <View style={styles.categoriesBody} >
                    <ScrollView showsVerticalScrollIndicator={false} >
                        {
                            categoriesFilter.map((category, index) => <ItemCategory
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
        const { isShowColProduct, isShowColAmount, categorySelected, productSeleted,
            categoryTypeSelected,
        } = this.state;
        let temptWidth = isShowColProduct ? 224 : 122;
        temptWidth = isShowColAmount ? 72 : temptWidth;
        const temptBorder = isShowColAmount ? 'rgb(197,197,197)' : '#DDDDDD';
        const temptColorHeader = isShowColAmount ? { color: '#6A6A6A' } : {};
        const data = this.getDataColProduct();

        const temptWidht = isShowColAmount ? {} : { borderRightColor: "#DDDDDD", borderRightWidth: 1 };

        return (
            <View style={{ width: scaleSzie(temptWidth) }} >
                {
                    !isShowColProduct ?
                        <View style={{
                            flex: 1, borderRightColor: "#DDDDDD", borderRightWidth: 1, flexDirection: "row",
                            backgroundColor: "#fff"
                        }} >
                            <ShadowLineLeftToRight />
                        </View>
                        :
                        <View style={{
                            flex: 1, flexDirection: 'row',
                        }} >
                            {/* ------- Shadow Line ----- */}
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: "#fff"
                            }} >
                                <ShadowLineRightToLeft />
                            </View>

                            <View style={[{
                                flex: 1,
                            }, temptWidht]} >
                                {/* ----- Header ---- */}
                                <View style={{
                                    height: scaleSzie(36),
                                    borderBottomWidth: 2,
                                    borderColor: '#DDDDDD',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} >
                                    <Text style={[styles.textHeader, temptColorHeader]} >
                                        {localize(categorySelected.categoryType, language)}
                                    </Text>
                                </View>
                                {/* --------- List ------- */}
                                <View style={{ flex: 1 }} >
                                    <ScrollView showsVerticalScrollIndicator={false} >
                                        {
                                            data.map((item, index) => <ItemProductService
                                                key={index}
                                                item={item}
                                                showColAmount={this.showColAmount}
                                                colorText={temptColorHeader}
                                                itemSelected={productSeleted}
                                                categoryTypeSelected={categoryTypeSelected}
                                                isShowColAmount={isShowColAmount}
                                            />)
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                }
            </View>

        );
    }

    renderAmountCheckout() {
        const { language } = this.props;
        const { isShowColAmount, categorySelected, categoryTypeSelected, productSeleted, isShowColProduct } = this.state;
        const temptWidth = isShowColAmount ? 254 : 102;
        const temptHeader = categorySelected.categoryType === 'Service' ? 'Extra' : 'Amount';

        const atualWidth = !isShowColAmount && !isShowColProduct ? 122 : temptWidth;

        return (
            <View style={{ width: scaleSzie(atualWidth) }} >
                {
                    !isShowColAmount ?
                        <View style={{
                            flex: 1, borderRightColor: "#DDDDDD", borderRightWidth: 1, flexDirection: "row",
                            backgroundColor: "#fff"
                        }} >
                            {isShowColProduct ? <ShadowLineLeftToRight /> : null}
                        </View>
                        :
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {/* ------- Shadow Line ----- */}
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: "#fff"
                            }} >
                                <ShadowLineShort />
                            </View>
                            <View style={{
                                flex: 1, borderLeftColor: "#DDDDDD", borderLeftWidth: 1,
                                borderRightColor: "#DDDDDD", borderRightWidth: 1
                            }} >
                                {/* ----- Header ---- */}
                                <View style={{
                                    height: scaleSzie(36),
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#DDDDDD',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} >
                                    <Text style={styles.textHeader} >
                                        {localize(temptHeader, language)}
                                    </Text>
                                </View>
                                {/* ------- Content ----- */}
                                <View style={{ flex: 1 }} >
                                    {
                                        categoryTypeSelected === 'Product' ? <ItemAmount
                                            ref={this.amountRef}
                                            price={productSeleted.price}
                                        /> : <ScrollView>
                                                {
                                                    (this.getExtrasFromRedux(productSeleted)).map((extra, index) => <ItemExtra
                                                        key={index}
                                                        extra={extra}
                                                        onPressSelectExtra={this.onPressSelectExtra}
                                                        extraSelected={this.state.extraSelected}
                                                    />)
                                                }
                                            </ScrollView>
                                    }

                                </View>
                                {/* ------- Footer -------- */}
                                <View style={{ height: scaleSzie(70), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(8) }} >
                                    <ButtonCustom
                                        width={`100%`}
                                        backgroundColor="#F1F1F1"
                                        title={localize('ADD', language)}
                                        textColor="#6A6A6A"
                                        onPress={this.addAmount}
                                        style={{
                                            borderWidth: 1, borderColor: '#C5C5C5',
                                            backgroundColor: '#0764B0',
                                            flex: 1
                                        }}
                                        styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', color: '#fff' }}
                                    />
                                </View>

                            </View>

                            {/* ------- Shadow Line ----- */}
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: "#fff"
                            }} >
                                <ShadowLineLeftToRight />
                            </View>
                        </View>
                }
            </View>

        );

    }

    renderGroupAppointments() {
        const { infoUser } = this.state;
        const { language, groupAppointment, paymentDetailInfo, isOfflineMode } = this.props;
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
        const temptGrandTotal = groupAppointment.total ? groupAppointment.total : 0;

        const totalLocal = Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2);


        return (
            <View style={{ flex: 1 }} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    {
                        _.isEmpty(groupAppointment) ? (basket.length > 0 ? <ItemCustomerBasket
                            language={language}
                            subTotalLocal={subTotalLocal}
                            tipLocal={tipLocal}
                            discountTotalLocal={discountTotalLocal}
                            taxLocal={taxLocal}
                            removeItemBasket={this.removeItemBasket}
                            changeStylist={this.changeStylist}
                            changeProduct={this.changeProduct}
                            showModalDiscount={this.showModalDiscount}
                            basketLocal={basket}
                            infoUser={infoUser}
                            isOfflineMode={true}
                            showModalTipAppointment={this.showModalTipAppointment}

                        /> : <View />) : appointments.map((appointment, index) => <ItemCustomerBasket
                            key={`${appointment.appointmentId}_${index}`}
                            language={language}
                            appointmentDetail={appointment}
                            subTotalLocal={subTotalLocal}
                            tipLocal={tipLocal}
                            discountTotalLocal={discountTotalLocal}
                            taxLocal={taxLocal}
                            removeItemBasket={this.removeItemBasket}
                            changeStylist={this.changeStylist}
                            changeProduct={this.changeProduct}
                            showModalDiscount={this.showModalDiscount}
                            basketLocal={basket}
                            infoUser={infoUser}
                            showModalTipAppointment={this.showModalTipAppointment}
                        />)
                    }


                    {/* ----------- Grand Total ----------- */}
                    <View style={{ paddingHorizontal: scaleSzie(10) }} >
                        <View style={{ height: 2, backgroundColor: "#0764B0", marginTop: scaleSzie(10), marginBottom: scaleSzie(15) }} />
                        {/* ---------- Tip ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: "#0764B0" }]} >
                                {`${localize('Grand Total', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: 'rgb(65,184,85)' }]} >
                                {`$${isOfflineMode ? formatMoney(totalLocal) : formatMoney(temptGrandTotal)}`}
                            </Text>
                        </View>
                    </View>

                    {/* ----------- Paid Amount ----------- */}
                    {
                        !_.isEmpty(paymentDetailInfo) ? <View style={{ paddingHorizontal: scaleSzie(10), marginBottom: scaleSzie(8) }} >
                            <View style={{ height: 2, backgroundColor: "#DDDDDD", marginTop: scaleSzie(10), marginBottom: scaleSzie(15) }} />
                            {/* ---------- Paid amount ------ */}
                            {
                                paymentDetailInfo.paidAmounts ? paymentDetailInfo.paidAmounts.map((paidAmountInfo, index) => <View key={index} style={[styles.payNumberTextContainer, { justifyContent: 'space-between', marginBottom: scaleSzie(8) }]} >
                                    <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: "#404040" }]} >
                                        {`${localize('Paid ', language)}`}
                                        <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "300", color: '#404040' }]} >
                                            {` (${paidAmountInfo.paymentMethod})`}
                                        </Text>
                                    </Text>
                                    <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: '#404040' }]} >
                                        {`  $ ${formatMoney(paidAmountInfo.amount)}`}
                                    </Text>

                                </View>) : <View />
                            }


                            {/* ---------- Due amount ------ */}
                            {
                                paymentDetailInfo.dueAmount ? <View style={[styles.payNumberTextContainer, { justifyContent: 'space-between', }]} >
                                    <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: "#FF3B30" }]} >
                                        {`${localize('Due amount', language)}:`}
                                    </Text>
                                    <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: '#FF3B30' }]} >
                                        {`   $ ${formatMoney(paymentDetailInfo.dueAmount)}`}

                                    </Text>
                                </View> : <View />
                            }

                        </View> : <View />
                    }


                    <View style={{ height: scaleSzie(50) }} />
                </ScrollView>
            </View>
        );
    }

    renderBlocksAppointments() {
        const { infoUser } = this.state;
        const { language, blockAppointments } = this.props;
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;

        const length_blockAppointments = blockAppointments ? blockAppointments.length : 0;
        const isShowAddBlock = length_blockAppointments > 0 && blockAppointments[length_blockAppointments - 1].total != "0.00" ? true : false;

        let temptGrandTotal = 0;
        for (let i = 0; i < blockAppointments.length; i++) {
            temptGrandTotal =  temptGrandTotal + formatNumberFromCurrency(blockAppointments[i].total);
        }

        return (
            <View style={{ flex: 1 }} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    {blockAppointments.map((appointment, index) => <ItemBlockBasket
                        ref={this.addBlockAppointmentRef}
                        key={`${appointment.appointmentId}_${index}`}
                        blockIndex={index}
                        language={language}
                        appointmentDetail={appointment}
                        subTotalLocal={subTotalLocal}
                        tipLocal={tipLocal}
                        discountTotalLocal={discountTotalLocal}
                        taxLocal={taxLocal}
                        removeItemBasket={this.removeItemBasket}
                        changeStylist={this.changeStylist}
                        changeProduct={this.changeProduct}
                        showModalDiscount={this.showModalDiscount}
                        basketLocal={basket}
                        infoUser={infoUser}
                        showModalTipAppointment={this.showModalTipAppointment}
                        toggleCollaps={this.toggleCollaps}
                        removeBlockAppointment={this.removeBlockAppointment}
                        createABlockAppointment={this.createABlockAppointment}
                    />)}
                    {
                        isShowAddBlock ? <Button onPress={this.createABlockAppointment} style={{ marginTop: scaleSzie(14) }} >
                            <Text style={{
                                color: "#0764B0", fontSize: scaleSzie(16), fontWeight: "bold",
                                marginLeft: scaleSzie(10)
                            }} >
                                + Add block
                        </Text>
                        </Button> : <View />
                    }

                    {/* ----------- Grand Total ----------- */}
                    <View style={{ paddingHorizontal: scaleSzie(10) ,marginTop: scaleSzie(15)}} >
                        <View style={{ height: 2, backgroundColor: "#0764B0", marginTop: scaleSzie(10), marginBottom: scaleSzie(15) }} />
                        {/* ---------- Tip ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: "#0764B0" }]} >
                                {`${localize('Grand Total', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { fontSize: scaleSzie(18), fontWeight: "600", color: 'rgb(65,184,85)' }]} >
                                {`$${formatMoney(temptGrandTotal)}`}
                            </Text>
                        </View>
                    </View>


                    <View style={{ height: scaleSzie(70) }} />
                </ScrollView>
            </View>
        );
    }

    renderBasket() {
        const { language, groupAppointment, paymentDetailInfo, blockAppointments } = this.props;

        const checkoutPayments = !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments ? paymentDetailInfo.checkoutPayments : [];
        return (
            <View style={{ flex: 1 }} >
                {/* -------- Header Basket -------- */}
                <View style={[styles.headerBasket, {
                    flexDirection: "row", paddingHorizontal: scaleSzie(8),
                },]} >
                    <View style={{ flex: 1 }} />
                    <Text style={styles.textHeader} >
                        {localize('Basket', language)}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        {
                            !_.isEmpty(groupAppointment) && checkoutPayments.length === 0 ? <Button onPress={this.addAppointmentCheckout} >
                                <Image
                                    source={IMAGE.add_appointment_checkout}
                                    style={{ width: scaleSzie(25), height: scaleSzie(25) }}
                                />
                            </Button> : <View />
                        }


                    </View>
                </View>
                {/* -------- Content Basket -------- */}
                {
                    blockAppointments.length > 0 ? this.renderBlocksAppointments() : this.renderGroupAppointments()
                }
                {/* {this.renderGroupAppointments()} */}
                {/* {this.renderBlocksAppointments()} */}

                {/* -------- Footer Basket -------- */}
                <View style={{ height: scaleSzie(70), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(8) }} >
                    {this.renderButtonChekout()}
                </View>
            </View>
        );
    }


    renderButtonChekout() {
        const { language, isDonePayment, groupAppointment, blockAppointments } = this.props;
        const { tabCurrent, basket, paymentSelected, changeButtonDone, isCancelHarmonyPay
        } = this.state;

        if (tabCurrent === 1) {
            if (changeButtonDone && isCancelHarmonyPay) {
                if (paymentSelected === 'Harmony Pay') {
                    return (
                        <ButtonCustom
                            width={`100%`}
                            backgroundColor="#0764B0"
                            title={localize('CANCEL', language)}
                            textColor="#fff"
                            onPress={this.cancelHarmonyPayment}
                            style={{
                                borderWidth: 1, borderColor: '#C5C5C5',
                                flex: 1
                            }}
                            styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
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
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            flex: 1
                        }}
                        styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
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
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
                />
            } else if (paymentSelected === '') {
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#F1F1F1"
                        title={localize('PAY', language)}
                        textColor="#6A6A6A"
                        onPress={() => { }}
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            flex: 1
                        }}
                        styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
                        activeOpacity={1}
                    />
                );
            }
            return <ButtonCustom
                width={`100%`}
                backgroundColor="#0764B0"
                title={localize('PAY', language)}
                textColor="#fff"
                onPress={this.payBasket}
                style={{
                    borderWidth: 1, borderColor: '#C5C5C5',
                    flex: 1
                }}
                styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
            />

        } else if (tabCurrent === 2) {
            return (
                <ButtonCustom
                    width={`100%`}
                    backgroundColor="#0764B0"
                    title={localize('CONFIRM', language)}
                    textColor="#fff"
                    onPress={this.confimPayOfflinemode}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
                // activeOpacity={1}
                />
            );
        } else {
            if (blockAppointments.length > 0) {
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#0764B0"
                        title={localize('BOOK', language)}
                        textColor="#fff"
                        onPress={this.bookBlockAppointment}
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            flex: 1
                        }}
                        styleText={{ fontSize: scaleSzie(22), fontWeight: 'bold', }}
                    />
                );
            }
            if (basket.length > 0 || !_.isEmpty(groupAppointment)) {
                return (
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#0764B0"
                        title={localize('SELECT PAYMENT', language)}
                        textColor="#fff"
                        onPress={this.selectPayment}
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            flex: 1
                        }}
                        styleText={{ fontSize: scaleSzie(22), fontWeight: 'bold', }}
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
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    styleText={{ fontSize: scaleSzie(22), fontWeight: 'bold', }}
                    activeOpacity={1}
                />
            );
        }
    }

    renderPaymetsMethod() {
        const { language } = this.props;
        return (
            <View style={{
                flex: 1, borderRightWidth: 1, borderRightColor: 'rgb(197, 197, 197)',
                paddingHorizontal: scaleSzie(22)
            }} >
                <Text style={[styles.textHeader, { fontSize: scaleSzie(18), marginTop: scaleSzie(40), marginBottom: scaleSzie(50) }]} >
                    {localize('Select payment method', language)}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    {
                        ['Harmony Pay', 'Cash'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)
                    }
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: scaleSzie(30) }} >
                    {
                        ['Credit Cards', 'Others - Check'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)

                    }
                </View>
                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(8) }} >
                    <ButtonCustom
                        width={scaleSzie(350)}
                        height={60}
                        backgroundColor="#F1F1F1"
                        title={localize('BACK', language)}
                        textColor="#6A6A6A"
                        onPress={this.backAddBasket}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(26) }}
                    />
                </View>

            </View>
        );
    }

    renderOfflineMode() {
        const { language } = this.props;
        const { appointmentOfflineMode } = this.state;

        return (
            <View style={{
                flex: 1, borderRightWidth: 1, borderRightColor: 'rgb(197, 197, 197)',
                paddingHorizontal: scaleSzie(22)
            }} >
                <Text style={[styles.textHeader, { fontSize: scaleSzie(19), marginTop: scaleSzie(10), marginBottom: scaleSzie(12) }]} >
                    {localize('Offline mode', language)}
                </Text>
                <View style={{ alignItems: 'center', marginBottom: scaleSzie(30) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >

                        {localize('Use consumer app to scan QR code below', language)}
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }} >
                    <View style={styles.containerQrcode} >
                        <QRCode
                            value={JSON.stringify(appointmentOfflineMode)}
                            size={scaleSzie(200)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: scaleSzie(25) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >
                        {localize('Then scan the QR code on the phone', language)}

                    </Text>
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >
                        {localize('to complete the transaction', language)}

                    </Text>
                </View>
                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(8) }} >
                    <ButtonCustom
                        width={scaleSzie(350)}
                        height={60}
                        backgroundColor="#F1F1F1"
                        title={localize('BACK', language)}
                        textColor="#6A6A6A"
                        onPress={() => this.scrollTabRef.current.goToPage(1)}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(26) }}
                    />
                </View>
            </View>
        );
    }

    renderBodyCheckout() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ width: scaleSzie(446) }} >
                    <ScrollableTabView
                        ref={this.scrollTabRef}
                        style={{}}
                        initialPage={0}
                        locked={true}
                        renderTabBar={() => <View />}
                        onChangeTab={(index) => {
                            this.setState({ tabCurrent: index.i })
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {this.renderCategoriesCheckout()}
                            {this.renderProductCheckout()}
                            {this.renderAmountCheckout()}
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
        const { language, visiblePopupPaymentDetails, visibleChangeMoney } = this.props;
        const { basket, visibleConfirm, visibleChangeStylist,
            visiblePopupDiscountLocal, visibleScanCode
        } = this.state;
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBodyCheckout()}
                <PopupDiscount
                    ref={this.popupDiscountRef}
                    title={localize('Discount', language)}
                />
                <PopupBlockDiscount
                    title={localize('Discount', language)}
                />
                <PopupDiscountLocal
                    ref={this.popupDiscountLocalRef}
                    visible={visiblePopupDiscountLocal}
                    title={localize('Discount', language)}
                    onRequestClose={this.onRequestClosePopupDiscountLocal}
                    callbackDiscountToParent={(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal) => this.callbackDiscountToParent(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal)}
                />
                <PopupConfirm
                    visible={visibleConfirm}
                    title={localize('Confirmation', language)}
                    message="Are You Sure You Want To Exit Checkout?"
                    onRequestClose={() => { this.setState({ visibleConfirm: false }) }}
                    confimYes={this.clearDataCofrim}
                />
                <PopupChangeMoney
                    ref={this.cashBackRef}
                    title={localize('Confirmation', language)}
                    onRequestClose={() => { this.setState({ visibleChangeMoney: false }) }}
                    confimOK={this.doneBillByCash}
                />
                <PopupChangeStylist
                    ref={this.changeStylistRef}
                    visible={visibleChangeStylist}
                    title={localize('Modification', language)}
                    onRequestClose={() => { this.setState({ visibleChangeStylist: false }) }}
                    changeStylistBasketLocal={this.changeStylistBasketLocal}
                />
                <PopupChangePriceAmountProduct
                    ref={this.changePriceAmountProductRef}
                    visible={this.state.visibleChangePriceAmountProduct}
                    title={localize('Modification', language)}
                    onRequestClose={() => { this.setState({ visibleChangePriceAmountProduct: false }) }}
                    changeProductBasketLocal={this.changeProductBasketLocal}
                />


                <PopupChangeTip
                    ref={this.changeTipRef}
                    visible={this.state.visibleChangeTip}
                    title={localize('Modification', language)}
                    onRequestClose={() => { this.setState({ visibleChangeTip: false }) }}
                // changeStylistBasketLocal={this.changeStylistBasketLocal}
                />

                <PopupPayCompleted
                    visible={this.props.visiblePaymentCompleted}
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
                    title={localize('Bill of payment', language)}
                    visible={this.state.visibleBillOfPayment}
                    onRequestClose={this.onRequestCloseBillModal}
                    language={language}
                    extractBill={this.extractBill}
                    doneBill={this.doneBill}
                />
                <PopupSendLinkInstall
                    ref={this.popupSendLinkInstallRef}
                    visible={this.state.visibleSendLinkPopup}
                    title={localize('Confirmation', language)}
                    onRequestClose={() => this.setState({ visibleSendLinkPopup: false })}
                    confimYes={this.sendLinkInstallApp}
                />
                <PopupActiveGiftCard
                    ref={this.activeGiftCardRef}
                    title={localize('Active Gift Card', language)}
                    onRequestClose={this.closePopupActiveGiftCard}
                    confimYes={this.sendLinkInstallApp}
                    submitSerialCode={this.submitSerialCode}
                />
                <PopupEnterInfo
                    ref={this.customerNameRef}
                    visible={this.state.visibleCustomerName}
                    title={localize('Confirmation', language)}
                    message={localize('Customer Name', language)}
                    onRequestClose={() => this.setState({ visibleCustomerName: false })}
                    confimYes={this.changeCustomerName}
                />
                <PopupEnterCustomerPhone
                    ref={this.CustomerPhoneRef}
                    visible={this.state.visibleCustomerPhone}
                    title={localize('Confirmation', language)}
                    message={localize('Customer Phone', language)}
                    onRequestClose={() => this.setState({ visibleCustomerPhone: false })}
                    confimYes={this.changeCustomerPhone}
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
            </View>
        );
    }

}

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


export default Layout;

