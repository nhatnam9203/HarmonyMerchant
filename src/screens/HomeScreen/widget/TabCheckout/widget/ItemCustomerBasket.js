import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, localize, getCategoryName, formatMoney } from '@utils';
import IMAGE from '@resources';
import styles from '../style';

const { width } = Dimensions.get('window');

class ItemCustomerBasket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // ---------- Render --------

    renderHeaderCustomerBaket() {
        return (
            <View style={{
                height: scaleSzie(35), backgroundColor: "#0764B0", paddingHorizontal: scaleSzie(10),
                flexDirection: "row", alignItems: "center"
            }} >
                <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                    #04 - Samatha Colins
                </Text>
                <View style={{ flex: 1, alignItems: "flex-end" }} >
                    <Image source={IMAGE.open_customer_basket}
                        style={{ width: scaleSzie(28), height: scaleSzie(28) }}
                    />
                </View>
            </View>
        );
    }



    render() {
        const { language } = this.props;
        const temptSubTotal = 10;
        const temptTotal = 10;
        const temptDiscount = 10;
        const temptTip = 10;
        const temptTax = 10;
        return (
            <View>
                {this.renderHeaderCustomerBaket()}
                {/* ----------- Item Product , Service , Extra --------- */}
                {this.props.children}
                {/* ----------- Payment Number --------- */}
                <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                    <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                        {/* ---------- Price ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={styles.textPay} >
                                {`${localize('Subtotal', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                {`$${formatMoney(temptSubTotal)}`}
                            </Text>
                        </View>
                        {/* ---------- Tip ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={styles.textPay} >
                                {`${localize('Tip', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                {`$${formatMoney(temptTip)}`}
                            </Text>
                        </View>
                        {/* ---------- Discount ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Button onPress={this.showModalDiscount} >
                                <Text style={styles.textPay} >
                                    {`${localize('Discount', language)}:  `}

                                    <Image source={IMAGE.add_discount_checkout}
                                        style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                    />

                                </Text>
                            </Button>
                            <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                {`$ ${formatMoney(temptDiscount)}`}
                            </Text>
                        </View>
                        {/* ---------- Tax ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={styles.textPay} >
                                {`${localize('Tax', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                {`$ ${formatMoney(temptTax)}`}
                            </Text>
                        </View>
                        {/* ---------- Total ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={[styles.textPay, { fontSize: scaleSzie(20) }]} >
                                {`${localize('Total', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: 'rgb(65,184,85)', fontSize: scaleSzie(20), fontWeight: "bold" }]} >
                                {`$${formatMoney(`${temptTotal}`)}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}


export default ItemCustomerBasket;


