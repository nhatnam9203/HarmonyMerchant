import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
    StyleSheet,
    TouchableHighlight,
    Slider
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Button } from '@components';
import { scaleSzie, scaleSize, formatNumberFromCurrency, formatMoney, localize, roundNumber, checkIsTablet } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";
import { colors } from '@shared/themes';
const manualType = {
    fixAmountType: 'fixAmountType',
    percentType: 'percentType'
}

class PopupBlockDiscount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percentDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,
            isReload: false,
            promotionNotes: "",
            discountByOwner: 100,
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
            const { promotionNotes, discountByOwner } = this.state;
            this.props.actions.marketing.customPromotion(percentDiscountCustom, moneyDiscountFixedAmout, discountByOwner, appointmentIdUpdatePromotion, true, true);
            this.props.actions.marketing.addPromotionNote(appointmentDetail.appointmentId, promotionNotes);
            this.props.actions.marketing.closeModalDiscount();
        }
    }

    handelSliderValue = async(value) => {
        this.setState({discountByOwner: value})
    }

    onRequestClose = async () => {
        this.props.actions.marketing.closeModalDiscount();
    }

    scrollTo = num => {
        this.scrollRef.current.scrollTo({ x: 0, y: num, animated: true })
    }

    handelSliderValue = async(value) => {
        this.setState({discountByOwner: value})
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
            const tempHeight = checkIsTablet() ? scaleSzie(390) : scaleSzie(400);
            const discountByStaff = (100 - this.state.discountByOwner)

            return (
                <PopupParent
                    title={title}
                    visible={visibleModalBlockDiscount}
                    onRequestClose={this.onRequestClose}
                    width={500}
                    height={45}
                >
                    <View style={{
                        height: tempHeight, backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSzie(15), borderBottomRightRadius: scaleSzie(15),
                    }} >
                        <View style={{ height: scaleSzie(300) }} >
                            <ScrollView
                                ref={this.scrollRef}
                                keyboardShouldPersistTaps="always"
                            >
                                <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSzie(25) }} >
                                    {
                                        discount && discount.length > 0 &&
                                        <View style={[styles.viewRowContainer, {marginTop: 20}]}>
                                            <Text style={styles.textNormal}>{localize('Discount Campaigns:', language)}</Text>
                                            <Text style={styles.textNormal}>{localize('Apply Value', language)}</Text>
                                        </View>
                                    }
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
                                    <View style={{
                                        flexDirection: 'row', height: scaleSzie(45),
                                    }} >
                                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }} >
                                            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }} >
                                                {localize('Custom Discount by', language)}
                                            </Text>
                                            {/* ------- Text percent ----- */}
                                            <View style={{
                                                width: scaleSzie(120), height: scaleSzie(40),
                                                borderColor: '#707070', borderWidth: 1, marginLeft: scaleSzie(20), borderRadius: scaleSzie(4),
                                                flexDirection: 'row'
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
                                                    <Text style={{ color: '#404040', fontSize: scaleSzie(18) }} >
                                                        %
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* -------  ----- */}
                                        </View>
                                        <View style={{ justifyContent: 'center' }} >
                                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(20) }} >
                                                {`$ ${formatMoney(roundNumber(moneyDiscountCustom))}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ----------- Row 2 ----------- */}
                                    <View style={{
                                        flexDirection: 'row', height: scaleSzie(45), paddingBottom: scaleSzie(20)
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
                                                        // maxLength={3}
                                                    />
                                                </View>

                                            </View>
                                            {/* -------  ----- */}
                                        </View>
                                    </View>

                                    {/* -----------  Discount by Owner, Discount by staff  ----------- */}
                                    <View style={[styles.viewRowContainer, {marginTop: 25}]}>
                                        <Text style={styles.textNormal}>{localize('Discount by Owner', language)}</Text>
                                        <Text style={styles.textNormal}>{localize('Discount by Staff', language)}</Text>
                                    </View>
                                    
                                    {/* ----------Slider------------ */}
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={100}
                                        minimumTrackTintColor={colors.OCEAN_BLUE}
                                        maximumTrackTintColor={colors.PALE_GREY}
                                        onValueChange={(value)=>this.handelSliderValue(value)}
                                        value={this.state.discountByOwner}
                                      
                                        step={1}
                                    />

                                    <View style={styles.viewRowContainer}>
                                        <Text style={styles.textNormal}>{`${this.state.discountByOwner}%`}</Text>
                                        <Text style={styles.textNormal}>{`${discountByStaff}%`}</Text>
                                    </View> 

                                    {/* ----------- Note  ----------- */}
                                    <View style={{marginTop: 20}} >
                                        <Text style={[styles.textNormal,{marginBottom: 5}]} >
                                            {`Note`}
                                        </Text>
                                        <View style={{
                                            height: scaleSize(40), borderColor: "#DDDDDD", borderWidth: 2, borderRadius: 4, paddingVertical: 5,
                                            paddingHorizontal: scaleSize(10)
                                        }} >
                                            <TextInput
                                                style={[{ flex: 1, padding: 0, textAlignVertical: "top" }, styles.textNormal]}
                                                multiline={true}
                                                value={promotionNotes}
                                                onChangeText={(promotionNotes) => this.setState({ promotionNotes })}
                                                onFocus={() => this.scrollRef.current?.scrollToEnd()}
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
                            flexDirection: 'row', height: scaleSize(40),
                            paddingHorizontal: scaleSize(25)
                        }} >
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSize(18), fontWeight: 'bold' }} >
                                    {localize('Total Discount', language)}
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'center' }} >
                                <Text style={[styles.greenText, {fontWeight: 'bold' }]} >
                                    {`$ -${formatMoney(total)}`}
                                </Text>
                            </View>
                        </View>

                         {/* ----------- Button Add ---- */}
                         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSize(12) }} >
                            <ButtonCustom
                                width={scaleSize(160)}
                                height={40}
                                backgroundColor={colors.OCEAN_BLUE}
                                title={localize('Submit', language)}
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
        const { visibleModalBlockDiscount, blockAppointments, appointmentIdUpdatePromotion, isGetPromotionOfAppointment, promotionNotes, discountByOwner } = this.props;
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
                discountByOwner: discountByOwner ? parseFloat(discountByOwner) : 100,
            })
        }
    }

}

const ItemCampaign = ({ title, discount }) => {
    return (
        <View style={{
            flexDirection: 'row', height: scaleSize(35)
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSize(16) }} >
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

const styles = StyleSheet.create({
    viewRowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    textNormal: {
        color: colors.BROWNISH_GREY, 
        fontSize: scaleSize(16)
    },
    discountTypeButton:{
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.BROWNISH_GREY,
        justifyContent:'center',
        height: scaleSize(35),
        width: scaleSize(35),
    },
    discountManualText:{
        color:'#000',
        textAlign:'center',
        fontSize: scaleSize(16),
    },
    viewGroupRow:{
        flexDirection: 'row',
    
    },
    textInputView: {
        width: scaleSize(120), 
        height: scaleSize(35),
        borderColor: '#707070', 
        borderWidth: 1, marginLeft: scaleSize(20), 
        borderRadius: scaleSize(4),
        flexDirection: 'row'
    },
    greenText: { 
        color: '#4CD964', 
        fontSize: scaleSize(18) 
    },
    colorSelectedText: {
        color: '#fff'
    },
    colorUnselectedText: {
        color: '#000'
    },
    backgroundButtonSelected: {
        backgroundColor: colors.OCEAN_BLUE
    },
    backgroundButtonUnSelected: {
        backgroundColor: '#fff'
    },
    slider: {
        flex: 1,
        marginTop: 10
    }
})

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
    discountByOwner: state.marketing.discountByOwner
})



export default connectRedux(mapStateToProps, PopupBlockDiscount);

