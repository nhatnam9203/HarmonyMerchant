import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import { Button } from '@components';
import { ScaleSzie, formatWithMoment } from '@utils';

class ItemInvoice extends React.Component {

    getColorStatus(status) {
        let color = '';
        switch (status) {
            case 'paid':
                color = '#4CD964';
                break;
            case 'pending':
                color = '#0764B0';
                break;
            case 'incomplete':
                color = '#0764B0';
                break;
            case 'complete':
                color = '#0035FF';
                break;
            case 'transaction fail':
                color = '#FF3B30';
                break;
            default:
                color = '#C5C5C5';
        }
        return color;
    }


    render() {
        const { invoice, onPress, isSelectedInvoice } = this.props;
        const { user } = invoice;
        const tempDate = `${formatWithMoment(invoice.createdDate, 'MM/DD/YYYY')}` === `${formatWithMoment(new Date(), 'MM/DD/YYYY')}` ? 'Today' : formatWithMoment(invoice.createdDate, 'MM/DD/YYYY');
        const temptFirstName = user ? user.firstName : '';
        const temptLastName = user ? user.lastName : '';
        const colorStaus = this.getColorStatus(invoice?.status);
        const temptBackground = isSelectedInvoice ? { backgroundColor: 'rgb(225,246,254)' } : {};
        const settlementId = invoice.settlementId ? invoice.settlementId : 0;

        return (
            <Button onPress={() => onPress()} style={[{
                height: ScaleSzie(62), paddingHorizontal: ScaleSzie(10),
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                backgroundColor: '#FAFAFA',
                flexDirection: "row"
            }, temptBackground]} >
                {/* ----------- Col 1 --------- */}
                <View style={{ flex:2}} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: ScaleSzie(14), color: '#404040' }} >
                            {`${temptFirstName} ${temptLastName}`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: ScaleSzie(14), color: '#6A6A6A', marginRight: ScaleSzie(20) }} >
                            {`# ${invoice.code}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorStaus }} />
                        <Text style={{ fontSize: ScaleSzie(11), color: colorStaus, marginLeft: ScaleSzie(5),fontWeight:"600" }} >
                            {invoice.status}
                        </Text>

                    </View>
                </View>
                {/* ----------- Col 2 --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: ScaleSzie(14), color: '#6A6A6A' }} >
                            {tempDate}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', }} >
                        <Text style={{ fontSize: ScaleSzie(14), color: '#6A6A6A', fontWeight: "bold" }} >
                            {`${formatWithMoment(invoice.createdDate, 'hh:mm A')}`}
                        </Text>
                    </View>
                </View>
                {/* ----------- Col 3 --------- */}
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'flex-end' }} >
                    {
                        settlementId ? <Text style={{ fontSize: ScaleSzie(12), color: '#404040', fontWeight: "400", marginBottom: ScaleSzie(2) }} >
                            {`Batch ID: #${settlementId}`}
                        </Text> : null
                    }

                    <Text style={{ fontSize: ScaleSzie(14), color: '#404040', fontWeight: "600" }} >
                        {`$ ${invoice.total}`}
                    </Text>
                </View>
            </Button>

        );
    }

}


export default ItemInvoice;

