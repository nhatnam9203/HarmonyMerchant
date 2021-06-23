import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';

import { scaleSize, localize } from '@utils';
import { Text } from '@components';
import IMAGE from '@resources';

const HeaderTableTransaction = ({ language }) => {
    return (
        <View style={styles.headerContent} >
            {/* --------- Col 1 --------- */}
            <View style={{ width: scaleSize(100), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >

                    {localize('Batch ID', language)}
                </Text>
            </View>
            {/* --------- Col 2 --------- */}
            <View style={{ width: scaleSize(110), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >

                    {localize('Date Time', language)}
                </Text>
            </View>
            {/* --------- Col 3 --------- */}
            <View style={{ width: scaleSize(130), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >

                    {localize('Invoice Number', language)}
                </Text>
            </View>
            {/* --------- Col 4 --------- */}
            <View style={{ width: scaleSize(90), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >
                    {localize('Status', language)}
                </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ width: scaleSize(110), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >
                    {localize('Payment', language)}

                </Text>
            </View>
            {/* --------- Col 6 --------- */}
            <View style={{ width: scaleSize(90), justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >
                    {localize('Type', language)}
                </Text>
            </View>
            {/* --------- Col 7 --------- */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                <Text style={styles.textHeaderContent} >
                    {localize('Total', language)}

                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textHeaderContent: {
        color: '#404040',
        fontSize: scaleSize(13),
        fontWeight: "600"
    },
    headerContent: {
        height: scaleSize(30),
        flexDirection: 'row',
    },
});

export default HeaderTableTransaction;