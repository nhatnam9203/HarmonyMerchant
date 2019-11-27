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
    PopupSendLinkInstall
} from '@components';
import styles from './style';
import IMAGE from '@resources';
import {
    ItemCategory, ColPlaceHolder, ItemBasket, ItemProductService, ItemAmount,
    ItemExtra, PopupDiscount, PopupProcessingCredit, PopupBill, PopupDiscountLocal,PopupEnterInfo,
    PopupEnterCustomerPhone,ItemCustomerBasket
} from './widget';

class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        const { firstName, lastName, phoneNumber } = this.state.infoUser;
        const name =`${firstName} ${lastName}`;
        return (
            <View style={styles.headerContainer} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Text onPress={this.displayPopupCustomerName} style={styles.textHeader} >
                        {`${localize('Customer', language)}:`}
                    </Text>
                    {/* {
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
                            marginHorizontal:scaleSzie(14),
                            alignItems:"flex-start",
                            paddingHorizontal:scaleSzie(10)
                        }}
                        styleText={{ fontSize: scaleSzie(12), }}
                    />
                        :  <Text onPress={this.displayPopupCustomerName} style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(30) }]} >
                        {`${firstName} ${lastName}`}
                    </Text>
                    } */}

                   
                    <Text onPress={this.displayPopupCustomerPhone} style={styles.textHeader} >
                        {`${localize('Phone', language)}:`}
                    </Text>
                    {/* {
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
                            marginHorizontal:scaleSzie(14),
                            alignItems:"flex-start",
                            paddingHorizontal:scaleSzie(10)
                        }}
                        styleText={{ fontSize: scaleSzie(12),  }}
                    />
                        :  <Text onPress={this.displayPopupCustomerPhone} style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(12) }]} >
                        {phoneNumber}
                    </Text>
                    } */}

                </View>
                {/* -------- Button open cash -------- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end',flexDirection:'row' }} >
                    {
                        this.state.basket.length > 0 ?    <Button  onPress={() => this.printInvoice(true)} style={[styles.btnCashier,{marginRight:scaleSzie(8)}]} >
                        <Image source={IMAGE.print_btn} 
                        style={{width:scaleSzie(14),height:scaleSzie(16)}}
                        />
                        <Text style={styles.textBtnCashier} >
                       Print receipt
                        </Text>
                    </Button>: <View/>
                    }
                   

                    <Button  onPress={() => this.openCashDrawer(true)} style={styles.btnCashier} >
                        <Image source={IMAGE.cashier_btn} 
                        style={{width:scaleSzie(16),height:scaleSzie(13)}}
                        />
                        <Text style={styles.textBtnCashier} >
                        Open Cashier
                        </Text>
                    </Button>
                   
                </View>
            </View>
        );
    }

    renderCategoriesCheckout() {
        const { language, categoriesByMerchant } = this.props;
        const { isShowColProduct } = this.state;
        const temptWidth = isShowColProduct ? 140 : 190;
        const temptColorHeader = isShowColProduct ? { color: '#6A6A6A' } : {};
        const temptBorderColor = isShowColProduct ? { borderColor: rgb(197, 197, 197) } : {};

        const categoriesFilter = categoriesByMerchant.filter((category, index) => category.isDisabled === 0);
        return (
            <View style={{ width: scaleSzie(temptWidth), flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Header ----- */}
                    <View style={[styles.categoriesHeader, { borderRightWidth: 0 }, temptBorderColor]} >
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
                        </ScrollView>
                    </View>
                </View>
                {/* ------- Line ----- */}
                {
                    isShowColProduct ? <View /> : <ShadowLine
                        style={styles.shadowLineRight}
                    />
                }

            </View>
        );
    }

    renderProductCheckout() {
        const { language } = this.props;
        const { isShowColProduct, isShowColAmount, categorySelected, productSeleted,
            categoryTypeSelected
        } = this.state;
        let temptWidth = isShowColProduct ? 190 : 140;
        temptWidth = isShowColAmount ? 140 : temptWidth;
        const temptBorder = isShowColAmount ? 'rgb(197,197,197)' : '#404040';
        const temptColorHeader = isShowColAmount ? { color: '#6A6A6A' } : {};
        const data = this.getDataColProduct();
        return (
            <View style={{ width: scaleSzie(temptWidth) }} >
                {
                    !isShowColProduct ? <ColPlaceHolder /> : <View style={{ flex: 1, flexDirection: 'row' }} >
                        {/* ------- Line ----- */}
                        {
                            isShowColAmount ? <ShadowLine
                                style={{
                                    shadowOffset: { width: -2, height: 2 }, backgroundColor: 'rgb(197,197,197)',
                                    width: 1
                                }}
                            /> : <ShadowLine
                                    style={styles.shadowLineLeft}
                                />
                        }

                        <View style={{ flex: 1 }} >
                            {/* ----- Header ---- */}
                            <View style={{
                                height: scaleSzie(46),
                                borderBottomColor: temptBorder,
                                borderTopColor: temptBorder,
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
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
                                        />)
                                    }
                                </ScrollView>
                            </View>
                        </View>
                        {/* ------- Line ----- */}
                        {
                            isShowColAmount ? <View /> : <ShadowLine
                                style={styles.shadowLineRight}
                            />
                        }

                    </View>
                }
            </View>

        );
    }

    renderAmountCheckout() {
        const { language } = this.props;
        const { isShowColAmount, categorySelected, categoryTypeSelected, productSeleted } = this.state;
        const temptWidth = isShowColAmount ? 190 : 140;
        const temptHeader = categorySelected.categoryType === 'Service' ? 'Extra' : 'Amount';
        return (
            <View style={{ width: scaleSzie(temptWidth) }} >
                {
                    !isShowColAmount ? <ColPlaceHolder /> : <View style={{ flex: 1, flexDirection: 'row' }} >
                        {/* ------- Line ----- */}
                        <ShadowLine
                            style={styles.shadowLineLeft}
                        />
                        <View style={{ flex: 1 }} >
                            {/* ----- Header ---- */}
                            <View style={{
                                height: scaleSzie(46),
                                borderBottomColor: '#404040',
                                borderTopColor: '#404040',
                                borderBottomWidth: 1,
                                borderTopWidth: 1,
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
                                                productSeleted.extras.map((extra, index) => <ItemExtra
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
                        {/* ------- Line ----- */}
                        <ShadowLine
                            style={styles.shadowLineRight}
                        />
                    </View>
                }
            </View>

        );

    }

    renderBasket() {
        const { language, appointmentDetail, groupAppointment } = this.props;
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
        const grandTotal = groupAppointment.total ?  groupAppointment.total : 0;
        return (
            <View style={{ flex: 1 }} >
                {/* -------- Header Basket -------- */}
                <View style={[styles.headerBasket,{flexDirection:"row",paddingHorizontal:scaleSzie(8),
            },]} >
                    <View style={{flex:1}} />
                    <Text style={styles.textHeader} >
                        {localize('Basket', language)}
                    </Text>
                    <View style={{flex:1,alignItems:"flex-end"}} >
                        <Button onPress={this.addAppointmentCheckout} >
                        <Image 
                        source={IMAGE.add_appointment_checkout} 
                        style={{width:scaleSzie(25),height:scaleSzie(25)}}
                        />
                        </Button>
                        
                    </View>
                </View>
                {/* -------- Content Basket -------- */}
                    <View style={{ flex: 1 }} >
                    <ScrollView showsVerticalScrollIndicator={false} >
                        {
                            appointments.map((appointment,index) => <ItemCustomerBasket 
                                    key={`${appointment.appointmentId}_${index}`}
                                    language={language}
                                    appointmentDetail={appointment}
                                    subTotalLocal={subTotalLocal} 
                                    tipLocal={tipLocal}
                                    discountTotalLocal={discountTotalLocal} 
                                    taxLocal={taxLocal}
                                    removeItemBasket={this.removeItemBasket}
                                    changeStylist={this.changeStylist}
                            >
                            </ItemCustomerBasket>)
                        }
                       
                       
                        {/* ----------- Grand Total ----------- */}
                        <View style={{paddingHorizontal:scaleSzie(10)}} >
                            <View style={{height:2,backgroundColor:"#0764B0",marginTop:scaleSzie(10),marginBottom:scaleSzie(15)}} />
                             {/* ---------- Tip ------ */}
                             <View style={styles.payNumberTextContainer} >
                                <Text style={[styles.textPay,{fontSize:scaleSzie(22),fontWeight:"bold",color:"#0764B0"}]} >
                                    {`${localize('Grand Total:', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { fontSize:scaleSzie(22),fontWeight:"bold",color: 'rgb(65,184,85)' }]} >
                                    {`$${formatMoney(grandTotal)}`}
                                </Text>
                            </View>
                        </View>
                       
                        

                    </ScrollView>
                       
                    </View>
                    
                {/* -------- Footer Basket -------- */}
                <View style={{ height: scaleSzie(70), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(8) }} >
                    {this.renderButtonChekout()}
                </View>
            </View>
        );
    }


    renderButtonChekout() {
        const { tabCurrent, basket, paymentSelected, changeButtonDone
        } = this.state;
        const { language, isDonePayment } = this.props;
        if (tabCurrent === 1) {
            if (changeButtonDone && !isDonePayment) {
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
                    onPress={this.donePayment}
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
                    onPress={() => { }}
                    style={{
                        borderWidth: 1, borderColor: '#C5C5C5',
                        flex: 1
                    }}
                    styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
                    activeOpacity={1}
                />
            );
        } else {
            if (basket.length > 0) {
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
        return (
            <View style={{
                flex: 1, borderRightWidth: 1, borderRightColor: 'rgb(197, 197, 197)',
                paddingHorizontal: scaleSzie(22)
            }} >
                <Text style={[styles.textHeader, { fontSize: scaleSzie(18), marginTop: scaleSzie(40), marginBottom: scaleSzie(50) }]} >
                    Select payment method
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    {
                        ['Harmony Pay', 'Cash'].map((title, index) => <ItemPaymentMethod
                            key={index}
                            title={title}
                            selectedPayment={this.selectedPayment}
                            paymentSelected={this.state.paymentSelected}
                        />)
                        // ['Cash', 'Credit Cards'].map((title, index) => <ItemPaymentMethod
                        //     key={index}
                        //     title={title}
                        //     selectedPayment={this.selectedPayment}
                        //     paymentSelected={this.state.paymentSelected}
                        // />)
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

                        // ['Others - Check'].map((title, index) => <ItemPaymentMethod
                        //     key={index}
                        //     title={title}
                        //     selectedPayment={this.selectedPayment}
                        //     paymentSelected={this.state.paymentSelected}
                        // />)
                    }
                </View>
                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(8) }} >
                    <ButtonCustom
                        width={scaleSzie(350)}
                        height={60}
                        backgroundColor="#F1F1F1"
                        title="BACK"
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
        return (
            <View style={{
                flex: 1, borderRightWidth: 1, borderRightColor: 'rgb(197, 197, 197)',
                paddingHorizontal: scaleSzie(22)
            }} >
                <Text style={[styles.textHeader, { fontSize: scaleSzie(19), marginTop: scaleSzie(10), marginBottom: scaleSzie(12) }]} >
                    Offline mode
                </Text>
                <View style={{ alignItems: 'center', marginBottom: scaleSzie(30) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >
                        Use consumer app to scan QR code below
                </Text>
                </View>
                <View style={{ alignItems: 'center' }} >
                    <View style={styles.containerQrcode} >
                        <QRCode
                            value="{
                                api:https://www.harmonypayment.com
                                total:300
                            }"
                            size={scaleSzie(200)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: scaleSzie(25) }} >
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >
                        Then scan the QR code on the phone
                </Text>
                    <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }]} >
                        to complete the transaction
                </Text>
                </View>
                {/* ------ Footer ----- */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(8) }} >
                    <ButtonCustom
                        width={scaleSzie(350)}
                        height={60}
                        backgroundColor="#F1F1F1"
                        title="BACK"
                        textColor="#6A6A6A"
                        onPress={() =>  this.scrollTabRef.current.goToPage(1)}
                        style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        styleText={{ fontSize: scaleSzie(26) }}
                    />
                </View>
            </View>
        );
    }

    renderBodyCheckout() {
        const { isShowColProduct, isShowColAmount, } = this.state;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ width: scaleSzie(474) }} >
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
                            {isShowColProduct ? <View /> : <View style={{ width: scaleSzie(3) }} />}
                            {this.renderProductCheckout()}
                            {isShowColAmount ? <View /> : isShowColProduct ? <View style={{ width: scaleSzie(2) }} /> : <View />}
                            {this.renderAmountCheckout()}
                            {isShowColAmount ? <View style={{ width: scaleSzie(1) }} /> : <View />}
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
        const { language } = this.props;
        const { basket, visibleConfirm, visibleChangeStylist, visibleChangeMoney,
            visiblePopupDiscountLocal
        } = this.state;
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBodyCheckout()}
                <PopupDiscount
                    ref={this.popupDiscountRef}
                    title={'Discount'}
                    callbackDiscountToParent={(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal) => this.callbackDiscountToParent(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal)}
                />
                <PopupDiscountLocal
                    ref={this.popupDiscountLocalRef}
                    visible={visiblePopupDiscountLocal}
                    title={'Discount'}
                    onRequestClose={this.onRequestClosePopupDiscountLocal}
                    callbackDiscountToParent={(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal) => this.callbackDiscountToParent(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal)}
                />
                <PopupConfirm
                    visible={visibleConfirm}
                    title="Confirmation"
                    message="If you exit Checkout Screen , Basket will Reset ?"
                    onRequestClose={() => { this.setState({ visibleConfirm: false }) }}
                    confimYes={this.clearDataCofrim}
                />
                <PopupChangeMoney
                    ref={this.cashBackRef}
                    visible={visibleChangeMoney}
                    title="Confirmation"
                    // message="If you exit Checkout Screen , Basket will Reset ?"
                    onRequestClose={() => { this.setState({ visibleChangeMoney: false }) }}
                    confimOK={this.doneBillByCash}
                />
                <PopupChangeStylist
                    ref={this.changeStylistRef}
                    visible={visibleChangeStylist}
                    title="Change Stylist"
                    onRequestClose={() => { this.setState({ visibleChangeStylist: false }) }}
                    changeStylistBasketLocal={this.changeStylistBasketLocal}
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
                    title={'Bill of payment'}
                    visible={this.state.visibleBillOfPayment}
                    onRequestClose={this.onRequestCloseBillModal}
                    language={language}
                    extractBill={this.extractBill}
                    doneBill={this.doneBill}
                />
                <PopupSendLinkInstall
                    ref={this.popupSendLinkInstallRef}
                    visible={this.state.visibleSendLinkPopup}
                    title="Confirmation"
                    onRequestClose={() => this.setState({ visibleSendLinkPopup: false })}
                    confimYes={this.sendLinkInstallApp}
                />
                <PopupEnterInfo 
                    ref={this.customerNameRef}
                      visible={this.state.visibleCustomerName}
                      title="Confirmation"
                      message="Customer Name"
                      onRequestClose={() => this.setState({ visibleCustomerName: false })}
                    confimYes={this.changeCustomerName}
                />
                <PopupEnterCustomerPhone 
                    ref={this.CustomerPhoneRef}
                      visible={this.state.visibleCustomerPhone}
                      title="Confirmation"
                      message="Customer Phone"
                      onRequestClose={() => this.setState({ visibleCustomerPhone: false })}
                    confimYes={this.changeCustomerPhone}
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
            width: scaleSzie(200), height: scaleSzie(90), borderWidth: 1, borderColor: '#6A6A6A',
            justifyContent: 'center', alignItems: 'center'
        }, temptBackground]} >
            <Text style={[styles.textHeader, { fontSize: scaleSzie(18) }, temptTextColor]} >
                {title}
            </Text>
        </Button>
    );
}

const ShadowLine = ({ style }) => {
    return (
        <View style={[styles.shadowLine, style]} />
    )
}

export default Layout;

