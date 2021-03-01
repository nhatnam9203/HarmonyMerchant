import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Keyboard
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { ButtonCustom, PopupParent } from '@components';
import { scaleSzie, localize, formatMoney, formatNumberFromCurrency } from '@utils';
import connectRedux from '@redux/ConnectRedux';


const { width } = Dimensions.get("window");

class PopupGiftCardDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: 0.00,
            dueAmountGiftCardPayment: 0.00
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide);
    }

    keyboardDidHide = async () => {
        if (this.scrollRef.current) {
            this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }
    }

    nextPayment = () => {
        this.props.actions.appointment.closePopupPaymentDetail();
    }

    onScroll = () => {
        this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(200), animated: true });
    }

    cancelPayment = () => {
        this.props.cancelGiftCardPayment();
    }

    getAmountEnter(amount) {
        if (`${amount}`.indexOf("$") !== -1) {
            const tempAmount = (`${amount}`.trim()).split("$ ");
            return formatNumberFromCurrency(tempAmount[1]);
        }

        return formatNumberFromCurrency(amount);
    }

    payGiftCardPayment = () => {
        const { giftcardPaymentInfo,groupAppointment } = this.props
        const { dueAmountGiftCardPayment, amount } = this.state;

        if (this.getAmountEnter(amount) > formatNumberFromCurrency(giftcardPaymentInfo.amount)) {
            alert("Enter amount is not bigger than the value of gift card!")
        } else if (this.getAmountEnter(amount) === 0) {
            alert("Pay amount is not equal 0!")
        } else {
            if (formatNumberFromCurrency(dueAmountGiftCardPayment) < 0) {
                alert("Enter amount is not bigger than the charge amount!")
            } else {
                const checkoutGroupId = groupAppointment?.checkoutGroupId || 0;
                const giftCardId =  giftcardPaymentInfo?.giftCardId || 0;
                this.props.cancelGiftCardPayment();
                setTimeout(() =>{
                    this.props.actions.appointment.paymentAppointment(checkoutGroupId, "giftcard", formatNumberFromCurrency(amount),false,-1,giftCardId);
                },300)
               
                
            }
        }
    }

    changeAmountPayment = (amount) => {
        const { paymentDetailInfo } = this.props;
        const dueAmount = paymentDetailInfo.dueAmount ? paymentDetailInfo.dueAmount : 0;

        this.setState({
            amount,
            dueAmountGiftCardPayment: formatMoney(formatNumberFromCurrency(dueAmount) - formatNumberFromCurrency(amount))
        })
    }

    // ---------- Render --------
    render() {
        const { title, visiblePopupGiftCardDetails, onRequestClose, language, giftcardPaymentInfo, paymentDetailInfo } = this.props;
        const { amount, dueAmountGiftCardPayment } = this.state;
        const dueAmount = paymentDetailInfo?.dueAmount || 0;

        return (
            <PopupParent
                title={title}
                visible={visiblePopupGiftCardDetails}
                onRequestClose={() => onRequestClose()}
                width={500}
                hideCloseButton={true}
            >
                <View style={{
                    height: scaleSzie(410), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                }} >
                    <View style={{ flex: 1 }} >
                        <ScrollView
                            ref={this.scrollRef}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='always'
                        >
                            <View style={{ height: scaleSzie(15) }} />
                            <View style={{ paddingHorizontal: scaleSzie(30) }} >

                                {/* ---- start ---- */}
                                <ItemDetail
                                    title={`${localize('Serial number', language)}:`}
                                    value={`# ${giftcardPaymentInfo.serialNumber ? giftcardPaymentInfo.serialNumber : ''}`}
                                    subText={""}
                                />
                                <ItemDetail
                                    title={`${localize('Amount', language)}:`}
                                    value={`$ ${giftcardPaymentInfo.amount ? giftcardPaymentInfo.amount : ''}`}
                                    subText={""}
                                />
                                <View style={{ height: 3, backgroundColor: "rgb(238,238,238)", marginVertical: scaleSzie(10) }} />
                                <ItemDetail
                                    title={`${localize('Payment details', language)}`}
                                    value={``}
                                    subText={""}
                                    style={{
                                        fontWeight: "bold"
                                    }}
                                />
                                <ItemDetail
                                    title={`${localize('Charge amount', language)}:`}
                                    value={`$ ${dueAmount}`}
                                    subText={""}
                                    styleValue={{
                                        fontWeight: "bold"
                                    }}
                                    styleValueContent={{
                                        alignItems: "flex-end",
                                        paddingRight: scaleSzie(10)
                                    }}
                                />
                                {/* --------------- */}
                                <View style={{ height: scaleSzie(45), flexDirection: 'row' }} >
                                    <View style={{ flex: 1, justifyContent: 'center' }} >
                                        <Text style={[styles.textCommon]} >
                                            {`${localize('Pay amount', language)}:`}
                                        </Text>
                                    </View>
                                    <View style={[{
                                        flex: 1.1, borderColor: "#DDDDDD", borderWidth: 1, paddingRight: scaleSzie(9)
                                    }]} >

                                        <TextInputMask
                                            type={'money'}
                                            options={{
                                                precision: 2,
                                                separator: '.',
                                                delimiter: ',',
                                                unit: '$ ',
                                                suffixUnit: '',
                                            }}
                                            style={{
                                                flex: 1,
                                                textAlign: "right",
                                                padding: 0, color: 'rgb(73,73,73)',
                                                fontSize: scaleSzie(18), fontWeight: "bold",
                                            }}
                                            placeholder="$ 0.00"
                                            value={amount}
                                            onChangeText={this.changeAmountPayment}
                                            onFocus={this.onScroll}
                                        />
                                    </View>
                                </View>
                                {/* --------- New Code --------- */}

                                <ItemDetail
                                    title={`${localize('Amount Due', language)}:`}
                                    value={`$ ${dueAmountGiftCardPayment}`}
                                    isBold={true}
                                    subText={""}
                                    style={{
                                        color: "#FF3B30"
                                    }}
                                    styleValueContent={{
                                        alignItems: "flex-end",
                                        paddingRight: scaleSzie(10)
                                    }}
                                    styleValue={{
                                        fontWeight: "bold"
                                    }}
                                />
                            </View>
                            <View style={{ height: 3, backgroundColor: "rgb(238,238,238)", marginVertical: scaleSzie(10) }} />
                            <View style={{ height: scaleSzie(190) }} />
                        </ScrollView>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{
                        height: scaleSzie(70), flexDirection: 'row',
                        justifyContent: "space-between", paddingHorizontal: scaleSzie(50)
                    }} >
                        <ButtonCustom
                            width={250}
                            height={50}
                            backgroundColor="#F1F1F1"
                            title={localize('CANCEL', language)}
                            textColor="#404040"
                            onPress={this.cancelPayment}
                            style={{
                                borderRadius: scaleSzie(2),
                                borderColor: '#CCCCCC',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: scaleSzie(21),
                                fontWeight: '400'
                            }}
                        />

                        <ButtonCustom
                            width={250}
                            height={50}
                            backgroundColor="#0764B0"
                            title={localize('PAY', language)}
                            textColor="#fff"
                            onPress={this.payGiftCardPayment}
                            style={{
                                borderRadius: scaleSzie(2),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: scaleSzie(21),
                                fontWeight: '400'
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { visiblePopupGiftCardDetails, giftcardPaymentInfo, paymentDetailInfo } = this.props;
        if (visiblePopupGiftCardDetails && prevProps.visiblePopupGiftCardDetails !== visiblePopupGiftCardDetails) {

            const dueAmount = paymentDetailInfo.dueAmount ? paymentDetailInfo.dueAmount : 0;
            const tempDueAmount = formatMoney(formatNumberFromCurrency(dueAmount) - this.getAmountEnter(giftcardPaymentInfo.amount));

            this.setState({
                amount: tempDueAmount >= 0 ? giftcardPaymentInfo.amount : dueAmount,
            }, () => {
                this.setState({
                    dueAmountGiftCardPayment: formatMoney(formatNumberFromCurrency(dueAmount) - formatNumberFromCurrency(this.state.amount))
                });
            })
        }
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }


}

const ItemDetail = ({ title, value, isBold, subText, style, styleValueContent, styleValue }) => {
    const temptWeight = isBold ? "bold" : "500";
    return (
        <View style={{ height: scaleSzie(45), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textCommon, style]} >
                    {title}
                </Text>
            </View>
            <View style={[{ flex: 1.1, justifyContent: 'center' }, styleValueContent]} >
                <Text style={[styles.textValue, { fontWeight: temptWeight }, style, styleValue]} >
                    {value}
                    <Text style={[styles.textCommon, { fontWeight: "400" }, style]} >
                        {subText}
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCommon: {
        color: 'rgb(73,73,73)',
        fontSize: scaleSzie(18)
    },
    textValue: {
        color: 'rgb(73,73,73)',
        fontSize: scaleSzie(18),
    }
})

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paymentDetailInfo: state.appointment.paymentDetailInfo,
    giftcardPaymentInfo: state.appointment.giftcardPaymentInfo,
    visiblePopupGiftCardDetails: state.appointment.visiblePopupGiftCardDetails,
    groupAppointment: state.appointment.groupAppointment
});

export default connectRedux(mapStateToProps, PopupGiftCardDetail);


