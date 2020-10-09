import React from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import { ButtonCustom, PopupParent, PopupConfirm } from '@components';
import { scaleSzie, localize, getCategoryName, formatMoney } from '@utils';
import connectRedux from '@redux/ConnectRedux';


const { width } = Dimensions.get("window");

class PopupPaymentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    nextPayment = () => {
        this.props.actions.appointment.closePopupPaymentDetail();
    }


    // ---------- Render --------

    render() {
        const { title, visible, onRequestClose, language, nextPayment, paymentDetailInfo } = this.props;
        const paidAmounts = paymentDetailInfo.paidAmounts && paymentDetailInfo.paidAmounts.length > 0 ? paymentDetailInfo.paidAmounts[0] : {};
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                width={500}
                hideCloseButton={true}
            >
                <View style={{
                    height: scaleSzie(400), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(50)
                }} >
                    <View style={{ flex: 1 }} >
                        <View style={{ height: scaleSzie(15) }} />
                        {/* ---- start ---- */}
                        <ItemDetail
                            title={`${localize('Invoice No', language)}:`}
                            value={`# ${paymentDetailInfo.invoiceNo ? paymentDetailInfo.invoiceNo : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Customer Name', language)}:`}
                            value={`${paymentDetailInfo.customerName ? paymentDetailInfo.customerName : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Phone Number', language)}:`}
                            value={`${paymentDetailInfo.phone ? paymentDetailInfo.phone : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Status', language)}:`}
                            value={`${paymentDetailInfo.status ? paymentDetailInfo.status : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Grand Total', language)}:`}
                            value={`$ ${paymentDetailInfo.grandTotal ? formatMoney(paymentDetailInfo.grandTotal) : ''}`}
                            isBold={true}
                            subText={""}
                        />
                        <View style={{ height: 3, backgroundColor: "rgb(238,238,238)", marginVertical: scaleSzie(10) }} />
                        <ItemDetail
                            title={`${localize('Paid', language)} (${paidAmounts.paymentMethod ? paidAmounts.paymentMethod : ''}):`}
                            value={`$ ${paidAmounts.amount ? formatMoney(paidAmounts.amount) : ''}`}
                            isBold={true}
                            subText={``}
                        />
                        <ItemDetail
                            title={`${localize('Amount Due', language)}:`}
                            value={`$ ${paymentDetailInfo.dueAmount ? formatMoney(paymentDetailInfo.dueAmount) : ''}`}
                            isBold={true}
                            subText={""}
                            style={{
                                color: "#FF3B30"
                            }}
                        />
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(60), flexDirection: 'row', justifyContent: 'space-evenly' }} >
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#0764B0"
                            title={localize('Next', language)}
                            textColor="#fff"
                            onPress={this.nextPayment}
                            style={{
                                borderRadius: scaleSzie(4),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: scaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }
}

const ItemDetail = ({ title, value, isBold, subText, style }) => {
    const temptWeight = isBold ? "bold" : "500";
    return (
        <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textCommon, style]} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1.1, justifyContent: 'center' }} >
                <Text style={[styles.textValue, { fontWeight: temptWeight }, style]} >
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
        fontSize: scaleSzie(18)

    }
})

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paymentDetailInfo: state.appointment.paymentDetailInfo,
});

export default connectRedux(mapStateToProps, PopupPaymentDetails);


