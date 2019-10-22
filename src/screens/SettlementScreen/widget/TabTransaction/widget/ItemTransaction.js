import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';
import moment from 'moment';

import { scaleSzie } from '@utils';
import { Text } from '@components';
import IMAGE from '@resources';

function getNameLogo(type) {
    let logoName = '';
    switch (type) {
        case 'Pax':
            logoName = 'paxLogo';
            break;
        case 'Pax':
            logoName = 'paxLogo';
            break;
        case 'Pax':
            logoName = 'paxLogo';
            break;
        case 'Pax':
            logoName = 'paxLogo';
            break;
        case 'Pax':
            logoName = 'paxLogo';
            break;

    }
}

const ItemTransaction = (props) => {
    const { data } = props;
    const logoPayment = data.paymentData.method
    return (
        <View style={{
            height: scaleSzie(60), backgroundColor: '#FAFAFA',
            borderBottomColor: '#C5C5C5', borderBottomWidth: 1, flexDirection: 'row'
        }} >
            {/* --------- Col 1 --------- */}
            <View style={{ width: scaleSzie(150), justifyContent: 'center', paddingRight: scaleSzie(10) }} >
                <Text style={[styles.textHeaderContent, { marginLeft: scaleSzie(10) }]}
                    numberOfLines={1}
                >
                    {`#${data.paymentData.transaction_id}`}
                </Text>
            </View>
            {/* --------- Col 2 --------- */}
            <View style={{ width: scaleSzie(130), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {moment(data.createdDate).format('MM/DD/YYYY')}
                </Text>
                <Text style={styles.textHeaderContent} >
                    {moment(data.createdDate).format('h:mm A')}
                </Text>

            </View>
            {/* --------- Col 3 --------- */}
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {`#${data.checkoutId}`}
                </Text>
            </View>
            {/* --------- Col 4 --------- */}
            <View style={{ width: scaleSzie(110), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {data.status}
                </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ width: scaleSzie(130), alignItems: 'center', flexDirection: 'row' }} >
                {
                    data.paymentData.card_type === 'Mastercard' ? <Image source={IMAGE.masterCardLogo}
                        style={{ width: scaleSzie(30), height: scaleSzie(20) }}
                    /> : <Image source={IMAGE.visaLogo} style={{ width: scaleSzie(30), height: scaleSzie(20) }} />
                }
                <View style={{ width: 10 }} />
                <Text style={styles.textHeaderContent} >
                    {data.paymentData.card_number}
                </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    {`${data.amount} $`}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textHeaderContent: {
        color: '#404040',
        fontSize: scaleSzie(14)
    },
});

export default ItemTransaction;