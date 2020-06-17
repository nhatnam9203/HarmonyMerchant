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
import { scaleSzie, formatWithMoment} from '@utils';


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
                createdBy:'',
                modifiedBy:'',
                user:{
                    firstName:'',
                    lastName:''
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
        const { title, visible, onRequestClose, language,confirmChangeInvoiceStatus } = this.props;
        const {invoiceDetail}= this.state;
        const temptStatus =  invoiceDetail.status === 'paid' ? 'Refund' : 'VOID';
        return (
            <PopupParent
                title={title}
                visible={visible}
                onRequestClose={() => onRequestClose()}
                style={{ justifyContent: 'flex-start', paddingTop: scaleSzie(20) }}
            >
                <View style={{
                    height: scaleSzie(480), backgroundColor: '#fff',
                    borderBottomLeftRadius: scaleSzie(15),
                    borderBottomRightRadius: scaleSzie(15),
                    paddingHorizontal: scaleSzie(30)
                }} >
                    <View style={{ flex: 1 }} >
                        <View style={{ alignItems: 'center', marginTop: scaleSzie(12), marginBottom: scaleSzie(20) }} >
                            <Text style={{ color: '#000', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                              {`Please confirm you want to ${temptStatus}`}
                            </Text>
                            <Text style={{ color: '#000', fontSize: scaleSzie(20), fontWeight: 'bold' }} >
                                this invoice!
                            </Text>
                        </View>
                        <Text style={{ color: '#000', fontSize: scaleSzie(20), textAlign: 'center', }} >
                            INVOICE DETAIL
                        </Text>
                        {/* ----------- Line --------- */}
                        <View style={{ paddingHorizontal: scaleSzie(20), height: scaleSzie(1.5), marginTop: scaleSzie(16) }} >
                            <View style={{ flex: 1, backgroundColor: 'rgb(186,186,186)' }} />
                        </View>
                        {/* ---------- Body ----------- */}
                        <View style={{ flex: 1, paddingHorizontal: scaleSzie(20) }} >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                <TouchableOpacity activeOpacity={1}>
                                    <View style={{ height: scaleSzie(10) }} />
                                    <ItemDetail
                                        title={'Invoice No:'}
                                        value={invoiceDetail.checkoutId ? `# ${invoiceDetail.checkoutId}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Customer Name:'}
                                        value={invoiceDetail.user ? `${invoiceDetail.user.firstName} ${invoiceDetail.user.lastName}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Phone Number:'}
                                        value={invoiceDetail.user ? `${invoiceDetail.user.phone}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Date:'}
                                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate,'MM/DD/YYYY')}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Time:'}
                                        value={invoiceDetail.createdDate ? `${formatWithMoment(invoiceDetail.createdDate,'hh:mm A')}` : ''}
                                    />
                                    <ItemDetail
                                        title={'Status:'}
                                        value={invoiceDetail.status ? invoiceDetail.status : ''}
                                    />
                                    <ItemDetail
                                        title={'Payment Method:'}
                                        value={invoiceDetail.paymentMethod ? invoiceDetail.paymentMethod : ''}
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
                                        value={invoiceDetail.modifiedBy ? invoiceDetail.modifiedBy : ''}
                                    />
                                    <View style={{ height: scaleSzie(200) }} />
                                </TouchableOpacity>
                            </ScrollView>

                        </View>
                    </View>
                    {/* ---- Footer ---- */}
                    <View style={{ height: scaleSzie(60), flexDirection: 'row', justifyContent: 'space-evenly' }} >
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#0764B0"
                            title={'YES'}
                            textColor="#fff"
                            onPress={() =>confirmChangeInvoiceStatus() }
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
                        <ButtonCustom
                            width={200}
                            height={45}
                            backgroundColor="#F1F1F1"
                            title={'NO'}
                            textColor="#6A6A6A"
                            onPress={() => onRequestClose()}
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

const ItemDetail = ({ title, value }) => {
    return (
        <View style={{ height: scaleSzie(26), flexDirection: 'row' }} >
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textCommon} >
                    {title}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textValue, { fontWeight: '600' }]} >
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCommon: {
        color: '#707070',
        fontSize: scaleSzie(16)
    },
    textValue: {
        color: '#404040',
        fontSize: scaleSzie(18)
    }
})

export default PopupConfirmInvoiceStatus;


