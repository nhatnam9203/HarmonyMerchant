import React from 'react';
import {
    View,
    Text,
} from 'react-native';

import { Button } from '@components';
import { scaleSzie, formatWithMoment } from '@utils';

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
            case 'complete':
                color = '#0035FF';
                break;
            default:
                color = '#C5C5C5';
        }
        return color;
    }


    render() {
        const { invoice, onPress , isSelectedInvoice} = this.props;
        const { user } = invoice;
        const tempDate = `${formatWithMoment(invoice.createdDate, 'MM/DD/YYYY')}` === `${formatWithMoment(new Date(), 'MM/DD/YYYY')}` ? 'Today' : formatWithMoment(invoice.createdDate, 'MM/DD/YYYY');
        const temptFirstName = user ? user.firstName : '';
        const temptLastName = user ? user.lastName : '';
        const colorStaus = this.getColorStatus(invoice.status);
        const temptBackground = isSelectedInvoice ? { backgroundColor: 'rgb(225,246,254)' } : {};
        const settlementId = invoice.settlementId ? invoice.settlementId : 0;

        return (
            <Button onPress={() => onPress()} style={[{
                height: scaleSzie(62), paddingHorizontal: scaleSzie(10),
                borderBottomColor: '#C5C5C5', borderBottomWidth: 1,
                backgroundColor: '#FAFAFA',
                flexDirection: "row"
            }, temptBackground]} >
                {/* ----------- Col 1 --------- */}
                <View style={{ flex: 1.7 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#404040' }} >
                            {`${temptFirstName} ${temptLastName}`}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', marginRight: scaleSzie(20) }} >
                            {`# ${invoice.code}`}
                        </Text>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colorStaus }} />
                        <Text style={{ fontSize: scaleSzie(14), color: colorStaus, marginLeft: scaleSzie(5) }} >
                            {invoice.status}
                        </Text>

                    </View>
                </View>
                {/* ----------- Col 2 --------- */}
                <View style={{ flex: 1 }} >
                    <View style={{ flex: 1, justifyContent: 'center' }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A' }} >
                            {tempDate}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', }} >
                        <Text style={{ fontSize: scaleSzie(14), color: '#6A6A6A', fontWeight: "bold" }} >
                            {`${formatWithMoment(invoice.createdDate, 'hh:mm A')}`}
                        </Text>
                    </View>
                </View>
                {/* ----------- Col 3 --------- */}
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'flex-end' }} >
                    {
                        settlementId ? <Text style={{ fontSize: scaleSzie(12), color: '#404040', fontWeight: "400", marginBottom: scaleSzie(2) }} >
                            {`Batch ID: #${settlementId}`}
                        </Text> : null
                    }

                    <Text style={{ fontSize: scaleSzie(14), color: '#404040', fontWeight: "600" }} >
                        {`$ ${invoice.total}`}
                    </Text>
                </View>
            </Button>

        );
    }

}


export default ItemInvoice;

