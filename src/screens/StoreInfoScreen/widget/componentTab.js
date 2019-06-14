import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';

import {
     Text
} from '@components';
import { scaleSzie } from '@utils';

const ItemAdminInfo = ({ title, placeholder, value, onChangeText, secureTextEntry }) => {
    return (
        <View style={{
            flexDirection: 'row',
            height: scaleSzie(36),
            paddingLeft: scaleSzie(90),
            paddingRight: scaleSzie(90),
            marginTop: scaleSzie(25)
        }} >
            <View style={{ width: scaleSzie(150), justifyContent: 'center' }} >
                <Text style={{
                    color: '#404040',
                    fontSize: scaleSzie(14),
                    fontWeight: '600',

                }}  >
                    {`${title}`}
                </Text>
            </View>

            <View style={{ flex: 1, borderWidth: 1, borderColor: '#6A6A6A', paddingLeft: scaleSzie(5) }} >
                <TextInput
                    style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={(value => onChangeText(value))}
                    secureTextEntry={secureTextEntry}
                />
            </View>
        </View>
    );
}

module.exports = {
    ItemAdminInfo,
}