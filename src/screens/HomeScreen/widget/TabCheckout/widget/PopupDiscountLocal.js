import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSize, formatNumberFromCurrency, formatMoney ,localize,roundNumber,checkIsTablet} from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupDiscountLocal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            discountTotal: 0,
            totalLocal: 0,
            temptTotalLocal: 0,
            moneyDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,

            customDiscountPercentLocal: 0,
            customDiscountFixedLocal: 0
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
    }

    setStateFromParent = async (totalLocal, discountTotal, customDiscountPercent, customDiscountFixedLocal) => {

        await this.setState({
            totalLocal,
            discountTotal: discountTotal,
            temptTotalLocal: discountTotal,
            customDiscountPercentLocal: customDiscountPercent,
            customDiscountFixedLocal
        });
    }

    submitCustomPromotion() {
        const { groupAppointment } = this.props;
        const customDiscountPercent = this.customDiscountRef.current?.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current?.state.discount;
        if (_.isEmpty(groupAppointment)) {
            const { discountTotal } = this.state;
            this.props.callbackDiscountToParent(customDiscountPercent, customFixedAmount, Number(discountTotal).toFixed(2));
            this.props.onRequestClose();
        }
        this.resetState();
    }

    onRequestClose = async () => {
        this.props.onRequestClose();
        this.resetState();
    }

    resetState() {
        this.setState({
            totalLocal: 0,
            temptTotalLocal: 0,
            customDiscountPercentLocal: 0,
            customDiscountFixedLocal: 0
        });
    }

    onChangeTextCustomDiscount = async (discount) => {
        const { groupAppointment } = this.props;
        const customFixedAmount = this.customFixedAmountRef.current?.state.discount;
        const temptDiscount = formatNumberFromCurrency(discount) + formatNumberFromCurrency(customFixedAmount)

        if (_.isEmpty(groupAppointment)) {
            await this.setState(prevState => ({
                discountTotal: temptDiscount
            }));
        }
    }

    onChangeTextDiscountFixed = async (discountFixed) => {
        const { totalLocal } = this.state;
        const customDiscountPercent = this.customDiscountRef.current?.state.percent;
        const { groupAppointment } = this.props;

        const temptDiscount = formatNumberFromCurrency(discountFixed) + Number((formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(totalLocal) / 100).toFixed(2));

        if (_.isEmpty(groupAppointment)) {
            await this.setState(prevState => ({
                discountTotal: temptDiscount
            }));
        }
    }

    // ------ Render -----

    render() {
        const { title, discount, visible, groupAppointment ,language } = this.props;
        const {totalLocal, discountTotal,customDiscountPercentLocal, customDiscountFixedLocal } = this.state;
        let total = 0;
        const temptTotalDiscount = _.isEmpty(groupAppointment) ? Number(discountTotal).toFixed(2) : Number(total).toFixed(2);
        const temptTotal =totalLocal
        const temptCustomDiscountPercent = customDiscountPercentLocal;
        const temptCustomDiscountFixed =customDiscountFixedLocal;
        const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={this.onRequestClose}
                width={600}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSize(20) }}
            >
                <View style={{
                    height: tempHeight, backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                }} >
                    <View style={{ height: scaleSize(260) }} >
                        <ScrollView  keyboardShouldPersistTaps="always" >
                            <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSize(25) }} >
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
                                    customDiscountPercent={temptCustomDiscountPercent}
                                    total={formatNumberFromCurrency(temptTotal)}
                                    onChangeText={this.onChangeTextCustomDiscount}
                                    language={language}
                                />
                                {/* ----------- Row 2 ----------- */}
                                <CustomDiscountFixed
                                    ref={this.customFixedAmountRef}
                                    customDiscountFixed={temptCustomDiscountFixed}
                                    onChangeText={this.onChangeTextDiscountFixed}
                                    language={language}
                                />
                                <View style={{ height: scaleSize(100) }} />
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                    {/* ---------- Total ------- */}
                    <View style={{
                        flexDirection: 'row', height: scaleSize(60),
                        paddingHorizontal: scaleSize(25)
                    }} >
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ color: '#404040', fontSize: scaleSize(30), fontWeight: 'bold' }} >
                                {localize('Discount', language)}
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center' }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSize(30), fontWeight: 'bold' }} >
                                {`$ -${formatMoney(temptTotalDiscount)}`}
                            </Text>
                        </View>
                    </View>

                    {/* ----------- Button Add ---- */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSize(12) }} >
                        <ButtonCustom
                            width={scaleSize(125)}
                            height={45}
                            backgroundColor="#0764B0"
                            title={localize('Done', language)}
                            textColor="#fff"
                            onPress={() => this.submitCustomPromotion()}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

}

