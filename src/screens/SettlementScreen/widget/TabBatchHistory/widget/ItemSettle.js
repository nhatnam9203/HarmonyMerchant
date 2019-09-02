import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';

import { scaleSzie, localize, getCategoryName, getArrayNameCategories } from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';

const ItemSettle = ({ }) => {
    return (
        <View style={{ height: scaleSzie(58), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }} >
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: scaleSzie(8) }} >
                <View style={{ flex: 0.7, }} >
                    <Text style={[styles.textTitleLefConten, { marginLeft: scaleSzie(12) }]} >
                        #1234
                </Text>
                </View>
                <View style={{ flex: 1, }} >
                    <Text style={styles.textTitleLefConten} >
                        02/20/2019
                </Text>
                    <View style={{ height: 2 }} />
                    <Text style={styles.textTitleLefConten} >
                        10:00:07 AM
                </Text>
                </View>
                <View style={{ flex: 0.8, }} >
                    <Text style={styles.textTitleLefConten} >
                        10.00$
                </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textTitleLefConten: {
        color: '#404040',
        fontSize: scaleSzie(14)
    },
});

export default ItemSettle;