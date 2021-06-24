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

import { ButtonCustom, PopupParent, } from '@components';
import { scaleSzie, formatNumberFromCurrency,
     formatMoney, localize, roundNumber, 
     checkIsTablet, round2 } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";
import { colors } from '@shared/themes';
const manualType = {
    fixAmountType: 'fixAmountType',
    percentType: 'percentType'
}
import * as l from 'lodash';

class PopupDiscount extends React.Component {

    constructor(props) {
        super(props);
        const { 
            appointmentIdUpdatePromotion,
            groupAppointment
        } = this.props;
        const appointmentDetail = appointmentIdUpdatePromotion !== -1 
                                && !_.isEmpty(groupAppointment) 
                                && groupAppointment.appointments 
                                ? groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentIdUpdatePromotion) 
                                : { subTotal: 0 };
       
     
        const customDiscountPercent = l.get(appointmentDetail, 'customDiscountPercent', 0) || 0
                                    
        const customDiscountFixed = l.get(appointmentDetail, 'customDiscountFixed', 0) || 0
        
        const type = customDiscountFixed && customDiscountFixed > 0 
                    ? manualType.fixAmountType : manualType.percentType
        const total = formatNumberFromCurrency(!_.isEmpty(appointmentDetail) 
                    && appointmentDetail && appointmentDetail.subTotal 
                    ? appointmentDetail.subTotal : 0)
        const discountTemp = type == manualType.fixAmountType ? customDiscountFixed 
                            : roundNumber((formatNumberFromCurrency(customDiscountPercent) * formatNumberFromCurrency(total) / 100))
        this.state = {
            discountTotal: 0,
            totalLocal: 0,
            temptTotalLocal: 0,
            discountCustom: discountTemp,
            selectDiscountType: type,
            customDiscountPercent,
            customDiscountFixed,
            promotionNotes: "",
            discountByOwner: appointmentDetail && appointmentDetail.discountByOwner 
                            ? parseFloat(appointmentDetail.discountByOwner) 
                            : 100,
            valueText: type == manualType.fixAmountType ? customDiscountFixed : customDiscountPercent
        };
    }


    // setStateFromParent = async (totalLocal, discountTotal, customDiscountPercent, customDiscountFixedLocal) => {
    //     await this.setState({
    //         totalLocal,
    //         discountTotal: discountTotal,
    //         temptTotalLocal: discountTotal,
    //         customDiscountPercentLocal: customDiscountPercent,
    //         customDiscountFixedLocal,
    //     });
    // }

    handelSliderValue = async(value) => {
        this.setState({discountByOwner: value})
    }

    submitCustomPromotion = () => {
        const { groupAppointment, appointmentIdUpdatePromotion, discount } = this.props;
        const customDiscountPercent = this.state.customDiscountPercent;
        const customFixedAmount = this.state.customDiscountFixed;
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
                const disCountByOwnerParam = discountByOwner
                this.props.actions.marketing.customPromotion(customDiscountPercent, customFixedAmount, disCountByOwnerParam, appointmentIdUpdatePromotion, true);
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

    onChangeTextCustomDiscount = async (typeSeclect, discount, percent) => {
        if(typeSeclect == manualTypeSelect.fixAmountType){
            await this.setState({
                discountCustom: discount,
                selectDiscountType: typeSeclect,
                customDiscountPercent: 0,
                customDiscountFixed: discount,
            });
        }else{
            await this.setState({
                discountCustom: discount,
                selectDiscountType: typeSeclect,
                customDiscountPercent: percent,
                customDiscountFixed: 0,
            });
        }
       
    }

    scrollTo = num => {
        this.scrollRef.current?.scrollTo({ x: 0, y: num, animated: true })
    }

    changeTypeManualDiscount = async (type) =>{
        if(type == manualType.percentType){
            await this.setState({
                selectDiscountType: manualType.percentType
            })
        }else{
            await this.setState({
                selectDiscountType: manualType.fixAmountType
            })
        }
        this.calculateDiscount(this.state.valueText)
    }

    calculateDiscount = async(textNumber) => {
        const {total} = this.props

        let discount = textNumber
        if(this.state.selectDiscountType == manualType.percentType){
            discount = roundNumber((formatNumberFromCurrency(textNumber) * formatNumberFromCurrency(total) / 100));
            
            await this.setState({
                discountCustom: discount,
                customDiscountPercent: textNumber,
                customDiscountFixed: 0,
            });

        }else{
            await this.setState({
                discountCustom: discount,
                customDiscountPercent: 0,
                customDiscountFixed: discount,
            });

        }

    }

    onChangeText = async (textNumber) => {
        await this.setState({valueText: textNumber})
        this.calculateDiscount(textNumber)
        
    }

    // ------ Render -----
    render() {
        try {
            const { title, discount, 
                    visibleModalDiscount, 
                    groupAppointment,
                    language
                } = this.props;
          
            const visible = visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;

            let total = 0;
            for (let i = 0; i < discount.length; i++) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(discount[i].discount);
            }

            if (visible) {
                total = formatNumberFromCurrency(total) + formatNumberFromCurrency(this.state.customDiscount);
            }

            total = roundNumber(total);

            const tempHeight = checkIsTablet() ? scaleSzie(390) : scaleSzie(400);
            const discountByStaff = (100 - this.state.discountByOwner)

            const stylePercentText = this.state.manualTypeSelect == manualType.percentType 
            ? styles.colorSelectedText : styles.colorUnselectedText
            const stylePercentButton = this.state.manualTypeSelect == manualType.percentType 
            ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected

            const styleFixText = this.state.manualTypeSelect == manualType.fixAmountType 
            ? styles.colorSelectedText : styles.colorUnselectedText
            const styleFixButton = this.state.manualTypeSelect == manualType.fixAmountType 
            ? styles.backgroundButtonSelected : styles.backgroundButtonUnSelected
            return (
                <PopupParent
                    title={title}
                    visible={visible}
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
                                keyboardShouldPersistTaps="always" >
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
                                            title={promo?.merchantPromotion?.name}
                                            discount={promo?.discount}
                                        />
                                        )
                                    }
                                    <View style={{ height: scaleSzie(10) }} />
                                    {/* ----------- Row 1 ----------- */}
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
                                                    <Text style={{ color: '#4CD964', fontSize: scaleSzie(18) }} >
                                                        {`$ ${formatMoney(roundNumber(this.state.discount))}`}
                                                    </Text>
                                                </View>
                                                    
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
                                            height: scaleSzie(40), borderColor: "#DDDDDD", borderWidth: 2, borderRadius: 4, paddingVertical: 5,
                                            paddingHorizontal: scaleSzie(10)
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
                            flexDirection: 'row', height: scaleSzie(40),
                            paddingHorizontal: scaleSzie(25)
                        }} >
                            <View style={{ flex: 1, justifyContent: 'center' }} >
                                <Text style={{ color: '#404040', fontSize: scaleSzie(18), fontWeight: 'bold' }} >
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
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: scaleSzie(12) }} >
                            <ButtonCustom
                                width={scaleSzie(160)}
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
        const { visibleModalDiscount, groupAppointment, isGetPromotionOfAppointment, promotionNotes } = this.props;
        const visible = visibleModalDiscount && !_.isEmpty(groupAppointment) ? true : false;
        if (prevProps.isGetPromotionOfAppointment !== isGetPromotionOfAppointment && isGetPromotionOfAppointment === "success" && visible) {
            this.props.actions.marketing.resetStateGetPromotionOfAppointment();
            await this.setState({
                promotionNotes: promotionNotes.note ? promotionNotes.note : "",
            });

        }
    }

}

