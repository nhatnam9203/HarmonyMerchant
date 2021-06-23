import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    StyleSheet
} from 'react-native';

import { ScaleSzie, localize, getCategoryName, getArrayNameCategories} from '@utils';
import { Text, Button, ButtonCustom, Dropdown, PopupConfirm, PopupAddEditService } from '@components';

const HeaderTableSettle = ({language }) => {
    return (
        <View style={{ flexDirection: 'row', height: ScaleSzie(30) }} >
            <View style={{ flex: 0.7, justifyContent: 'flex-end' }} >
                <Text style={styles.textTitleLefConten} >
                    
                    {localize('Batch ID', language)}
                </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', }} >
                <Text style={[styles.textTitleLefConten, { marginLeft: ScaleSzie(10) }]} >
                    
                    {localize('Date Time', language)}
                </Text>
            </View>
            <View style={{ flex: 0.8, justifyContent: 'flex-end' }} >
                <Text style={styles.textTitleLefConten} >
                {localize('Amount', language)}
                    
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textTitleLefConten: {
        color: '#404040',
        fontSize: ScaleSzie(14)
    },
});

export default HeaderTableSettle;