import React from 'react';
import {
    View,
    Text,
    Image,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Swipeout from 'react-native-swipeout';
import _ from 'ramda';

import { Button } from '@components';
import {
    scaleSzie, localize, formatNumberFromCurrency, formatMoney, getArrayProductsFromAppointment,
    getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment
} from '@utils';
import IMAGE from '@resources';
import styles from '../style';
import ItemBasket from './ItemBasket';
import connectRedux from '@redux/ConnectRedux';

class ItemBlockBasket extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
            isSelectGiftCard: false,
        }
    }

    componentDidMount(){
        this._isMounted = true;
    }

    setStateFromParent = async (isCollapsed) => {
        // console.log("-------- setStateFromParent :  ");
        if (this._isMounted) {
            await  this.setState({
                isCollapsed
            });
        }
    }


    toggleCollaps = () => {
        const { appointmentDetail } = this.props;
        const { isCollapsed } = this.state;

        const appointmentId = appointmentDetail && appointmentDetail.appointmentId ? appointmentDetail.appointmentId : -1;
        // if ((this.getBasket()).length > 0) {
        //     this.setState(prevState => ({
        //         isCollapsed: !prevState.isCollapsed
        //     }));
        // }
        this.props.toggleCollaps(appointmentId);


    }

    selectCheckbox = () => {
        this.setState(prevState => ({
            isSelectGiftCard: !prevState.isSelectGiftCard
        }))
    }

    getTypesOfMoneyAppointment = (appointmentDetail) => {
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.props;

        const tipAmount = appointmentDetail && appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
        const discount = appointmentDetail && appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail && appointmentDetail.tax ? appointmentDetail.tax : 0;
        const total = appointmentDetail && appointmentDetail.total ? appointmentDetail.total : 0;

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
        const { appointmentDetail } = this.props;
        this.props.actions.marketing.getPromotionByAppointment(appointmentDetail.appointmentId, true);
    }

    showModalTipAppointment = (tip) => {
        const { groupAppointment, paymentDetailInfo } = this.props;
        const checkoutPayments = !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments ? paymentDetailInfo.checkoutPayments : [];
        if (checkoutPayments.length === 0) {
            const appointmentId = _.isEmpty(groupAppointment) ? -1 : this.props.appointmentDetail.appointmentId;
            this.props.showModalTipAppointment(appointmentId, tip);
        }
    }


    getBasket = () => {
        const { appointmentDetail } = this.props;
        let basket = [];
        if (appointmentDetail) {
            const { services, products, extras, giftCards } = appointmentDetail;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);
            basket = arrayProducts.concat(arryaServices, arrayExtras, arrayGiftCards);
        }

        return basket
    }

    removeAppointment = (appointmentId) => {
        this.props.removeBlockAppointment(appointmentId);
    }

    // ---------- Render --------

    renderHeaderCustomerBaket() {
        const { appointmentDetail, infoUser, paymentDetailInfo, isOfflineMode, blockIndex } = this.props;
        let firstName = '';
        let lastName = '';

        lastName = appointmentDetail ? appointmentDetail.lastName : '';
        firstName = appointmentDetail ? appointmentDetail.firstName : 'Anonymous';
        const isMain = appointmentDetail && appointmentDetail.isMain ? appointmentDetail.isMain : 0;
        const appointmentId = appointmentDetail ? appointmentDetail.appointmentId : -1;
        const codeAppointment = appointmentDetail ? appointmentDetail.code : -1;

        if (isMain === 1) {
            firstName = infoUser.firstName !== '' ? infoUser.firstName : firstName;
            lastName = infoUser.lastName !== '' ? infoUser.lastName : lastName;
        }



        const { isCollapsed } = this.state;
        const iconCollaps =this.state.isCollapsed ? IMAGE.open_customer_basket : IMAGE.close_customer_basket;
        const swipeoutBtns = [
            {
                backgroundColor: '#fff',
                component: <Button onPress={this.removeAppointment.bind(this, appointmentId)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <Image source={IMAGE.removeItemBasket} style={{ width: scaleSzie(24), height: scaleSzie(24) }} />
                </Button>,
            }
        ];
        const temptColor = blockIndex === 0 ? "transparent" : "red";
        const checkoutPayments = !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments ? paymentDetailInfo.checkoutPayments : [];
        const disabledRemoveItemCustomerBasket = checkoutPayments.length === 0 ? false : true;

        // ---- New -----
        const temptBackground = !this.state.isCollapsed ? { backgroundColor: "#0764B0" } : { backgroundColor: "#E5E5E5" };
        const temptTextColor = !this.state.isCollapsed ? { color: "#fff" } : { color: "#404040" };

        return (
            <Swipeout
                right={swipeoutBtns}
                buttonWidth={scaleSzie(45)}
                // disabled={isMain === 1 || isOfflineMode ? true : disabledRemoveItemCustomerBasket}
                disabled={blockIndex === 0 ? true : false}
                close={true}
            >
                <View style={[{
                    height: scaleSzie(35), paddingLeft: scaleSzie(10),
                    flexDirection: "row", alignItems: "center",
                }, temptBackground]} >
                    <Text style={[{ fontSize: scaleSzie(16), fontWeight: "bold" }, temptTextColor]} >
                        {`Block ${blockIndex + 1}`}
                    </Text>
                    <View style={{ flex: 1, alignItems: "flex-end" }} >
                        <Button onPress={this.toggleCollaps} >
                            <Image source={iconCollaps}
                                style={{ width: scaleSzie(28), height: scaleSzie(28) }}
                            />
                        </Button>
                    </View>
                    <View style={{ width: scaleSzie(5), height: scaleSzie(35), backgroundColor: temptColor, marginLeft: scaleSzie(8) }} />
                </View>
                <View style={{ height: 2, borderBottomColor: "#fff", borderBottomWidth: 2 }} />
            </Swipeout>
        );
    }



    render() {
        const { language, appointmentDetail, removeItemBasket, paymentDetailInfo,
            changeProduct, blockIndex, blockAppointments, createABlockAppointment
        } = this.props;
        const { isCollapsed } = this.state;

        const appointmentId = appointmentDetail && appointmentDetail.appointmentId ? appointmentDetail.appointmentId : -1;
        const { temptSubTotal, temptTotal, temptDiscount, temptTip, temptTax } = this.getTypesOfMoneyAppointment(appointmentDetail);
        const checkoutPayments = !_.isEmpty(paymentDetailInfo) && paymentDetailInfo.checkoutPayments ? paymentDetailInfo.checkoutPayments : [];

        return (
            <View>
                {this.renderHeaderCustomerBaket()}
                <Collapsible collapsed={this.state.isCollapsed}>
                    {/* ----------- Item Product , Service , Extra --------- */}
                    {
                        this.getBasket().map((item, index) => <ItemBasket
                            disabled={checkoutPayments.length === 0 ? false : true}
                            key={index}
                            item={item}
                            removeItemBasket={(item) => removeItemBasket(item, appointmentId, true)}
                            // onPress={(service) => changeStylist(service, appointmentId)}
                            onPress={(service) => { }}
                            changeProduct={product => {}}
                        />)
                    }
                    {/* ----------- Payment Number --------- */}
                    {
                        this.getBasket().length > 0 ?
                            <View style={{ flexDirection: 'row', marginTop: scaleSzie(10) }} >
                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                                    {/* ---------- Price ------ */}
                                    <View style={styles.payNumberTextContainer} >
                                        <Text style={styles.textPay} >
                                            {`${localize('Subtotal', language)}:`}
                                        </Text>
                                        <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
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
                                                        style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                                    /> : null
                                            }
                                        </Button>
                                        <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                            {`$ ${formatMoney(temptDiscount)}`}
                                        </Text>
                                    </View>

                                    {/* ---------- Tip ------ */}
                                    <View style={styles.payNumberTextContainer} >
                                        <View style={{ flexDirection: "row" }}
                                        // onPress={this.showModalTipAppointment.bind(this, temptTip)}
                                        >
                                            <Text style={styles.textPay} >
                                                {`${localize('Tip', language)}:  `}
                                            </Text>
                                            {/* {
                                        isExistService ?
                                            <Image source={IMAGE.add_discount_checkout}
                                                style={{ width: scaleSzie(20), height: scaleSzie(20) }}
                                            /> : null
                                    } */}
                                        </View>
                                        <Text style={[styles.textPay, { color: 'rgb(65,184,85)' }]} >
                                            {`$ ${formatMoney(temptTip)}`}
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
                                        <Text style={[styles.textPay, { fontSize: scaleSzie(18) }]} >
                                            {`${localize('Total', language)}:`}
                                        </Text>
                                        <Text style={[styles.textPay, { color: 'rgb(65,184,85)', fontSize: scaleSzie(18), fontWeight: "600" }]} >
                                            {`$ ${formatMoney(`${temptTotal}`)}`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View />
                    }

                </Collapsible>
            </View>
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
      }

}


const mapStateToProps = state => ({
    groupAppointment: state.appointment.groupAppointment,
    paymentDetailInfo: state.appointment.paymentDetailInfo,
    blockAppointments: state.appointment.blockAppointments
});

export default connectRedux(mapStateToProps, ItemBlockBasket);
