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
import Collapsible from 'react-native-collapsible';
import Swipeout from 'react-native-swipeout';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import {
    scaleSzie, localize, formatNumberFromCurrency, formatMoney, getArrayProductsFromAppointment,
    getArrayServicesFromAppointment, getArrayExtrasFromAppointment
} from '@utils';
import IMAGE from '@resources';
import styles from '../style';
import ItemBasket from './ItemBasket';

const { width } = Dimensions.get('window');

class ItemCustomerBasket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
            isSelectGiftCard: false,
        }
    }


    toggleCollaps = () => {
        this.setState(prevState => ({
            isCollapsed: !prevState.isCollapsed
        }))
    }

    selectCheckbox = () => {
        this.setState(prevState => ({
            isSelectGiftCard: !prevState.isSelectGiftCard
        }))
    }

    getTypesOfMoneyAppointmenr = (appointmentDetail) => {
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.props;

        const tipAmount = appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
        const discount = appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail.tax ? appointmentDetail.tax : 0;
        const total = appointmentDetail.total ? appointmentDetail.total : 0;

        const temptSubTotal = _.isEmpty(appointmentDetail) ? subTotalLocal : subTotal;
        const temptTotal = _.isEmpty(appointmentDetail) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : total;
        const temptDiscount = _.isEmpty(appointmentDetail) ? discountTotalLocal : discount;
        const temptTip = _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
        const temptTax = _.isEmpty(appointmentDetail) ? taxLocal : tax;

        return {
            temptSubTotal,
            temptTotal,
            temptDiscount,
            temptTip,
            temptTax
        }

    }

    // ---------- Render --------

    renderHeaderCustomerBaket() {
        const { lastName, firstName, customerId } = this.props.appointmentDetail;
        const { isCollapsed } = this.state;
        const iconCollaps = isCollapsed ? IMAGE.open_customer_basket : IMAGE.close_customer_basket;
        const swipeoutBtns = [
            {
                backgroundColor: '#fff',
                component: <Button onPress={() => removeItemBasket(item)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.removeItemBasket} style={{ width: scaleSzie(24), height: scaleSzie(24) }} />
                </Button>,
            }
        ];

        return (
            <Swipeout
                right={swipeoutBtns}
                buttonWidth={scaleSzie(45)}
                // disabled={true}
                close={true}
            >
                <View style={{
                    height: scaleSzie(35), backgroundColor: "#0764B0", paddingHorizontal: scaleSzie(10),
                    flexDirection: "row", alignItems: "center"
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                        {`#${customerId} - ${firstName} ${lastName}`}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Button onPress={this.toggleCollaps} >
                            <Image source={iconCollaps}
                                style={{ width: scaleSzie(28), height: scaleSzie(28) }}
                            />
                        </Button>
                    </View>
                </View>
            </Swipeout>
        );
    }



    render() {
        const { isCollapsed } = this.state;
        const { language, appointmentDetail } = this.props;
        const { temptSubTotal, temptTotal, temptDiscount, temptTip, temptTax } = this.getTypesOfMoneyAppointmenr(appointmentDetail);
        const { services, products, extras } = appointmentDetail;
        const arrayProducts = getArrayProductsFromAppointment(products);
        const arryaServices = getArrayServicesFromAppointment(services);
        const arrayExtras = getArrayExtrasFromAppointment(extras);
        const basket = arrayProducts.concat(arryaServices, arrayExtras);
        return (
            <View>
                {this.renderHeaderCustomerBaket()}
                <Collapsible collapsed={isCollapsed}>
                    {/* ----------- Item Product , Service , Extra --------- */}
                    {
                        basket.map((item, index) => <ItemBasket
                            key={index}
                            item={item}
                            removeItemBasket={this.removeItemBasket}
                            onPress={this.changeStylist}
                        />)
                    }
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
                            {/* ---------- Line ------ */}
                            <View style={{
                                height: 2, backgroundColor: "#DDDDDD", marginTop: scaleSzie(2),
                                marginBottom: scaleSzie(6)
                            }} />
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
                </Collapsible>
            </View>
        );
    }


    // async componentDidUpdate(prevProps, prevState, snapshot) {
    //     const { appointmentDetail } = this.props;
    //     if (!_.isEmpty(appointmentDetail)) {
    //         const { services, products, extras } = appointmentDetail;
    //         const arrayProducts = getArrayProductsFromAppointment(products);
    //         const arryaServices = getArrayServicesFromAppointment(services);
    //         const arrayExtras = getArrayExtrasFromAppointment(extras);
    //         const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
    //         console.log("temptBasket : ", JSON.stringify(temptBasket));
    //         this.setState({
    //             basket: temptBasket
    //         })
    //     }

    // }

}


export default ItemCustomerBasket;



{/* ---------- Gift card ------ */ }
{/* <View style={styles.payNumberTextContainer} >
                                <View style={{
                                    flexDirection: "row", alignItems: "center", height: scaleSzie(20),
                                }} >
                                    <Button onPress={this.selectCheckbox} >
                                        <Image source={iconCheckbox} style={{ marginRight: scaleSzie(8) }} />
                                    </Button>
                                    <Text style={[styles.textPay, { fontSize: scaleSzie(15) }]} >
                                        {`${localize('Use gift card', language)}:`}
                                        <Text style={[styles.textPay, { fontSize: scaleSzie(14) }]} >
                                            {`(Value : $ 0)`}
                                        </Text>
                                    </Text>
                                </View>

                                <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                    {`$ ${formatMoney(temptTax)}`}
                                </Text>
                            </View> */}