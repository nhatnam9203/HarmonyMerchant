import React from 'react';
import {
    View,
    ScrollView,
    Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import _ from 'ramda';

import { Text, ButtonCustom, Button, PopupConfirm } from '@components';
import styles from './style';
import apiConfigs from '@configs/api';
import { scaleSzie, localize } from '@utils';
import {
    ItemCategory, ItemProductService, ColPlaceHolder, ItemAmount, ItemExtra
} from '../TabCheckout/widget';
import IMAGE from '@resources';
import { PopupDiscount, PopupChangeStylist, ItemBasket, PopupChangePriceAmountProduct } from './widget';


class Layout extends React.Component {


    renderHeader() {
        const { language } = this.props;
        const { firstName, lastName, phoneNumber } = this.state.infoUser;
        return (
            <View style={styles.headerContainer} >
                <Text style={styles.textHeader} >
                    {`${localize('Customer', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(90) }]} >
                    {`${lastName} ${firstName}`}
                </Text>
                <Text style={styles.textHeader} >
                    {`${localize('Phone', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12) }]} >
                    {phoneNumber}
                </Text>
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
                        <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps="always"
                        >
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
                                <ScrollView 
                                showsVerticalScrollIndicator={false} 
                                keyboardShouldPersistTaps="always"
                                >
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
                                    /> : <ScrollView  keyboardShouldPersistTaps="always" >
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
        const { language, appointmentDetail } = this.props;
        const { basket, total } = this.state;
        const tempTipAmount = appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;

        const discount = appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail.tax ? appointmentDetail.tax : 0;
        return (
            <View style={{ flex: 1 }} >
                {/* -------- Header Basket -------- */}
                <View style={styles.headerBasket} >
                    <Text style={styles.textHeader} >
                        {localize('Basket', language)}
                    </Text>
                </View>
                {/* -------- Content Basket -------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1 }} >
                        {/* ------ Items Basket ------- */}
                        <ScrollView showsVerticalScrollIndicator={false} >
                            {
                                basket.map((item, index) => <ItemBasket
                                    key={index}
                                    item={item}
                                    removeItemBasket={this.removeItemBasket}
                                    onPress={this.changeStylist}
                                    changeProductInBasket={this.changeProductInBasket}
                                />)
                            }
                        </ScrollView>
                    </View>
                    {/* ----------- Payment Number --------- */}
                    <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                        <View style={{ flex: 1 }} />

                        <View style={{ flex: 1.3, paddingRight: scaleSzie(12) }} >
                            {/* ---------- Price ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Subtotal', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${subTotal}`}
                                </Text>
                            </View>
                            {/* ---------- Discount ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Button style={{ flexDirection: "row" }} onPress={this.showModalDiscount} >
                                    <Text style={styles.textPay} >
                                        {`${localize('Discount', language)}:`}

                                    </Text>
                                    <Image source={IMAGE.add_discount_checkout}
                                        style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                    />
                                </Button>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${discount}`}
                                </Text>
                            </View>
                            {/* ---------- Tip ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tip', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${tempTipAmount}`}
                                </Text>
                            </View>
                            {/* ---------- Tax ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tax', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${tax}`}
                                </Text>
                            </View>

                            {/* ---------- Total ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)', fontSize: scaleSzie(20) }]} >
                                    {`$ ${parseFloat(Math.round(total * 100) / 100).toFixed(2)}`}
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
                {/* -------- Footer Basket -------- */}
                <View style={{
                    height: scaleSzie(70), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(8),
                }} >
                    {this.renderButtonBookAppointment()}
                </View>
            </View>
        )
    }

    renderButtonBookAppointment() {
        const { basket } = this.state;
        const { language } = this.props;
        if (basket.length > 0) {
            return (
                <ButtonCustom
                    width={`100%`}
                    backgroundColor="#0764B0"
                    title={localize('BOOK', language)}
                    textColor="#fff"
                    onPress={this.bookAppointment}
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
                title={localize('BOOK', language)}
                textColor="#6A6A6A"
                onPress={() => { }}
                style={{
                    borderWidth: 1, borderColor: '#C5C5C5',
                    flex: 1
                }}
                styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', }}
            />
        );
    }

    renderModalBookAppointment() {
        const { isShowColProduct, isShowColAmount, } = this.state;
        return (
            <View style={styles.containerAddAppoitment} >
                {this.renderHeader()}
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    {/* --------- Product/Service --------- */}
                    <View style={{ width: scaleSzie(474), flexDirection: 'row' }} >
                        {this.renderCategoriesCheckout()}
                        {isShowColProduct ? <View /> : <View style={{ width: scaleSzie(3) }} />}
                        {this.renderProductCheckout()}
                        {isShowColAmount ? <View /> : isShowColProduct ? <View style={{ width: scaleSzie(2) }} /> : <View />}
                        {this.renderAmountCheckout()}
                        {isShowColAmount ? <View style={{ width: scaleSzie(1) }} /> : <View />}
                    </View>
                    {/* --------- Basket--------- */}
                    {this.renderBasket()}
                </View>
            </View>
        );
    }

    render() {
        const { token, profile, profileStaffLogin, language, deviceId } = this.props;
        const { visibleConfirm, visibleChangeStylist } = this.state;
        const injectedJavascript = `(function() {
            window.postMessage = function(data) {
              window.ReactNativeWebView.postMessage(data);
            };
          })() ; 
          window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}
          true
          `;
        const uriWebview = `${apiConfigs.CALENDAR_URL}?token=${profileStaffLogin.token}&merchantid=${profile.merchantId}&staffId=${profileStaffLogin.staffId}&deviceId=${deviceId}`;

        return (
            <View style={styles.container} >
                <WebView
                    ref={this.webviewRef}
                    source={{ uri: uriWebview }}
                    startInLoadingState={true}
                    injectedJavaScript={injectedJavascript}
                    onMessage={this.onMessageFromWebview}
                    cacheEnabled={false}
                    // domStorageEnabled={true}
                    useWebKit={true}
                />
                {this.state.isShowAddAppointment ? this.renderModalBookAppointment() : <View />}
                <PopupConfirm
                    visible={visibleConfirm}
                    title={localize('Confirmation', language)}
                    message={`${localize('Are You Sure You Want To Exit Check-Out? ', language)}`}
                    onRequestClose={() => this.setState({ visibleConfirm: false })}
                    confimYes={this.clearDataCofrim}
                />
                <PopupChangePriceAmountProduct
                    ref={this.changePriceAmountProductRef}
                    visible={this.state.visibleChangePriceAmountProduct}
                    title={localize('Modification', language)}
                    onRequestClose={() => { this.setState({ visibleChangePriceAmountProduct: false }) }}
                    changeProductBasketLocal={this.changeProductBasketLocal}
                />
                <PopupChangeStylist
                    ref={this.changeStylistRef}
                    visible={visibleChangeStylist}
                    title={localize('Change Stylist', language)}
                    onRequestClose={() => { this.setState({ visibleChangeStylist: false }) }}
                />
                <PopupDiscount
                    title={'Discount'}
                    visible={this.state.visibleDiscount}
                    onRequestClose={this.closeModalDiscount}
                />
            </View>
        );
    }

}


const ShadowLine = ({ style }) => {
    return (
        <View style={[styles.shadowLine, style]} />
    )
}

export default Layout;

