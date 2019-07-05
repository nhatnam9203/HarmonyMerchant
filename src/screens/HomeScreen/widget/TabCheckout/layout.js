import React from 'react';
import {
    View,
    Image,
    ScrollView,
    FlatList,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, ButtonCustom, Button } from '@components';
import styles from './style';
import IMAGE from '@resources';
import { ItemCategory, ColPlaceHolder,ItemBasket } from './widget';

class Layout extends React.Component {

    renderHeader() {
        const { language } = this.props;
        return (
            <View style={styles.headerContainer} >
                <Text style={styles.textHeader} >
                    {`${localize('Customer', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12), marginRight: scaleSzie(90) }]} >
                    Jerry Nguyen
                </Text>
                <Text style={styles.textHeader} >
                    {`${localize('Phone', language)}:`}
                </Text>
                <Text style={[styles.textHeader, { marginLeft: scaleSzie(12) }]} >
                    0123 456 789
                </Text>
            </View>
        );
    }

    renderCategoriesCheckout() {
        const { language } = this.props;
        return (
            <View style={{ width: scaleSzie(180), flexDirection: 'row' }} >
                <View style={{ flex: 1 }} >
                    {/* ------- Header ----- */}
                    <View style={[styles.categoriesHeader, { borderRightWidth: 0 }]} >
                        <Text style={styles.textHeader} >
                            {localize('Categories', language)}
                        </Text>
                    </View>
                    {/* ------- Body ----- */}
                    <View style={styles.categoriesBody} >
                        <ItemCategory />
                        <ItemCategory />
                        <ItemCategory />
                        <ItemCategory />
                    </View>
                </View>

                {/* ------- Line ----- */}
                {this.renderLineShadow()}
            </View>
        );
    }

    renderLineShadow() {
        return <View style={styles.shadowLine} />;
    }

    renderBasket() {
        const { language } = this.props;
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
                        {/* ------ Item Basket ------- */}
                        <ItemBasket />
                        <ItemBasket />
                    </View>
                    {/* ----------- Payment Number --------- */}
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ flex: 1 }} />

                        <View style={{ flex: 1.3, paddingRight: scaleSzie(12) }} >
                            {/* ---------- Price ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Subtotal', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    $500
                            </Text>
                            </View>
                            {/* ---------- Tax ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Tax', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    $0
                            </Text>
                            </View>
                            {/* ---------- Discount ------ */}
                            <View style={styles.payNumberTextContainer} >
                            <Button onPress={this.showModalDiscount} >
                                <Text style={styles.textPay} >
                                    {`${localize('Discount', language)}:`}
                                   
                                        <Image source={IMAGE.discountBtn}
                                            style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                        />
                                    
                                </Text>
                                </Button>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    $0
                            </Text>
                            </View>
                            {/* ---------- Total ------ */}
                            <View style={styles.payNumberTextContainer} >
                                <Text style={styles.textPay} >
                                    {`${localize('Total', language)}:`}
                                </Text>
                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)',fontSize:scaleSzie(20) }]} >
                                    $500
                            </Text>
                            </View>
                        </View>

                    </View>

                </View>
                {/* -------- Footer Basket -------- */}
                <View style={{ height: scaleSzie(70), paddingHorizontal: scaleSzie(10), paddingBottom: scaleSzie(8) }} >
                    <ButtonCustom
                        width={`100%`}
                        backgroundColor="#F1F1F1"
                        title={localize('PAY', language)}
                        textColor="#6A6A6A"
                        onPress={this.pressPay}
                        style={{
                            borderWidth: 1, borderColor: '#C5C5C5',
                            backgroundColor: '#0764B0',
                            flex: 1
                        }}
                        styleText={{ fontSize: scaleSzie(30), fontWeight: 'bold', color: '#fff' }}
                    />
                </View>

            </View>
        );
    }

    renderBodyCheckout() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {this.renderCategoriesCheckout()}
                <View style={{ width: scaleSzie(5) }} />
                <ColPlaceHolder />
                <ColPlaceHolder />
                {this.renderBasket()}
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderHeader()}
                {this.renderBodyCheckout()}
            </View>
        );
    }

}

export default Layout;

