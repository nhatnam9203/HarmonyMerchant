import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';

import { scaleSzie } from '@utils';
import { Text} from '@components';
import IMAGE from '@resources';

const HeaderTableTransaction = ({ }) => {
    return (
        <View style={styles.headerContent} >
        {/* --------- Col 1 --------- */}
        <View style={{ width: scaleSzie(150), justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Transactions ID
                </Text>
        </View>
        {/* --------- Col 2 --------- */}
        <View style={{ width: scaleSzie(130), justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Datetime
                </Text>
        </View>
        {/* --------- Col 3 --------- */}
        <View style={{ width: scaleSzie(150), justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Invoice Number
                </Text>
        </View>
        {/* --------- Col 4 --------- */}
        <View style={{ width: scaleSzie(110), justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Status
                </Text>
        </View>
        {/* --------- Col 5 --------- */}
        <View style={{ width: scaleSzie(130), justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Payment
                </Text>
        </View>
        {/* --------- Col 5 --------- */}
        <View style={{ flex: 1, justifyContent: 'flex-end' }} >
            <Text style={styles.textHeaderContent} >
                Total
                </Text>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    textHeaderContent:{
        color:'#404040',
        fontSize:scaleSzie(14)
    },
    headerContent: {
        height: scaleSzie(30),
        flexDirection: 'row',
    },
});

export default HeaderTableTransaction;