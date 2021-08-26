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
import { scaleSize, formatNumberFromCurrency,
     formatMoney, localize, roundNumber,
     checkIsTablet } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";
import { colors } from '@shared/themes';
const manualType = {
    fixAmountType: 'fixAmountType',
    percentType: 'percentType'
}

class PopupDiscount extends React.Component {

    constructor(props) {
        super(props);
        const { groupAppointment, appointmentIdUpdatePromotion } = this.props;
        const appointmentDetail = appointmentIdUpdatePromotion !== -1
            && !_.isEmpty(groupAppointment)
            && groupAppointment.appointments ?
                groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion)
                : { subTotal: 0 };
        this.state = {
            discountTotal: 0,
            totalLocal: 0,
            temptTotalLocal: 0,
            moneyDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,

            customDiscountPercentLocal: 0,
            customDiscountFixedLocal: 0,
            promotionNotes: "",
            discountByOwner: appointmentDetail && appointmentDetail.discountByOwner
                                                    ? parseFloat(appointmentDetail.discountByOwner) : 100
        };
        this.customDiscountRef = React.createRef();
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

    handelSliderValue = async(value) => {
        this.setState({discountByOwner: value})
    }

    submitCustomPromotion = () => {
        const { groupAppointment, appointmentIdUpdatePromotion, discount } = this.props;
        const customDiscountPercent =  this.customDiscountRef.current.state.percent;
        const customFixedAmount =  this.customDiscountRef.current.state.fixedAmount;
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
                const { promotionNotes, discountByOwner } = this.state;
                this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, discountByOwner, appointmentIdUpdatePromotion, true);
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
            customDiscountFixedLocal: 0,
            moneyDiscountCustom: 0,
            moneyDiscountFixedAmout: 0,
        });
    }

    onChangeTextCustomDiscount = async (moneyDiscountByPercent, moneyDiscountFixed) => {
        await this.setState({
            moneyDiscountCustom: moneyDiscountByPercent,
            moneyDiscountFixedAmout: moneyDiscountFixed,

        });
    }

    scrollTo = num => {
        this.scrollRef.current?.scrollTo({ x: 0, y: num, animated: true })
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

            total = roundNumber(total);

            const temptCustomDiscountPercent = _.isEmpty(appointmentDetail) ? customDiscountPercentLocal : customDiscountPercent;
            const temptCustomDiscountFixed = _.isEmpty(appointmentDetail) ? customDiscountFixedLocal : customDiscountFixed;

            const tempHeight = checkIsTablet() ? scaleSize(390) : scaleSize(400);
            const discountByStaff = (100 - this.state.discountByOwner)
            const manualDiscount = this.state.moneyDiscountCustom > 0
                                    ? this.state.moneyDiscountCustom
                                    : this.state.moneyDiscountFixedAmout
            const discountMoneyByStaff = roundNumber(formatNumberFromCurrency(discountByStaff) * formatNumberFromCurrency(manualDiscount) /100)
            const discountMoneyByOwner = roundNumber(manualDiscount - discountMoneyByStaff)
            return (
                <PopupParent
                    title={title}
                    visible={visible}
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
                                keyboardShouldPersistTaps="always" >
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
                                            title={promo?.merchantPromotion?.name}
                                            discount={promo?.discount}
                                        />
                                        )
                                    }
                                    <View style={{ height: scaleSize(10) }} />
                                    {/* ----------- Row 1 ----------- */}
                                    <CustomDiscount
                                        ref={this.customDiscountRef}
                                        customDiscountPercent={temptCustomDiscountPercent}
                                        customDiscountFixed={temptCustomDiscountFixed}
                                        total={formatNumberFromCurrency(!_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0)}
                                        onChangeText={(moneyDiscountByPercent, moneyDiscountFixed) => this.onChangeTextCustomDiscount(moneyDiscountByPercent, moneyDiscountFixed)}
                                        language={language}
                                    />

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
        const { visibleModalDiscount,
            groupAppointment,
            isGetPromotionOfAppointment,
            promotionNotes,
            discountByOwner,
            appointmentIdUpdatePromotion } = this.props;
        const visible = visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;
        if (prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success" && visible) {
            this.props.actions.marketing.resetStateGetPromotionOfAppointment();
            const appointmentDetail = appointmentIdUpdatePromotion !== -1 && !_.isEmpty(groupAppointment) && groupAppointment.appointments ? groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion) : { subTotal: 0 };
            const { customDiscountPercent, customDiscountFixed, subTotal } = appointmentDetail !== undefined && appointmentDetail && !_.isEmpty(appointmentDetail) ? appointmentDetail : { customDiscountPercent: 0, customDiscountFixed: 0 };
            const customMoneyByPercent = formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(subTotal) / 100

            await this.setState({
                promotionNotes: promotionNotes.note ? promotionNotes.note : "",
                discountByOwner: discountByOwner ? parseFloat(discountByOwner) : 100,
                moneyDiscountCustom: customMoneyByPercent,
                moneyDiscountFixedAmout: customDiscountFixed,
            });

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

