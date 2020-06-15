import React from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie, formatNumberFromCurrency, formatMoney, localize,roundNumber } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupBlockDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            moneyDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
    }


    submitCustomPromotion = () => {
        const {  appointmentIdUpdatePromotion } = this.props;
        const customDiscountPercent = this.customDiscountRef.current.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current.state.discount;

        this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, appointmentIdUpdatePromotion, true,true);
        this.props.actions.marketing.closeModalDiscount();
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
    }

    onChangeTextCustomDiscount = async (discount) => {
        await this.setState({
            moneyDiscountCustom: discount,
            moneyDiscountFixedAmout: this.customFixedAmountRef.current.state.discount
        });
    }

    onChangeTextDiscountFixed = async (discountFixed) => {
        const { appointmentIdUpdatePromotion, blockAppointments } = this.props;

        const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
        const subTotal = appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;

        await this.setState({
            moneyDiscountFixedAmout: discountFixed,
            moneyDiscountCustom: (formatNumberFromCurrency(this.customDiscountRef.current.state.percent) * formatNumberFromCurrency(subTotal) / 100)
        })
    }

    // ------ Render -----

    render() {
        try {
            const { title, discount, visibleModalBlockDiscount, language, appointmentIdUpdatePromotion,blockAppointments} = this.props;
            const {moneyDiscountCustom,moneyDiscountFixedAmout} = this.state;

            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }
         
            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            const customDiscountPercent = appointmentDetail && appointmentDetail.customDiscountPercent ? appointmentDetail.customDiscountPercent : 0;
            const customDiscountFixed = appointmentDetail && appointmentDetail.customDiscountFixed ? appointmentDetail.customDiscountFixed : 0;

            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);
            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);


            total = Number(total).toFixed(2);

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
                                    <CustomDiscount
                                        ref={this.customDiscountRef}
                                        customDiscountPercent={customDiscountPercent}
                                        total={formatNumberFromCurrency(appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0)}
                                        onChangeText={this.onChangeTextCustomDiscount}
                                        language={language}
                                    />
                                    {/* ----------- Row 2 ----------- */}
                                    <CustomDiscountFixed
                                        ref={this.customFixedAmountRef}
                                        customDiscountFixed={customDiscountFixed}
                                        onChangeText={this.onChangeTextDiscountFixed}
                                        language={language}
                                    />
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

class CustomDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: this.props.customDiscountPercent ? this.props.customDiscountPercent : 0,
        }
    }

    onChangeText = async (percent) => {
        await this.setState({ percent });
        const { total } = this.props;
        const discount =roundNumber(formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100);
        this.props.onChangeText(discount);
    }

    render() {
        const { percent } = this.state;
        const { total, onChangeText, language } = this.props;
        const discount = formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100;

        return (
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
                                value={`${this.state.percent}`}
                                onChangeText={this.onChangeText}
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
                        {`$${formatMoney(roundNumber(discount))}`}
                    </Text>
                </View>
            </View>
        );
    }

}

class CustomDiscountFixed extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            discount: this.props.customDiscountFixed
        }
    }

    render() {
        const { onChangeText, language } = this.props;
        return (
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
                                value={`${this.state.discount}`}
                                onChangeText={discount => {
                                    this.setState({ discount });
                                    onChangeText(discount);
                                }}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                                maxLength={3}
                            />
                        </View>

                    </View>
                    {/* -------  ----- */}
                </View>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    discount: state.marketing.discount,
    visibleModalBlockDiscount: state.marketing.visibleModalBlockDiscount,
    // appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
    language: state.dataLocal.language,
    blockAppointments: state.appointment.blockAppointments
})



export default connectRedux(mapStateToProps, PopupBlockDiscount);

