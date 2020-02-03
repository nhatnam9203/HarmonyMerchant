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
import { scaleSzie, formatNumberFromCurrency, formatMoney,localize } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class PopupDiscount extends React.Component {

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


    submitCustomPromotion() {
        const { appointmentDetail } = this.props;
        const customDiscountPercent = this.customDiscountRef.current.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current.state.discount;
        if (!_.isEmpty(appointmentDetail)) {
            const { appointmentDetail } = this.props;
            this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, appointmentDetail.appointmentId);
            this.props.actions.marketing.closeModalDiscount();
        }
        this.resetState();
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
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
        const { appointmentDetail } = this.props;
        const customFixedAmount = this.customFixedAmountRef.current.state.discount;


        const temptDiscount = formatNumberFromCurrency(discount) + formatNumberFromCurrency(customFixedAmount)
        //console.log('discountTotal : ', temptDiscount);

        if (!_.isEmpty(appointmentDetail)) {
            await this.setState({
                moneyDiscountCustom: discount,
                moneyDiscountFixedAmout: this.customFixedAmountRef.current.state.discount
            });
        }
    }

    onChangeTextDiscountFixed = async (discountFixed) => {
        const { appointmentDetail } = this.props;

        if (!_.isEmpty(appointmentDetail)) {
            const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
            await this.setState({
                moneyDiscountFixedAmout: discountFixed,
                moneyDiscountCustom: (formatNumberFromCurrency(this.customDiscountRef.current.state.percent) * formatNumberFromCurrency(subTotal) / 100)
            })
        }

    }

    // ------ Render -----

    render() {
        //console.log('------ Render 11111 -----');
        try {
            const { title, discount, visibleModalDiscount,
                appointmentDetail,language
            } = this.props;
            const { customDiscountPercent, customDiscountFixed } = appointmentDetail;
            const {
                moneyDiscountCustom, moneyDiscountFixedAmout, totalLocal, discountTotal,
                customDiscountPercentLocal, customDiscountFixedLocal
            } = this.state;
            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }
            if (visibleModalDiscount && !this.customDiscountRef.current) {
                const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
                //console.log('----- subTotal : ',subTotal);
                total = formatNumberFromCurrency(total) + (formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(subTotal) / 100);
            }
            if (visibleModalDiscount && !this.customFixedAmountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(customDiscountFixed);
                //console.log('----- !customFixedAmountRef : ',total);
            }
            if (visibleModalDiscount && this.customDiscountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);
                //console.log('----- customDiscountRef : ',total);
            }
            if (visibleModalDiscount && this.customFixedAmountRef.current) {
                //console.log('---- : ', this.customFixedAmountRef.current.state.discount);
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);
                //console.log('----- customFixedAmountRef : ',total);
            }
    
            total = Number(total).toFixed(2);
            //console.log('----- total : ',total);
    
            const temptTotalDiscount = _.isEmpty(appointmentDetail) ? Number(discountTotal).toFixed(2) : Number(total).toFixed(2);
            const temptTotal = _.isEmpty(appointmentDetail) ? totalLocal : (!_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0);
            const temptCustomDiscountPercent = _.isEmpty(appointmentDetail) ? customDiscountPercentLocal : customDiscountPercent;
            const temptCustomDiscountFixed = _.isEmpty(appointmentDetail) ? customDiscountFixedLocal : customDiscountFixed;
    
    
            const visible = visibleModalDiscount && !_.isEmpty(appointmentDetail) ? true : false;
    
            return (
                <PopupParent
                    title={title}
                    visible={visible}
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
                                    {`- ${formatMoney(temptTotalDiscount)}$`}
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
                                onPress={() => this.submitCustomPromotion()}
                                style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            />
                        </View>
                    </View>
                </PopupParent>
            );
            
        } catch (error) {
            //console.log('-------- error : ',error);
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
                    {`-${discount}$`}
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
        const discount = Number(formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100).toFixed(2);
        this.props.onChangeText(discount);
    }

    render() {
        const { percent } = this.state;
        const { total, onChangeText ,language} = this.props;
        const discount = Number(formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100).toFixed(2);

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
                        {`${formatMoney(discount)}$`}
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
        const { onChangeText,language} = this.props;
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
                        <View style={{ justifyContent: 'center', paddingRight: scaleSzie(5) }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                                $
                            </Text>
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
    language: state.dataLocal.language,

})



export default connectRedux(mapStateToProps, PopupDiscount);

