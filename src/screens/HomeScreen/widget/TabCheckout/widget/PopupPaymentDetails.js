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
import { scaleSzie, localize, getCategoryName } from '@utils';
import connectRedux from '@redux/ConnectRedux';


const { width } = Dimensions.get("window");

class PopupPaymentDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    nextPayment =() =>{
       this.props.actions.appointment.closePopupPaymentDetail();
    }


    // ---------- Render --------

    render() {
        const { title, visible, onRequestClose, language, nextPayment,paymentDetilInfo } = this.props;
        const paidAmounts = paymentDetilInfo.paidAmounts && paymentDetilInfo.paidAmounts.length > 0 ?  paymentDetilInfo.paidAmounts[0] : {} ;
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
                            value={`# ${paymentDetilInfo.checkoutGropId ? paymentDetilInfo.checkoutGropId : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Customer Name', language)}:`}
                            value={`${paymentDetilInfo.customerName ?paymentDetilInfo.customerName : '' }`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Phone Number', language)}:`}
                            value={`${paymentDetilInfo.phone ? paymentDetilInfo.phone  : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Status', language)}:`}
                            value={`${paymentDetilInfo.status ? paymentDetilInfo.status  : ''}`}
                            subText={""}
                        />
                        <ItemDetail
                            title={`${localize('Grand Total', language)}:`}
                            value={`$ ${paymentDetilInfo.grandTotal ? paymentDetilInfo.grandTotal  : ''}`}
                            isBold={true}
                            subText={""}
                        />
                        <View style={{ height: 3, backgroundColor: "rgb(238,238,238)", marginVertical: scaleSzie(10) }} />
                        <ItemDetail
                            title={`${localize('Paid Amount', language)}:`}
                            value={`$ ${paidAmounts.amount ? paidAmounts.amount  : ''}`}
                            isBold={true}
                            subText={` (${paidAmounts.paymentMethod ? paidAmounts.paymentMethod  : ''})`}
                        />
                        <ItemDetail
                            title={`${localize('Due Amount', language)}:`}
                            value={`$ ${paymentDetilInfo.dueAmount ? paymentDetilInfo.dueAmount  : ''}`}
                            isBold={true}
                            subText={""}
                        />

                        {/* -----  */}
                        <TouchableOpacity activeOpacity={1} style={{ height: scaleSzie(250), }} />
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

const ItemDetail = ({ title, value, isBold, subText }) => {
    const temptWeight = isBold ? "bold" : "500";
    return (
        <View style={{ height: scaleSzie(40), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textCommon} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1.1, justifyContent: 'center' }} >
                <Text style={[styles.textValue, { fontWeight: temptWeight }]} >
                    {value}
                    <Text style={[styles.textCommon, { fontWeight: "400" }]} >
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
    paymentDetilInfo: state.appointment.paymentDetilInfo,
});

export default connectRedux(mapStateToProps, PopupPaymentDetails);

// export default PopupPaymentDetails;


