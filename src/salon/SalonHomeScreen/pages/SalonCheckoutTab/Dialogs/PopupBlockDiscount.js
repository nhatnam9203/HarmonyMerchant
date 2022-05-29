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
    Platform,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'ramda';

import { ButtonCustom, PopupParent, Slider } from '@components';
import { scaleSize, formatNumberFromCurrency, formatMoney, localize, roundNumber, checkIsTablet } from '@utils';
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
            manualTypeSelect: manualType.percentType,
            valueText: 0,
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

        let manualDiscount = 0;
        const moneyDiscountCustom = (formatNumberFromCurrency(percentDiscountCustom) * formatNumberFromCurrency(subTotal) / 100);

        manualDiscount = formatNumberFromCurrency(manualDiscount) + formatNumberFromCurrency(moneyDiscountFixedAmout);
        manualDiscount = formatNumberFromCurrency(manualDiscount) + formatNumberFromCurrency(moneyDiscountCustom);

        if(manualDiscount > 0) {
            totalDiscount = manualDiscount
        } else {
            for (let i = 0; i < discount.length; i++) {
                totalDiscount = formatNumberFromCurrency(totalDiscount) + formatNumberFromCurrency(discount[i].discount);
            };
        }

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

    changeTypeManualDiscount = async (type) =>{
        if(type == manualType.percentType){
            await this.setState({
                manualTypeSelect: manualType.percentType
            })
        }else{
            await this.setState({
                manualTypeSelect: manualType.fixAmountType
            })
        }

        this.calculateDiscount(this.state.valueText)
    }

    calculateDiscount = async(textNumber) => {
        if(this.state.manualTypeSelect == manualType.percentType){
            this.setState({
                percentDiscountCustom: textNumber,
                moneyDiscountFixedAmout: 0,
            });

        }else{
            this.setState({
                percentDiscountCustom: 0,
                moneyDiscountFixedAmout: textNumber,
            });

        }

    }

    onChangeText = async (textNumber) => {
        this.setState({valueText: textNumber})
        this.calculateDiscount(textNumber)

    }

    // ------ Render -----

    render() {
        try {
            const { title, discount, visibleModalBlockDiscount, language, appointmentIdUpdatePromotion, blockAppointments } = this.props;
            const { moneyDiscountFixedAmout, percentDiscountCustom, promotionNotes, isDiscountByOwner } = this.state;

            let total = 0;
            let manualDiscountTemp = 0;

            const appointmentDetail = blockAppointments.find((appointment) => appointment.appointmentId === appointmentIdUpdatePromotion);
            const subTotal = appointmentDetail?.subTotal || 0;

            const moneyDiscountCustom = (formatNumberFromCurrency(percentDiscountCustom) * formatNumberFromCurrency(subTotal) / 100);
            if (moneyDiscountFixedAmout > 0) {
                manualDiscountTemp = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountFixedAmout);
            } else if (moneyDiscountCustom > 0) {
                manualDiscountTemp = formatNumberFromCurrency(total) + formatNumberFromCurrency(moneyDiscountCustom);
            }

            if(manualDiscountTemp > 0) {
                total = manualDiscountTemp;
            } else {
                for (let i = 0; i < discount.length; i++) {
                    total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
                }
            }
            total = roundNumber(total);

            const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);
            const discountByStaff = (100 - this.state.discountByOwner)

            const stylePercentText = this.state.manualTypeSelect == manualType.percentType
            ? styles.colorSelectedText : styles.colorUnselectedText
            const stylePercentButton = this.state.manualTypeSelect == manualType.percentType
            ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected

            const styleFixText = this.state.manualTypeSelect == manualType.fixAmountType
            ? styles.colorSelectedText : styles.colorUnselectedText
            const styleFixButton = this.state.manualTypeSelect == manualType.fixAmountType
            ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected

            const moneyDiscountManual = this.state.manualTypeSelect == manualType.percentType
                                        ? moneyDiscountCustom : moneyDiscountFixedAmout

            const discountMoneyByStaff = roundNumber(formatNumberFromCurrency(discountByStaff) * formatNumberFromCurrency(moneyDiscountManual) /100)
            const discountMoneyByOwner = roundNumber(moneyDiscountManual - discountMoneyByStaff)
            return (
                <PopupParent
                    title={title}
                    visible={visibleModalBlockDiscount}
                    onRequestClose={this.onRequestClose}
                    width={scaleSize(500)}
                    height={45}
                >
                    <View style={{
                        height: tempHeight, backgroundColor: '#fff',
                        borderBottomLeftRadius: scaleSize(15), borderBottomRightRadius: scaleSize(15),
                    }} >
                        <View style={{ height: scaleSize(300) }} >
                            <ScrollView
                                ref={this.scrollRef}
                                keyboardShouldPersistTaps="always"
                            >
                                <TouchableOpacity activeOpacity={1} style={{ paddingHorizontal: scaleSize(25) }} >
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
                                    <View style={{ height: scaleSize(10) }} />
                                    {/* ----------- Row 1 ----------- */}
                                    <View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.textNormal}>
                                                {localize("Manual Discount", language)}
                                            </Text>
                                            <Text style={styles.discountNote}>
                                                {localize("ManualDiscountNote", language)}
                                            </Text>
                                        </View>
                                        <View style={styles.viewRowContainer}>
                                            <View style={styles.viewGroupRow}>
                                                <TouchableHighlight
                                                    style={[styles.discountTypeButton, stylePercentButton]}
                                                    onPress={() => this.changeTypeManualDiscount(manualType.percentType)}
                                                    underlayColor='#fff'>
                                                        <Text style={[styles.discountManualText, stylePercentText]}>
                                                            {"%"}
                                                        </Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight
                                                    style={[styles.discountTypeButton, styleFixButton]}
                                                    onPress={() => this.changeTypeManualDiscount(manualType.fixAmountType)}
                                                    underlayColor='#fff'>
                                                        <Text style={[styles.discountManualText, styleFixText]}>{"$"}</Text>
                                                </TouchableHighlight>

                                                {/* ------- Text input ----- */}
                                                <View style={styles.textInputView} >
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
                                                            value={`${this.state.valueText}`}
                                                            onChangeText={this.onChangeText}
                                                            keyboardType="numeric"
                                                            placeholderTextColor="#A9A9A9"
                                                            maxLength={6}

                                                        />
                                                    </View>

                                                </View>
                                            </View>

                                            <View style={{ justifyContent: 'center' }} >
                                                <Text style={{ color: '#4CD964', fontSize: scaleSize(18) }} >
                                                    {`$ ${formatMoney(roundNumber(moneyDiscountManual))}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>


                                    {/* -----------  Discount by Owner, Discount by staff  ----------- */}
                                    <View style={[styles.viewRowContainer, {marginTop: 25}]}>
                                        <Text style={styles.textNormal}>{localize('Discount by Owner', language)}</Text>
                                        <Text style={styles.textNormal}>{localize('Discount by Staff', language)}</Text>
                                    </View>

                                     {/* ----------Money discount of staff, owner------------ */}
                                     <View style={styles.viewRowContainer}>
                                        <Text style={styles.textNormal}>{`$ ${discountMoneyByOwner}`}</Text>
                                        <Text style={styles.textNormal}>{`$ ${discountMoneyByStaff}`}</Text>
                                    </View>
                                    {/* ----------Slider------------ */}
                                    <Slider
                                        style={styles.slider}
                                        value={this.state.discountByOwner}
                                        minimumValue={0}
                                        maximumValue={100}
                                        onValueChange={(value)=>this.handelSliderValue(value)}
                                        trackStyle={{
                                            height: scaleSize(10),
                                            backgroundColor: "#F1F1F1",
                                            borderRadius: scaleSize(6),
                                          }}
                                          thumbStyle={{
                                            height: scaleSize(24),
                                            width: scaleSize(24),
                                            borderRadius: scaleSize(12),
                                            backgroundColor: "#fff",
                                            ...Platform.select({
                                              ios: {
                                                shadowColor: "rgba(0, 0, 0,0.3)",
                                                shadowOffset: { width: 1, height: 0 },
                                                shadowOpacity: 1,
                                              },

                                              android: {
                                                elevation: 2,
                                              },
                                            }),
                                          }}

                                          minimumTrackTintColor={colors.OCEAN_BLUE}
                                          maximumTrackTintColor={colors.PALE_GREY}
                                          step={25}
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

            const percentDiscountCustom = appointmentDetail?.customDiscountPercent || 0
            const moneyDiscountFixedAmout = appointmentDetail?.customDiscountFixed || 0
            const manualTypeSelect = moneyDiscountFixedAmout > 0
                                    ? manualType.fixAmountType : manualType.percentType
            const valueText = manualTypeSelect == manualType.fixAmountType ? moneyDiscountFixedAmout : percentDiscountCustom
            await this.setState({
                percentDiscountCustom,
                moneyDiscountFixedAmout,
                manualTypeSelect,
                valueText,
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
    discountNote: {
        color: 'red',
        fontSize: scaleSize(14),
        marginLeft: scaleSize(5),
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

