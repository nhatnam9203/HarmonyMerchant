import React from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';

import { scaleSize, formatWithMoment ,getCredicardIcon} from '@utils';
import { Text } from '@components';
import ICON from '@resources';


const ItemTransaction = (props) => {
    const { data } = props;
    const cardType = data.paymentData && data.paymentData.card_type ? data.paymentData.card_type : "";
    const creditCardLogo = getCredicardIcon(`${cardType}`.toLowerCase());
    const transactionType = data.paymentData && data.paymentData.transaction_type ? `${data.paymentData.transaction_type}`.toUpperCase() : "";

    return (
        <View style={{
            height: scaleSize(60), backgroundColor: '#FAFAFA',
            borderBottomColor: '#C5C5C5', borderBottomWidth: 1, flexDirection: 'row'
        }} >
            {/* --------- Col 1 --------- */}
            <View style={{
                width: scaleSize(100), justifyContent: 'center', paddingRight: scaleSize(10),
            }} >
                <Text style={[styles.textHeaderContent, { marginLeft: scaleSize(10), }]}
                    numberOfLines={1}
                >
                    {`# ${data.SettlementId}`}
                </Text>
            </View>
            {/* --------- Col 2 --------- */}
            <View style={{ width: scaleSize(110), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {formatWithMoment(data.createdDate, 'MM/DD/YYYY')}
                </Text>
                <Text style={styles.textHeaderContent} >
                    {formatWithMoment(data.createdDate, 'hh:mm A')}
                </Text>

            </View>
            {/* --------- Col 3 --------- */}
            <View style={{ width: scaleSize(130), justifyContent: 'center' }} >
                <Text style={[styles.textHeaderContent, { fontWeight: "600" }]} >
                    {`# ${data.checkoutId}`}
                </Text>
            </View>
            {/* --------- Col 4 --------- */}
            <View style={{ width: scaleSize(90), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {data.status}
                </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ width: scaleSize(110), alignItems: 'center', flexDirection: 'row' }} >
                <Image source={creditCardLogo} style={{ width: scaleSize(30), height: scaleSize(20) }} />
                <View style={{ width: 10 }} />
                <Text style={styles.textHeaderContent} >
                    {data.paymentData.card_number}
                </Text>
            </View>
             {/* --------- Col 6 --------- */}
             <View style={{ width: scaleSize(90), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {transactionType}
                </Text>
            </View>
            {/* --------- Col 7 --------- */}
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={[styles.textHeaderContent, { fontWeight: "600" }]} >
                    {`$ ${data.amount}`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textHeaderContent: {
        color: '#404040',
        fontSize: scaleSize(12)
    },
});

export default ItemTransaction;