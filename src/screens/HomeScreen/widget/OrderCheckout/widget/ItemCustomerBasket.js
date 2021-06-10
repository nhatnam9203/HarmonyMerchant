import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import _ from 'ramda';

import { Button } from '@components';
import {
    scaleSize, localize, formatNumberFromCurrency, formatMoney, getArrayProductsFromAppointment,
    getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment
} from '@utils';
import IMAGE from '@resources';
import styles from '../style';
import ItemBasket from './ItemBasket';
import connectRedux from '@redux/ConnectRedux';

const MONEY_COLOR = "#4CD964";

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

    getTypesOfMoneyAppointment = (appointmentDetail) => {
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.props;

        const tipAmount = appointmentDetail?.tipAmount || 0;
        const subTotal = appointmentDetail?.subTotal || 0;
        const discount = appointmentDetail?.discount || 0;
        const tax = appointmentDetail?.tax || 0;
        const total = appointmentDetail?.total || 0;
        const tipPercent = appointmentDetail?.tipPercent || 0;

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
            temptTax,
            tipPercent
        }
    }

    showModalDiscount = () => {
        const { groupAppointment, profileStaffLogin } = this.props;
        const checkoutPayments = this.props?.paymentDetailInfo?.checkoutPayments || [];
        const appointmentId = _.isEmpty(groupAppointment) ? -1 : this.props.appointmentDetail.appointmentId;

        if (profileStaffLogin.roleName !== "Admin") {
            this.props.showModalCheckPermission(appointmentId, false);
        } else {
            if (checkoutPayments.length === 0) {
                this.props.showModalDiscount(appointmentId);
            }
        }
    }

    showModalTipAppointment = (tip, tipPercent) => {
        const { groupAppointment, paymentDetailInfo } = this.props;
        const checkoutPayments = paymentDetailInfo?.checkoutPayments || [];
        if (checkoutPayments.length === 0) {
            const { appointmentDetail } = this.props;
            const appointmentId = _.isEmpty(groupAppointment) ? -1 : appointmentDetail.appointmentId;
            this.props.showModalTipAppointment(appointmentId, tip, appointmentDetail?.subTotal || 0, tipPercent);
        }
    }

    checkIsExistServiceInBasket = (basket) => {
        let isExistService = false;

        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === "Service") {
                isExistService = true;
                break;
            }
        }

        return isExistService;
    }

    // ---------- Render --------

    renderHeaderCustomerBaket() {
        const { appointmentDetail, paymentDetailInfo, isOfflineMode } = this.props;

        const lastName = appointmentDetail?.lastName || '';
        const firstName = appointmentDetail?.firstName || 'Anonymous';
        const isMain = appointmentDetail?.isMain || 0;
        const appointmentId = appointmentDetail?.appointmentId || -1;
        const codeAppointment = appointmentDetail?.code || -1;

        const { isCollapsed } = this.state;
        const iconCollaps = isCollapsed ? IMAGE.open_customer_basket : IMAGE.close_customer_basket;
        const swipeoutBtns = [
            {
                backgroundColor: '#fff',
                component: <Button onPress={() => this.props.actions.appointment.removeAppointmentInGroup(appointmentId)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.removeItemBasket} style={{ width: scaleSize(24), height: scaleSize(24) }} />
                </Button>,
            }
        ];
        const temptColor = isMain === 1 || isOfflineMode ? "#0764B0" : "red";
        const checkoutPayments = paymentDetailInfo?.checkoutPayments || [];
        const disabledRemoveItemCustomerBasket = checkoutPayments.length === 0 ? false : true;

        return (
            <Swipeout
                right={swipeoutBtns}
                buttonWidth={scaleSize(45)}
                disabled={isMain === 1 || isOfflineMode ? true : disabledRemoveItemCustomerBasket}
                close={true}
            >
                <View style={{
                    height: scaleSize(35), backgroundColor: "#0764B0", paddingLeft: scaleSize(10),
                    flexDirection: "row", alignItems: "center",
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }} >
                        {`#${codeAppointment} - ${firstName} ${lastName}`}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Button onPress={this.toggleCollaps} >
                            <Image source={iconCollaps}
                                style={{ width: scaleSize(22), height: scaleSize(22) }}
                            />
                        </Button>
                    </View>
                    <View style={{ width: scaleSize(5), height: scaleSize(35), backgroundColor: temptColor, marginLeft: scaleSize(8) }} />
                </View>
                <View style={{ height: 2, borderBottomColor: "#fff", borderBottomWidth: 2 }} />
            </Swipeout>
        );
    }

    render() {
        const { language, appointmentDetail, removeItemBasket, changeStylist, basketLocal, paymentDetailInfo,
            changeProduct
        } = this.props;
        let basket = [];
        const appointmentId = appointmentDetail?.appointmentId || -1;
        const { temptSubTotal, temptTotal, temptDiscount, temptTip, temptTax, tipPercent } = this.getTypesOfMoneyAppointment(appointmentDetail);
        if (appointmentDetail) {
            const services = appointmentDetail?.services || [];
            const products = appointmentDetail?.products || [];
            const extras = appointmentDetail?.extras || [];
            const giftCards = appointmentDetail?.giftCards || [];

            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);

            for (let i = 0; i < arryaServices.length; i++) {
                for (let j = 0; j < arrayExtras.length; j++) {
                    if (arrayExtras[j]?.data?.bookingServiceId === arryaServices[i]?.data?.bookingServiceId) {
                        arryaServices[i]?.extras.push({ ...arrayExtras[j] });
                    }
                }
            }

            basket = arryaServices.concat(arrayProducts, arrayGiftCards);

        } else {
            basket = basketLocal;
        }
        const isExistService = this.checkIsExistServiceInBasket(basket);
        const checkoutPayments = paymentDetailInfo?.checkoutPayments || [];
        return (
            <View>
                {/* ----------- Item Product , Service , Extra --------- */}
                {
                    basket.map((item, index) => <ItemBasket
                        disabled={checkoutPayments.length === 0 ? false : true}
                        key={index}
                        item={item}
                        removeItemBasket={(item) => removeItemBasket(item, appointmentId, true)}
                        onPress={(service) => changeStylist(service, appointmentId)}
                        changeProduct={product => changeProduct(product, appointmentId)}
                        removeExtra={(extra) => removeItemBasket(extra, appointmentId, true)}
                    />)
                }
                {/* ----------- Payment Number --------- */}
                <View style={{ flexDirection: 'row', marginTop: scaleSize(10) }} >
                    <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }} >
                        {/* ---------- Price ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={styles.textPay} >
                                {`${localize('Subtotal', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                {`$ ${formatMoney(temptSubTotal)}`}
                            </Text>
                        </View>
                        {/* ---------- Discount ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Button style={{ flexDirection: "row" }} onPress={this.showModalDiscount} >
                                <Text style={styles.textPay} >
                                    {`${localize('Discount', language)}:  `}
                                </Text>
                                {
                                    checkoutPayments.length === 0 ?
                                        <Image source={IMAGE.add_discount_checkout}
                                            style={{ width: scaleSize(20), height: scaleSize(20) }}
                                        /> : null
                                }
                            </Button>
                            <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                {`$ ${formatMoney(temptDiscount)}`}
                            </Text>
                        </View>


                        {/* ---------- Tax ------ */}
                        <View style={styles.payNumberTextContainer} >
                            <Text style={styles.textPay} >
                                {`${localize('Tax', language)}:`}
                            </Text>
                            <Text style={[styles.textPay, { color: MONEY_COLOR }]} >
                                {`$ ${formatMoney(temptTax)}`}
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
                                {`$ ${formatMoney(`${temptTotal}`)}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}


const mapStateToProps = state => ({
    groupAppointment: state.appointment.groupAppointment,
    paymentDetailInfo: state.appointment.paymentDetailInfo,
    profileStaffLogin: state.dataLocal.profileStaffLogin
});

export default connectRedux(mapStateToProps, ItemCustomerBasket);