const ItemCampaign = ({ title, discount }) => {

    return (
        <View style={{
            flexDirection: 'row', height: scaleSzie(35)
        }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(16) }} >
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
        const { total, customDiscountPercent, customDiscountFixed } = this.props;
        const percent = customDiscountPercent ? customDiscountPercent : 0;
        const fixedAmount = customDiscountFixed ? customDiscountFixed: 0
        const type = customDiscountFixed && customDiscountFixed > 0 ? manualType.fixAmountType : manualType.percentType
        const discountTemp = type == manualType.fixAmountType ? customDiscountFixed 
                            : roundNumber((formatNumberFromCurrency(percent) * formatNumberFromCurrency(total) / 100))
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
                percent: textNumber,
                fixedAmount: 0,
            });

            this.props.onChangeText(this.state.manualTypeSelect, discount, textNumber);
        }else{
            await this.setState({
                discount,
                fixedAmount: textNumber,
                percent: 0,
            });

            this.props.onChangeText(this.state.manualTypeSelect, discount, 0);
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
                            <Text style={{ color: '#4CD964', fontSize: scaleSzie(18) }} >
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
        fontSize: scaleSzie(16)
    },
    discountTypeButton:{
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.BROWNISH_GREY,
        justifyContent:'center',
        height: scaleSzie(35),
        width: scaleSzie(35),
    },
    discountManualText:{
        color:'#000',
        textAlign:'center',
        fontSize: scaleSzie(16),
    },
    viewGroupRow:{
        flexDirection: 'row',
    
    },
    textInputView: {
        width: scaleSzie(120), 
        height: scaleSzie(35),
        borderColor: '#707070', 
        borderWidth: 1, marginLeft: scaleSzie(20), 
        borderRadius: scaleSzie(4),
        flexDirection: 'row'
    },
    greenText: { 
        color: '#4CD964', 
        fontSize: scaleSzie(18) 
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
})



export default connectRedux(mapStateToProps, PopupDiscount);

