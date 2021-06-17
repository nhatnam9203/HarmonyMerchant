import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSize, formatNumberFromCurrency, formatMoney, localize, roundNumber, checkIsTablet } from '@utils';
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
            isDiscountByOwner: true,
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
        this.scrollRef = React.createRef();
    }


    setStateFromParent = async (totalLocal, discountTotal, customDiscountPercent, customDiscountFixedLocal) => {
        await this.setState({
            totalLocal,
            discountTotal: discountTotal,
            temptTotalLocal: discountTotal,
            customDiscountPercentLocal: customDiscountPercent,
            customDiscountFixedLocal,
        });
    }

    submitCustomPromotion = () => {
        const { groupAppointment, appointmentIdUpdatePromotion, discount } = this.props;
        const customDiscountPercent = this.customDiscountRef.current?.state.percent;
        const customFixedAmount = this.customFixedAmountRef.current?.state.discount;
        if (!_.isEmpty(groupAppointment)) {
            const appointmentDetail = appointmentIdUpdatePromotion !== -1 && !_.isEmpty(groupAppointment) && groupAppointment.appointments ? groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion) : { subTotal: 0 };
            const subTotal = appointmentDetail?.subTotal || 0;
            let totalDiscount = 0;
            for (let i = 0; i < discount.length; i++) {
                totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(discount[i].discount);
            }
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
                const { promotionNotes, isDiscountByOwner } = this.state;
                this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, isDiscountByOwner, appointmentIdUpdatePromotion, true);
                this.props.actions.marketing.addPromotionNote(appointmentDetail.appointmentId, promotionNotes);
                this.props.actions.marketing.closeModalDiscount();
                this.resetState();
            }
        }
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
        this.resetState();
    }

    async resetState() {
        await this.setState({
            totalLocal: 0,
            temptTotalLocal: 0,
            customDiscountPercentLocal: 0,
            customDiscountFixedLocal: 0
        });
    }

    onChangeTextCustomDiscount = async (discount) => {
        await this.setState({
            moneyDiscountCustom: discount,
            moneyDiscountFixedAmout: this.customFixedAmountRef.current?.state.discount
        });
    }

    onChangeTextDiscountFixed = async (discountFixed) => {
        const { totalLocal } = this.state;
        const customDiscountPercent = this.customDiscountRef.current?.state.percent;
        const {
            appointmentIdUpdatePromotion,
            groupAppointment
        } = this.props;

        const temptDiscount = formatNumberFromCurrency(discountFixed) + Number((formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(totalLocal) / 100).toFixed(2));

        if (_.isEmpty(groupAppointment)) {
            await this.setState(prevState => ({
                discountTotal: temptDiscount
            }));
        } else {
            const appointmentDetail = !_.isEmpty(groupAppointment) && groupAppointment.appointments ? groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion) : { subTotal: 0 };
            const subTotal = appointmentDetail?.subTotal || 0;
            await this.setState({
                moneyDiscountFixedAmout: discountFixed,
                moneyDiscountCustom: (formatNumberFromCurrency(this.customDiscountRef.current?.state.percent) * formatNumberFromCurrency(subTotal) / 100)
            })
        }
    }

    scrollTo = num => {
        this.scrollRef.current?.scrollTo({ x: 0, y: num, animated: true })
    }

    toggleCheckBox = () => {
        this.setState(prevState => ({ isDiscountByOwner: !prevState.isDiscountByOwner }))
    }

    // ------ Render -----
    render() {
        try {
            const { title, discount, visibleModalDiscount,
                appointmentIdUpdatePromotion, groupAppointment, language
            } = this.props;
            const appointmentDetail = appointmentIdUpdatePromotion !== -1 && !_.isEmpty(groupAppointment) && groupAppointment.appointments ? groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion) : { subTotal: 0 };
            const { customDiscountPercent, customDiscountFixed } = appointmentDetail !== undefined && appointmentDetail && !_.isEmpty(appointmentDetail) ? appointmentDetail : { customDiscountPercent: 0, customDiscountFixed: 0 };
            const {
                isDiscountByOwner,
                customDiscountPercentLocal, customDiscountFixedLocal, promotionNotes
            } = this.state;
            const visible = visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;

            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }

            if (visible && this.customDiscountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(this.customDiscountRef.current?.state.discount);
            }
            if (visible && this.customFixedAmountRef.current) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(this.customFixedAmountRef.current?.state.discount);
            }

            total = roundNumber(total);

            const temptCustomDiscountPercent = _.isEmpty(appointmentDetail) ? customDiscountPercentLocal : customDiscountPercent;
            const temptCustomDiscountFixed = _.isEmpty(appointmentDetail) ? customDiscountFixedLocal : customDiscountFixed;
            const tempCheckBoxIcon = isDiscountByOwner ? ICON.checkBox : ICON.checkBoxEmpty;

            const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);
            customDiscountPercent={temptCustomDiscountPercent}
            
            return (
                <PopupParent
                    title={title}
                    visible={visible}
                    onRequestClose={this.onRequestClose}
                    width={600}
                >
                    <View style={{
                        height: tempHeight, backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                    }} >
                        <View style={{ height: scaleSize(280) }} >
                            <ScrollView
                                ref={this.scrollRef}
                                keyboardShouldPersistTaps="always" >
                                <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSize(25) }} >
                                    {
                                        discount.map((promo, index) => <ItemCampaign
                                            key={index}
                                            title={promo.merchantPromotion.campaignName}
                                            discount={promo.discount}
                                        />
                                        )
                                    }
                                    <View style={{ height: scaleSize(10) }} />
                                    {/* ----------- Row 1 ----------- */}
                                    <CustomDiscount
                                        ref={this.customDiscountRef}
                                        customDiscountPercent={temptCustomDiscountPercent}
                                        total={formatNumberFromCurrency(!_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0)}
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
                                    <View style={{ flexDirection: "row", marginTop: scaleSize(2), marginBottom: scaleSize(12), alignItems: "center" }} >
                                        <Button onPress={this.toggleCheckBox} >
                                            <Image source={tempCheckBoxIcon} style={{ width: scaleSize(20), height: scaleSize(20) }} />
                                        </Button>
                                        <Text style={{ color: '#404040', fontSize: scaleSize(14), marginLeft: scaleSize(15) }} >
                                            {`Discount By Owner`}
                                        </Text>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: "#707070" }} />

                                   
                                    {/* ----------- Note  ----------- */}
                                    <View style={{}} >
                                        <Text style={[{
                                            color: "#404040", fontSize: scaleSize(16), fontWeight: "600",
                                            marginBottom: scaleSize(5), marginTop: scaleSize(12)
                                        }]} >
                                            {`Note`}
                                        </Text>
                                        <View style={{
                                            height: scaleSize(70), borderColor: "#DDDDDD", borderWidth: 2, borderRadius: 4, paddingVertical: 5,
                                            paddingHorizontal: scaleSize(10)
                                        }} >
                                            <TextInput
                                                style={{ flex: 1, fontSize: scaleSize(12), padding: 0, textAlignVertical: "top" }}
                                                multiline={true}
                                                value={promotionNotes}
                                                onChangeText={(promotionNotes) => this.setState({ promotionNotes })}
                                                onFocus={() => this.scrollRef.current?.scrollToEnd()}
                                                onBlur={() => this.scrollTo(0)}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ height: scaleSize(130) }} />
                                </TouchableOpacity>
                            </ScrollView>

                        </View>
                        {/* ---------- Total ------- */}
                        <View style={{
                            flexDirection: 'row', height: scaleSize(40),
                            paddingHorizontal: scaleSize(25)
                        }} >
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSize(22), fontWeight: 'bold' }} >
                                    {localize('Total Discount', language)}
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }} >
                                <Text style={{ color: '#4CD964', fontSize: scaleSize(22), fontWeight: 'bold' }} >
                                    {`$ -${formatMoney(total)}`}
                                </Text>
                            </View>
                        </View>

                        {/* ----------- Button Add ---- */}
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSize(12) }} >
                            <ButtonCustom
                                width={scaleSize(180)}
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
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { visibleModalDiscount, groupAppointment, isGetPromotionOfAppointment, promotionNotes, isDiscountByOwner } = this.props;
        const visible = visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;
        if (prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success" && visible) {
            this.props.actions.marketing.resetStateGetPromotionOfAppointment();
            await this.setState({
                promotionNotes: promotionNotes.note ? promotionNotes.note : "",
                isDiscountByOwner: isDiscountByOwner
            });

        }
    }

}

