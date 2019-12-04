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
import connectRedux from '@redux/ConnectRedux';

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

        const tipAmount = appointmentDetail && appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
        const discount = appointmentDetail && appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail && appointmentDetail.tax ? appointmentDetail.tax : 0;
        const total = appointmentDetail && appointmentDetail.total ? appointmentDetail.total : 0;

        // console.log(!appointmentDetail || _.isEmpty(appointmentDetail) );
        const temptSubTotal = !appointmentDetail || _.isEmpty(appointmentDetail) ? subTotalLocal : subTotal;
        const temptTotal = !appointmentDetail || _.isEmpty(appointmentDetail) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : total;
        const temptDiscount = !appointmentDetail || _.isEmpty(appointmentDetail) ? discountTotalLocal : discount;
        const temptTip = !appointmentDetail || _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
        const temptTax = !appointmentDetail || _.isEmpty(appointmentDetail) ? taxLocal : tax;

        return {
            temptSubTotal,
            temptTotal,
            temptDiscount,
            temptTip,
            temptTax
        }
    }

    showModalDiscount = () => {
        const { groupAppointment } = this.props;
        const appointmentId = _.isEmpty(groupAppointment) ? -1 : this.props.appointmentDetail.appointmentId;
        this.props.showModalDiscount(appointmentId);
    }

    // ---------- Render --------

    renderHeaderCustomerBaket() {
        const { appointmentDetail, infoUser } = this.props;
        let firstName = '';
        let lastName = '';

        lastName = appointmentDetail ? appointmentDetail.lastName : '';
        firstName = appointmentDetail ? appointmentDetail.firstName : 'Anonymous';
        // const customerId = appointmentDetail ? appointmentDetail.customerId : '1';
        const isMain = appointmentDetail ? appointmentDetail.isMain : 1;
        const appointmentId = appointmentDetail ? appointmentDetail.appointmentId : -1;

        firstName = infoUser.firstName !== '' ? infoUser.firstName : firstName;
        lastName = infoUser.lastName !== '' ? infoUser.lastName : lastName;


        const { isCollapsed } = this.state;
        const iconCollaps = isCollapsed ? IMAGE.open_customer_basket : IMAGE.close_customer_basket;
        const swipeoutBtns = [
            {
                backgroundColor: '#fff',
                component: <Button onPress={() => this.props.actions.appointment.removeAppointmentInGroup(appointmentId)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.removeItemBasket} style={{ width: scaleSzie(24), height: scaleSzie(24) }} />
                </Button>,
            }
        ];
        const temptColor = isMain === 1 ?"#0764B0" : "red";
        return (
            <Swipeout
                right={swipeoutBtns}
                buttonWidth={scaleSzie(45)}
                disabled={isMain === 1 ? true : false}
                close={true}
            >
                <View style={{
                    height: scaleSzie(35), backgroundColor: "#0764B0", paddingLeft: scaleSzie(10),
                    flexDirection: "row", alignItems: "center",
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSzie(16), fontWeight: "bold" }} >
                        {`#${appointmentId} - ${firstName} ${lastName}`}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Button onPress={this.toggleCollaps} >
                            <Image source={iconCollaps}
                                style={{ width: scaleSzie(28), height: scaleSzie(28) }}
                            />
                        </Button>
                    </View>
                    <View style={{width:scaleSzie(5),height: scaleSzie(35),backgroundColor:temptColor,marginLeft:scaleSzie(8)}} />
                </View>
                <View style={{  height: 2, borderBottomColor:"#fff",borderBottomWidth:2}} />
            </Swipeout>
        );
    }



    render() {
        const { isCollapsed } = this.state;
        const { language, appointmentDetail, removeItemBasket, changeStylist, basketLocal } = this.props;
        let basket = [];
        const appointmentId = appointmentDetail && appointmentDetail.appointmentId ? appointmentDetail.appointmentId : -1;
        const { temptSubTotal, temptTotal, temptDiscount, temptTip, temptTax } = this.getTypesOfMoneyAppointmenr(appointmentDetail);
        if (appointmentDetail) {
            const { services, products, extras } = appointmentDetail;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            basket = arrayProducts.concat(arryaServices, arrayExtras);
        } else {
            basket = basketLocal;
        }

        return (
            <View>
                {this.renderHeaderCustomerBaket()}
                <Collapsible collapsed={isCollapsed}>
                    {/* ----------- Item Product , Service , Extra --------- */}
                    {
                        basket.map((item, index) => <ItemBasket
                            key={index}
                            item={item}
                            removeItemBasket={(item) => removeItemBasket(item, appointmentId, true)}
                            onPress={(service) => changeStylist(service, appointmentId)}
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
}


const mapStateToProps = state => ({
    groupAppointment: state.appointment.groupAppointment
});

export default connectRedux(mapStateToProps, ItemCustomerBasket);