class CustomDiscount extends React.Component {

    constructor(props) {
        super(props);
        const { total, customDiscountPercent, customDiscountFixed } = this.props;
        const percent = customDiscountPercent ? customDiscountPercent : 0;
        const fixedAmount = customDiscountFixed ? customDiscountFixed: 0
        const type = customDiscountFixed && customDiscountFixed > 0 ? manualType.fixAmountType : manualType.percentType
        const discountTemp = type == manualType.fixAmountType ? customDiscountFixed
                            : roundNumber(formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100)
        this.state = {
            percent: percent,
            discount: discountTemp,
            manualTypeSelect: type,
            fixedAmount,
            valueText: type == manualType.fixAmountType ? fixedAmount : percent
        }
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
        const {total} = this.props

        let discount = textNumber
        if(this.state.manualTypeSelect == manualType.percentType){
            discount = roundNumber((formatNumberFromCurrency(textNumber) * formatNumberFromCurrency(total) / 100));

            await this.setState({
                discount,
                percent: this.state.valueText,
                fixedAmount: 0,
            });

            this.props.onChangeText(discount, 0);
        }else{
            await this.setState({
                discount,
                fixedAmount: this.state.valueText,
                percent: 0,
            });

            this.props.onChangeText(0, discount);
        }

    }

    onChangeText = async (textNumber) => {
        await this.setState({valueText: textNumber})
        this.calculateDiscount(textNumber)

    }

    render() {
        const { language } = this.props;
        const stylePercentText = this.state.manualTypeSelect == manualType.percentType
        ? styles.colorSelectedText : styles.colorUnselectedText
        const stylePercentButton = this.state.manualTypeSelect == manualType.percentType
        ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected

        const styleFixText = this.state.manualTypeSelect == manualType.fixAmountType
        ? styles.colorSelectedText : styles.colorUnselectedText
        const styleFixButton = this.state.manualTypeSelect == manualType.fixAmountType
        ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected
        return (
            <View>
                <Text style={styles.textNormal}>{localize('Manual Discount', language)}</Text>
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
                            {/* -------  ----- */}
                        </View>

                        <View style={{ justifyContent: 'center' }} >
                            <Text style={{ color: '#4CD964', fontSize: scaleSize(18) }} >
                                {`$ ${formatMoney(roundNumber(this.state.discount))}`}
                            </Text>
                        </View>

                    </View>


                </View>
        );
    }

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
    visibleModalDiscount: state.marketing.visibleModalDiscount,
    appointmentDetail: state.appointment.appointmentDetail,
    groupAppointment: state.appointment.groupAppointment,
    appointmentIdUpdatePromotion: state.marketing.appointmentIdUpdatePromotion,
    language: state.dataLocal.language,
    isGetPromotionOfAppointment: state.marketing.isGetPromotionOfAppointment,
    promotionNotes: state.marketing.promotionNotes,
    discountByOwner: state.marketing.discountByOwner,
})



export default connectRedux(mapStateToProps, PopupDiscount);

