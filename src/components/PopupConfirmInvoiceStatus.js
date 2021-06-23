import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { ScaleSzie, formatWithMoment,getPaymentString ,checkIsTablet} from '@utils';


class PopupConfirmInvoiceStatus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceDetail: {
                checkoutId: 1484,
                userId: 5,
                merchantId: 136,
                status: "pending",
                appointmentId: 4548,
                paymentTransactionId: 0,
                paymentMethod: "harmony",
                total: "62.70",
                createdDate: "2019-10-16T16:31:44.828388+07:00",
                isSettlement: 0,
                createdById: 0,
                modifiedById: 0,
                createdBy: '',
                modifiedBy: '',
                user: {
                    firstName: '',
                    lastName: ''
                }
            }
        }
    }

    setStateFromParent = async (invoiceDetail) => {
        await this.setState({
            invoiceDetail
        })
    }


    // ---------- Render --------

    render() {
        const { title, visible, onRequestClose, language, confirmChangeInvoiceStatus, profileLoginInvoice } = this.props;
        const { invoiceDetail } = this.state;
        const temptStatus = invoiceDetail.status === 'paid' ? 'Refund' : 'VOID';
        const tempHeight = checkIsTablet() ? ScaleSzie(360) : ScaleSzie(480);

        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: ScaleSzie(20) }}
            >
                <View style={{
                    height: tempHeight, backgroundColor: '#fff',
                    borderBottomLeftRadius: ScaleSzie(15),
                    borderBottomRightRadius: ScaleSzie(15),
                    paddingHorizontal: ScaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <View style={{ alignItems: 'center', marginTop: ScaleSzie(12), marginBottom: ScaleSzie(20) }} >
                            <Text style={{ color: '#000', fontSize: ScaleSzie(20), fontWeight: 'bold' }} >
                                {`Please confirm you want to ${temptStatus}`}
                            </Text>
                            <Text style={{ color: '#000', fontSize: ScaleSzie(20), fontWeight: 'bold' }} >
                                {`this invoice!`}
                            </Text>
                        </View>
                        <Text style={{ color: '#000', fontSize: ScaleSzie(20), textAlign: 'center', }} >
                            INVOICE DETAIL
                        </Text>
                        {/* ----------- Line --------- */}
                        <View style={{ paddingHorizontal: ScaleSzie(0), height: ScaleSzie(1.5), marginTop: ScaleSzie(16) }} >
                            <View style={{ flex: 1, backgroundColor: 'rgb(186,186,186)' }} />
                        </View>
                        {/* ---------- Body ----------- */}
                        <View style={{ flex: 1, paddingHorizontal: ScaleSzie(0) }} >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="always"
                            >
                                <TouchableOpacity activeOpacity={1}>
                                    <View style={{ height: ScaleSzie(10) }} />
                                    <ItemDetail
                                        title={'Invoice No:'}
                                        value={invoiceDetail.checkoutId ? `# ${invoiceDetail.checkoutId}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Customer Name:'}
                                        value={invoiceDetail.user ? `${invoiceDetail.user.firstName} ${invoiceDetail.user.lastName}` : ''}
                                        // valueStyle={{fontSize:ScaleSzie(14)}}
                                    />
                                    <ItemDetail
                                        title={'Phone Number:'}
                                        value={invoiceDetail.user ? `${invoiceDetail.user.phone}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Date:'}
                                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate, 'MM/DD/YYYY')}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Time:'}
                                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate, 'hh:mm A')}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Status:'}
                                        value={invoiceDetail.status ? invoiceDetail.status : ''}
                                    />
                                    <ItemDetail
                                        title={'Payment Method:'}
                                        value={invoiceDetail.paymentMethod ?getPaymentString(invoiceDetail.paymentMethod) : ''}
                                    />
                                    <ItemDetail
                                        title={'Total Amount:'}
                                        value={invoiceDetail.total ? `$ ${invoiceDetail.total}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Created By:'}
                                        value={invoiceDetail.createdBy ? invoiceDetail.createdBy : ''}
                                    />
                                    <ItemDetail
                                        title={'Modified By:'}
                                        value={profileLoginInvoice && profileLoginInvoice.displayName ? profileLoginInvoice.displayName : ''}
                                    />
                                    <View style={{ height: ScaleSzie(200) }} />
                                </TouchableOpacity>
                            </ScrollView>

                        </View>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: ScaleSzie(60), flexDirection: 'row', justifyContent: 'space-evenly' }} >
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#0764B0"
                            title={'YES'}
                            textColor="#fff"
                            onPress={() => confirmChangeInvoiceStatus()}
                            style={{
                                borderRadius: ScaleSzie(4),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: ScaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#F1F1F1"
                            title={'NO'}
                            textColor="#6A6A6A"
                            onPress={() => onRequestClose()}
                            style={{
                                borderRadius: ScaleSzie(4),
                                borderColor: '#C5C5C5',
                                borderWidth: 1,
                            }}
                            styleText={{
                                fontSize: ScaleSzie(16),
                                fontWeight: '500'
                            }}
                        />
                    </View>
                </View>
            </PopupParent>
        );
    }
}

const ItemDetail = ({ title, value,titleStyle,valueStyle }) => {
    return (
        <View style={{ height: ScaleSzie(26), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textCommon,titleStyle]} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textValue, { fontWeight: '500' },valueStyle]} >
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCommon: {
        color: '#707070',
        fontSize: ScaleSzie(15)
    },
    textValue: {
        color: '#404040',
        fontSize: ScaleSzie(16)
    }
})

export default PopupConfirmInvoiceStatus;


