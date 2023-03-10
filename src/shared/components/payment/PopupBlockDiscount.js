import React from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSize, formatNumberFromCurrency, formatMoney, localize, roundNumber, checkIsTablet } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";

class PopupBlockDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percentDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,
            isReload: false,
            promotionNotes: "",
            isDiscountByOwner: true
        };
        this.customDiscountRef = React.createRef();
        this.customFixedAmountRef = React.createRef();
        this.scrollRef = React.createRef();
    }


    submitCustomPromotion = async () => {
        const { appointmentIdUpdatePromotion, discount, blockAppointments } = this.props;
        const { percentDiscountCustom, moneyDiscountFixedAmout } = this.state;

        const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
        const subTotal = appointmentDetail?.subTotal || 0;

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
                `Discount cannot be more than the subtotal.`,
                [

                    { text: 'OK', onPress: () => { } }
                ],
                { cancelable: false }
            );
        } else {
            const { promotionNotes, isDiscountByOwner } = this.state;
            this.props.actions.marketing.customPromotion(percentDiscountCustom, moneyDiscountFixedAmout, isDiscountByOwner, appointmentIdUpdatePromotion, true, true);
            this.props.actions.marketing.addPromotionNote(appointmentDetail.appointmentId, promotionNotes);
            this.props.actions.marketing.closeModalDiscount();
        }
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
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
            const { title, discount, visibleModalBlockDiscount, language, appointmentIdUpdatePromotion, blockAppointments } = this.props;
            const { moneyDiscountFixedAmout, percentDiscountCustom, promotionNotes, isDiscountByOwner } = this.state;

            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }

            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            const subTotal = appointmentDetail?.subTotal || 0;
            const moneyDiscountCustom = (formatNumberFromCurrency(percentDiscountCustom) * formatNumberFromCurrency(subTotal) / 100);

            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);
            total = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);
            total = roundNumber(total);

            const tempCheckBoxIcon = isDiscountByOwner ? ICON.checkBox : ICON.checkBoxEmpty;
            const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);

            return (
                <PopupParent
                    title={title}
                    visible={visibleModalBlockDiscount}
                    onRequestClose={this.onRequestClose}
                    width={scaleSize(600)}
                >
                    <View style={{
                        height: tempHeight, backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                    }} >
                        <View style={{ height: scaleSize(280) }} >
                            <ScrollView
                                ref={this.scrollRef}
                                keyboardShouldPersistTaps="always"
                            >
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
                                    <View style={{
                                        flexDirection: 'row', height: scaleSize(45),
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
                                                        value={`${percentDiscountCustom}`}
                                                        onChangeText={(percentDiscountCustom) => this.setState({ percentDiscountCustom })}
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
                                            <Text style={{ color: '#4CD964', fontSize: scaleSize(20) }} >
                                                {`$ ${formatMoney(roundNumber(moneyDiscountCustom))}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ----------- Row 2 ----------- */}
                                    <View style={{
                                        flexDirection: 'row', height: scaleSize(45), paddingBottom: scaleSize(20)
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
                                                        value={`${moneyDiscountFixedAmout}`}
                                                        onChangeText={moneyDiscountFixedAmout => { this.setState({ moneyDiscountFixedAmout }); }}
                                                        keyboardType="numeric"
                                                        placeholderTextColor="#A9A9A9"
                                                        // maxLength={3}
                                                    />
                                                </View>

                                            </View>
                                            {/* -------  ----- */}
                                        </View>
                                    </View>

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
        const { visibleModalBlockDiscount, blockAppointments, appointmentIdUpdatePromotion, isGetPromotionOfAppointment, promotionNotes, isDiscountByOwner } = this.props;
        if (!prevProps.visibleModalBlockDiscount && visibleModalBlockDiscount && prevProps.visibleModalBlockDiscount !== visibleModalBlockDiscount) {
            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            await this.setState({
                percentDiscountCustom: appointmentDetail?.customDiscountPercent || 0,
                moneyDiscountFixedAmout: appointmentDetail?.customDiscountFixed || 0,
            })
        }

        if (visibleModalBlockDiscount && prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success") {
            this.props.actions.marketing.resetStateGetPromotionOfAppointment();
            await this.setState({
                promotionNotes: promotionNotes?.note || "",
                isDiscountByOwner: isDiscountByOwner
            })
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

const mapStateToProps = state => ({
    discount: state.marketing.discount,
    visibleModalBlockDiscount: state.marketing.visibleModalBlockDiscount,
    groupAppointment: state.appointment.groupAppointment,
    appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
    language: state.dataLocal.language,
    blockAppointments: state.appointment.blockAppointments,
    isOpenBlockAppointmentId: state.appointment.isOpenBlockAppointmentId,
    isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
    promotionNotes: state.marketing.promotionNotes,
    isDiscountByOwner: state.marketing.isDiscountByOwner
})



export default connectRedux(mapStateToProps, PopupBlockDiscount);

