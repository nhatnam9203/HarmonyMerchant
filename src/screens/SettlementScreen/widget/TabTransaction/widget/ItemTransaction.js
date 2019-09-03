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

const ItemTransaction = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(60), backgroundColor: '#FAFAFA',
            borderBottomColor: '#C5C5C5', borderBottomWidth: 1, flexDirection: 'row'
        }} >
            {/* --------- Col 1 --------- */}
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={[styles.textHeaderContent, { marginLeft: scaleSzie(10) }]} >
                    #1234
            </Text>
            </View>
            {/* --------- Col 2 --------- */}
            <View style={{ width: scaleSzie(130), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    02/20/2019
                </Text>
                <Text style={styles.textHeaderContent} >
                    10:00:07 AM
                </Text>

            </View>
            {/* --------- Col 3 --------- */}
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    #23456
                </Text>
            </View>
            {/* --------- Col 4 --------- */}
            <View style={{ width: scaleSzie(110), justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    Open
            </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ width: scaleSzie(130), alignItems: 'center',flexDirection:'row' }} >
                <Image source={IMAGE.hpLogo} />
                <View style={{width:5}} />
                <Image source={IMAGE.discoverLogo} />
                <View style={{width:5}} />
                <Text style={styles.textHeaderContent} >
                3527
                </Text>
            </View>
            {/* --------- Col 5 --------- */}
            <View style={{ flex: 1, justifyContent: 'center' }} >
                <Text style={styles.textHeaderContent} >
                    10.00$
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
});

export default ItemTransaction;