const ItemCampaign = ({ title, discount }) => {

    return (
        <View style={{
            flexDirection: 'row', height: scaleSize(55),
            borderBottomColor: '#707070', borderBottomWidth: 1
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
                    {title}
                </Text>
            </View>
            <View style={{ justifyContent: 'center' }} >
                <Text style={{ color: '#4CD964', fontSize: scaleSize(18) }} >
                    {`$ ${discount}`}
                </Text>
            </View>
        </View>
    );
}

class CustomDiscount extends React.Component {

    constructor(props) {
        super(props);
        const { total, customDiscountPercent } = this.props;
        const percent = customDiscountPercent ? customDiscountPercent : 0;
        this.state = {
            percent: percent,
            discount: roundNumber((formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100))
        }
    }

    onChangeText = async (percent) => {
        await this.setState({ percent });
        const { total } = this.props;
        const discount = roundNumber((formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100));
        this.setState({
            discount
        });
        this.props.onChangeText(discount);
    }

    render() {
        const { percent } = this.state;
        const { total, language } = this.props;
        const discount = (formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100);

        return (
            <View style={{
                flexDirection: 'row', height: scaleSize(45),
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
                        {localize('Apply Discount', language)}
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
                            <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
                                %
                            </Text>
                        </View>
                    </View>
                    {/* -------  ----- */}
                </View>
                <View style={{ justifyContent: 'center' }} >
                    <Text style={{ color: '#4CD964', fontSize: scaleSize(18) }} >
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

    onChangeText = async (discount) => {
        await this.setState({
            discount
        });
        this.props.onChangeText(discount);
    }

    render() {
        const { onChangeText, language } = this.props;
        return (
            <View style={{
                flexDirection: 'row', height: scaleSize(45),
                paddingBottom: scaleSize(20)
            }} >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                    <Text style={{ color: '#404040', fontSize: scaleSize(18) }} >
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
                        <View style={{ justifyContent: 'center', paddingLeft: scaleSize(5) }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSize(18) }} >
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
                                onChangeText={this.onChangeText}
                                keyboardType="numeric"
                                placeholderTextColor="#A9A9A9"
                            // maxLength={6}
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
    appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
    language: state.dataLocal.language,
    isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
    promotionNotes: state.marketing.promotionNotes,
    isDiscountByOwner: state.marketing.isDiscountByOwner
})



export default connectRedux(mapStateToProps, PopupDiscount);

