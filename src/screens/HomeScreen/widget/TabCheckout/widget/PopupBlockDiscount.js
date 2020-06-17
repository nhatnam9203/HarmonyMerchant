import React from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie, formatNumberFromCurrency, formatMoney, localize, roundNumber } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupBlockDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percentDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,
            isReload: false
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
    }


    submitCustomPromotion = async () => {
        const { appointmentIdUpdatePromotion, discount, blockAppointments } = this.props;
        const { percentDiscountCustom, moneyDiscountFixedAmout } = this.state;

        const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
        const subTotal = appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;

        // ---------- Check total ---------
        let totalDiscount = 0;
        for (let i = 0; i < discount.length; i++) {
            totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(discount[i].discount);
        };

        const moneyDiscountCustom = (formatNumberFromCurrency(percentDiscountCustom) * formatNumberFromCurrency(subTotal) / 100);

        totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(moneyDiscountFixedAmout);
        totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(moneyDiscountCustom);

        if (formatNumberFromCurrency(totalDiscount) > formatNumberFromCurrency(subTotal)) {
            Alert.alert(
                `Warning`,
                `Discount not bigger than appointment's subtotal.`,
                [

                    { text: 'OK', onPress: () => { } }
                ],
                { cancelable: false }
            );
        } else {
            this.props.actions.marketing.customPromotion(percentDiscountCustom, moneyDiscountFixedAmout, appointmentIdUpdatePromotion, true, true);
            this.props.actions.marketing.closeModalDiscount();
        }
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
    }



    // ------ Render -----

    render() {
        try {
            const { title, discount, visibleModalBlockDiscount, language, appointmentIdUpdatePromotion, blockAppointments } = this.props;
            const { moneyDiscountFixedAmout, percentDiscountCustom } = this.state;

            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }

            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            const subTotal = appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
            const moneyDiscountCustom = (formatNumberFromCurrency(percentDiscountCustom) * formatNumberFromCurrency(subTotal) / 100);

            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);
            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);


            total = roundNumber(total);

            return (
                <PopupParent
                    title={title}
                    visible={visibleModalBlockDiscount}
                    onRequestClose={this.onRequestClose}
                    width={600}
                    style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
                >
                    <View style={{
                        height: scaleSzie(380), backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    }} >
                        <View style={{ height: scaleSzie(260) }} >
                            <ScrollView >
                                <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSzie(25) }} >
                                    {
                                        discount.map((promo, index) => <ItemCampaign
                                            key={index}
                                            title={promo.merchantPromotion.campaignName}
                                            discount={promo.discount}
                                        />
                                        )
                                    }
                                    {/* ----------- Row 1 ----------- */}
                                    <View style={{
                                        flexDirection: 'row', height: scaleSzie(55),
                                    }} >
                                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                                {localize('Custom Discount by', language)}
                                            </Text>
                                            {/* ------- Text percent ----- */}
                                            <View style={{
                                                width: scaleSzie(120), height: scaleSzie(40),
                                                borderColor: '#707070', borderWidth: 1, marginLeft: scaleSzie(20), borderRadius: scaleSzie(4),
                                                flexDirection: 'row', marginLeft: scaleSzie(20)
                                            }} >
                                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(10) }} >
                                                    <TextInputMask
                                                        type={'money'}
                                                        options={{
                                                            precision: 2,
                                                            separator: '.',
                                                            delimiter: ',',
                                                            unit: '',
                                                            suffixUnit: ''
                                                        }}
                                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                        value={`${percentDiscountCustom}`}
                                                        onChangeText={(percentDiscountCustom) => this.setState({ percentDiscountCustom })}
                                                        keyboardType="numeric"
                                                        placeholderTextColor="#A9A9A9"
                                                        maxLength={6}

                                                    />
                                                </View>
                                                <View style={{ justifyContent: 'center', paddingRight: scaleSzie(5) }} >
                                                    <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                                        %
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* -------  ----- */}
                                        </View>
                                        <View style={{ justifyContent: 'center' }} >
                                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                                                {`$${formatMoney(roundNumber(moneyDiscountCustom))}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ----------- Row 2 ----------- */}
                                    <View style={{
                                        flexDirection: 'row', height: scaleSzie(55), borderBottomColor: '#707070', borderBottomWidth: 1
                                    }} >
                                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                                {localize('Custom Discount by fixed amount', language)}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: 'center' }} >
                                            {/* ------- Text discount ----- */}
                                            <View style={{
                                                width: scaleSzie(120), height: scaleSzie(40),
                                                borderColor: '#707070', borderWidth: 1, marginLeft: scaleSzie(20), borderRadius: scaleSzie(4),
                                                flexDirection: 'row',
                                            }} >
                                                <View style={{ justifyContent: 'center', paddingLeft: scaleSzie(5) }} >
                                                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                                                        $
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1, paddingHorizontal: scaleSzie(5) }} >
                                                    <TextInputMask
                                                        type={'money'}
                                                        options={{
                                                            precision: 2,
                                                            separator: '.',
                                                            delimiter: ',',
                                                            unit: '',
                                                            suffixUnit: ''
                                                        }}
                                                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                                                        value={`${moneyDiscountFixedAmout}`}
                                                        onChangeText={moneyDiscountFixedAmout => { this.setState({ moneyDiscountFixedAmout }); }}
                                                        keyboardType="numeric"
                                                        placeholderTextColor="#A9A9A9"
                                                        maxLength={3}
                                                    />
                                                </View>

                                            </View>
                                            {/* -------  ----- */}
                                        </View>
                                    </View>

                                    <View style={{ height: scaleSzie(100) }} />
                                </TouchableOpacity>
                            </ScrollView>

                        </View>
                        {/* ---------- Total ------- */}
                        <View style={{
                            flexDirection: 'row', height: scaleSzie(60),
                            paddingHorizontal: scaleSzie(25)
                        }} >
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(30), fontWeight: 'bold' }} >
                                    {localize('Total Discount', language)}
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }} >
                                <Text style={{ color: '#4CD964', fontSize: scaleSzie(30), fontWeight: 'bold' }} >
                                    {`$ -${formatMoney(total)}`}
                                </Text>
                            </View>
                        </View>

                        {/* ----------- Button Add ---- */}
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(12) }} >
                            <ButtonCustom
                                width={scaleSzie(125)}
                                height={45}
                                backgroundColor="#0764B0"
                                title={localize('Done', language)}
                                textColor="#fff"
                                onPress={this.submitCustomPromotion}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            />
                        </View>
                    </View>
                </PopupParent>
            );
        } catch (error) {
            //console.log('Popup Discount Checkout : ',error);
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { visibleModalBlockDiscount, isOpenBlockAppointmentId, blockAppointments, appointmentIdUpdatePromotion } = this.props;
        if (!prevProps.visibleModalBlockDiscount && visibleModalBlockDiscount && prevProps.visibleModalBlockDiscount !== visibleModalBlockDiscount) {
            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            await this.setState({
                percentDiscountCustom: appointmentDetail && appointmentDetail.customDiscountPercent ? appointmentDetail.customDiscountPercent : 0,
                moneyDiscountFixedAmout: appointmentDetail && appointmentDetail.customDiscountFixed ? appointmentDetail.customDiscountFixed : 0,
            })
        }
    }

}

const ItemCampaign = ({ title, discount }) => {
    return (
        <View style={{
            flexDirection: 'row', height: scaleSzie(55),
            borderBottomColor: '#707070', borderBottomWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                    {title}
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }} >
                <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                    {`$${discount}`}
                </Text>
            </View>
        </View>
    );
}

const mapStateToProps = state => ({
    discount: state.marketing.discount,
    visibleModalBlockDiscount: state.marketing.visibleModalBlockDiscount,
    groupAppointment: state.appointment.groupAppointment,
    appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
    language: state.dataLocal.language,
    blockAppointments: state.appointment.blockAppointments,
    isOpenBlockAppointmentId: state.appointment.isOpenBlockAppointmentId
})



export default connectRedux(mapStateToProps, PopupBlockDiscount);

