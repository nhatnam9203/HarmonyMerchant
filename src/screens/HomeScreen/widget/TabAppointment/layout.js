import React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import { WebView } from 'react-native-webview';

import { Text, ButtonCustom, Button, PopupConfirm, PopupPayCompleted } from '@components';
import styles from './style';
import apiConfigs from '@configs/api';
import { scaleSzie, localize } from '@utils';
import {
    ItemCategory, ItemProductService, ColPlaceHolder,ItemAmount,ItemExtra
} from '../TabCheckout/widget';


class Layout extends React.Component {


    renderHeader() {
        const { language } = this.props;
        // const { firstName, lastName, phoneNumber } = this.state.infoUser;
        return (
            <View style={styles.headerContainer} >
                <Text style={styles.textHeader} >
                    {`${localize('Customer', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(90) }]} >
                    {/* {`${firstName} ${lastName}`} */}
                </Text>
                <Text style={styles.textHeader} >
                    {`${localize('Phone', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12) }]} >
                    {/* {phoneNumber} */}
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
                                categoriesByMerchant.map((category, index) => <ItemCategory
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
                            <Button onPress={this.showColAmount} style={{
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
                            </Button>
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
                    <View style={{ flex: 1 }} >

                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { token, profile, profileStaffLogin } = this.props;
        const injectedJavascript = `(function() {
            window.postMessage = function(data) {
              window.ReactNativeWebView.postMessage(data);
            };
          })() ; 
          window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}
          true
          `;
        //   console.log(`----phi : ${apiConfigs.CALENDAR_URL}?token=${profileStaffLogin.token}&merchantid=${profile.merchantId}` )
        return (
            <View style={styles.container} >
                {/* <WebView
                    ref={this.webviewRef}
                    source={{ uri: `${apiConfigs.CALENDAR_URL}?token=${profileStaffLogin.token}&merchantid=${profile.merchantId}` }}
                    startInLoadingState={true}
                    shouldStartLoad={true}
                    onLoadStart={this.onLoadStartWebview}
                    onLoadEnd={this.onLoadEndWebview}
                    injectedJavaScript={injectedJavascript}
                    onMessage={this.onMessageFromWebview}
                    onShouldStartLoadWithRequest={() => true}
                /> */}
                {this.renderModalBookAppointment()}
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

