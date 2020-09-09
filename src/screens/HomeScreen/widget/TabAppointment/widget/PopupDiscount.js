import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Image
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent,Button } from '@components';
import { scaleSzie, formatNumberFromCurrency, formatMoney, localize, roundNumber } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";

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
            customDiscountFixedLocal: 0,
            promotionNotes: "",
            isDiscountByOwner: true
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
        this.scrollRef = React.createRef();
    }


    submitCustomPromotion() {
        const { appointmentDetail, discount } = this.props;
        const customDiscountPercent = this.customDiscountRef.current.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current.state.discount;
        if (!_.isEmpty(appointmentDetail)) {
            const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
            let totalDiscount = 0;
            for (let i = 0; i < discount.length; i++) {
                totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(discount[i].discount);
            };
            totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(customFixedAmount);
            const moneyDiscountCustom = (formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(subTotal) / 100);
            totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(moneyDiscountCustom);

            if (formatNumberFromCurrency(totalDiscount) > formatNumberFromCurrency(subTotal)) {
                Alert.alert(
                    `Warning`,
                    `Discount cannot be more than the subtotal.`,
                    [

                        { text: 'OK', onPress: () => { } }
                    ],
                    { cancelable: false }
                );
            } else {
                const {promotionNotes,isDiscountByOwner} = this.state;
                this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, isDiscountByOwner,appointmentDetail.appointmentId);
                this.props.actions.marketing.addPromotionNote(appointmentDetail.appointmentId,promotionNotes);
                this.props.actions.marketing.closeModalDiscount();
            }
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

    scrollTo = num => {
        this.scrollRef.current.scrollTo({ x: 0, y: num, animated: true })
    }

    toggleCheckBox = () => {
        this.setState(prevState => ({ isDiscountByOwner: !prevState.isDiscountByOwner }))
    }


    // ------ Render -----

    render() {
        try {
            const { title, discount, visibleModalDiscount,
                appointmentDetail, language
            } = this.props;
            const { customDiscountPercent, customDiscountFixed } = appointmentDetail;
            const {
                moneyDiscountCustom, moneyDiscountFixedAmout, totalLocal, discountTotal,
                customDiscountPercentLocal, customDiscountFixedLocal,promotionNotes,isDiscountByOwner
            } = this.state;
            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }
            if (visibleModalDiscount && !this.customDiscountRef.current) {
                const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
                total = formatNumberFromCurrency(total) + (formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(subTotal) / 100);
            }
            if (visibleModalDiscount && !this.customFixedAmountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(customDiscountFixed);
            }
            if (visibleModalDiscount && this.customDiscountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);
            }
            if (visibleModalDiscount && this.customFixedAmountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);
            }

            total = Number(total).toFixed(2);

            const temptTotalDiscount = _.isEmpty(appointmentDetail) ? Number(discountTotal).toFixed(2) : Number(total).toFixed(2);
            const temptTotal = _.isEmpty(appointmentDetail) ? totalLocal : (!_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0);
            const temptCustomDiscountPercent = _.isEmpty(appointmentDetail) ? customDiscountPercentLocal : customDiscountPercent;
            const temptCustomDiscountFixed = _.isEmpty(appointmentDetail) ? customDiscountFixedLocal : customDiscountFixed;


            const visible = visibleModalDiscount && !_.isEmpty(appointmentDetail) ? true : false;
            const tempCheckBoxIcon = isDiscountByOwner ? ICON.checkBox : ICON.checkBoxEmpty;

            return (
                <PopupParent
                    title={title}
                    visible={visible}
                    onRequestClose={this.onRequestClose}
                    width={600}
                    style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
                >
                    <View style={{
                        height: scaleSzie(400), backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    }} >
                        <View style={{ height: scaleSzie(280) }} >
                            <ScrollView 
                             ref={this.scrollRef}
                            keyboardShouldPersistTaps="always" 
                            >
                                <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSzie(25) }} >
                                    {
                                        discount.map((promo, index) => <ItemCampaign
                                            key={index}
                                            title={promo.merchantPromotion.campaignName}
                                            discount={promo.discount}
                                        />
                                        )
                                    }
                                    <View style={{ height: scaleSzie(10) }} />
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

                                     {/* ------------ Check Box ----------- */}
                                     <View style={{ flexDirection: "row", marginTop: scaleSzie(2), marginBottom: scaleSzie(12), alignItems: "center" }} >
                                        <Button onPress={this.toggleCheckBox} >
                                            <Image source={tempCheckBoxIcon} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                        </Button>
                                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginLeft: scaleSzie(15) }} >
                                            {`Discount By Owner`}
                                        </Text>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: "#707070" }} />

                                    {/* ----------- Note  ----------- */}
                                    <View style={{}} >
                                        <Text style={[{
                                            color: "#404040", fontSize: scaleSzie(16), fontWeight: "600",
                                            marginBottom: scaleSzie(5), marginTop: scaleSzie(12)
                                        }]} >
                                            {`Note`}
                                        </Text>
                                        <View style={{
                                            height: scaleSzie(70), borderColor: "#DDDDDD", borderWidth: 2, borderRadius: 4, paddingVertical: 5,
                                            paddingHorizontal: scaleSzie(10)
                                        }} >
                                            <TextInput
                                                style={{ flex: 1, fontSize: scaleSzie(12) }}
                                                multiline={true}
                                                value={promotionNotes}
                                                onChangeText={(promotionNotes) => this.setState({ promotionNotes })}
                                                onFocus={() => this.scrollRef.current.scrollToEnd()}
                                                onBlur={() => this.scrollTo(0)}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ height: scaleSzie(130) }} />
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
                                    {`$ - ${formatMoney(temptTotalDiscount)}`}
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
             console.log(error);

        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { visibleModalDiscount, appointmentDetail, isGetPromotionOfAppointment, promotionNotes ,isDiscountByOwner} = this.props;
        const visible = visibleModalDiscount && !_.isEmpty(appointmentDetail) ? true : false;
        if (prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success" && visible) {
            this.props.actions.marketing.resetStateGetPromotionOfAppointment();
            await this.setState({
                promotionNotes: promotionNotes.note ? promotionNotes.note : "",
                isDiscountByOwner:isDiscountByOwner
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
                <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                    {title}
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }} >
                <Text style={{ color: '#4CD964', fontSize: scaleSzie(18) }} >
                    {`$ ${discount}`}
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
        const { total, onChangeText, language } = this.props;
        const discount = formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100;

        return (
            <View style={{
                flexDirection: 'row', height: scaleSzie(45),
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
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
                            <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                                %
                            </Text>
                        </View>
                    </View>
                    {/* -------  ----- */}
                </View>
                <View style={{ justifyContent: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
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
        const { onChangeText, language } = this.props;
        return (
            <View style={{
                flexDirection: 'row', height: scaleSzie(55),  paddingBottom: scaleSzie(20)
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
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
                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(18) }} >
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
    visibleModalDiscount: state.marketing.visibleModalDiscount,
    appointmentDetail: state.appointment.appointmentDetail,
    language: state.dataLocal.language,
    isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
    promotionNotes: state.marketing.promotionNotes,
    isDiscountByOwner: state.marketing.isDiscountByOwner
})



export default connectRedux(mapStateToProps, PopupDiscount);