const ItemCampaign = ({ title, discount }) => {

    return (
        <View style={{
            flexDirection: 'row', height: scaleSize(55),
            borderBottomColor: '#707070', borderBottomWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >
                    {title}
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }} >
                <Text style={{ color: '#4CD964', fontSize: scaleSize(20) }} >
                    {`$ -${discount}`}
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
        const discount = roundNumber(formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100);
        this.props.onChangeText(discount);
    }

    render() {
        const { percent } = this.state;
        const { total, onChangeText,language } = this.props;
        const discount = formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100;

        return (
            <View style={{
                flexDirection: 'row', height: scaleSize(55),
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >
                        {localize('Custom Discount by', language)}
                    </Text>
                    {/* ------- Text percent ----- */}
                    <View style={{
                        width: scaleSize(120), height: scaleSize(40),
                        borderColor: '#707070', borderWidth: 1, marginLeft: scaleSize(20), borderRadius: scaleSize(4),
                        flexDirection: 'row'
                    }} >
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(10) }} >
                            <TextInputMask
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: '',
                                    suffixUnit: ''
                                }}
                                style={{ flex: 1, fontSize: scaleSize(16) }}
                                value={`${this.state.percent}`}
                                onChangeText={this.onChangeText}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                                maxLength={6}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', paddingRight: scaleSize(5) }} >
                            <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >
                                %
                            </Text>
                        </View>
                    </View>
                    {/* -------  ----- */}
                </View>
                <View style={{ justifyContent: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSize(20) }} >
                        {`$ ${formatMoney(roundNumber(discount))}`}
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
        const { onChangeText ,language} = this.props;
        return (
            <View style={{
                flexDirection: 'row', height: scaleSize(55), borderBottomColor: '#707070', borderBottomWidth: 1
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSize(20) }} >

                        {localize('Custom Discount by fixed amount', language)}
                </Text>
                </View>
                <View style={{ justifyContent: 'center' }} >
                    {/* ------- Text discount ----- */}
                    <View style={{
                        width: scaleSize(120), height: scaleSize(40),
                        borderColor: '#707070', borderWidth: 1, marginLeft: scaleSize(20), borderRadius: scaleSize(4),
                        flexDirection: 'row',
                    }} >
                         <View style={{ justifyContent: 'center',  paddingLeft: scaleSize(5) }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSize(20) }} >
                                $
                            </Text>
                        </View>
                        <View style={{ flex: 1, paddingHorizontal: scaleSize(5) }} >
                            <TextInputMask
                                type={'money'}
                                options={{
                                    precision: 2,
                                    separator: '.',
                                    delimiter: ',',
                                    unit: '',
                                    suffixUnit: ''
                                }}
                                style={{ flex: 1, fontSize: scaleSize(16) }}
                                value={`${this.state.discount}`}
                                onChangeText={discount => {
                                    this.setState({ discount });
                                    onChangeText(discount);
                                }}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                                // maxLength={3}
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
    visibleModalDiscount: state.marketing.visibleModalDiscount,
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, PopupDiscountLocal);

