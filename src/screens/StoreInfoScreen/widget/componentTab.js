import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import {
     Text
} from '@components';
import { scaleSzie } from '@utils';

const ItemAdminInfo = ({ title, placeholder, value, onChangeText, secureTextEntry , type,
    maxLength}) => {
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

            <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingLeft: scaleSzie(5) }} >
            {
                    type ? <TextInputMask
                        type="only-numbers"
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                        secureTextEntry={secureTextEntry}
                        maxLength={maxLength ? maxLength : null}
                    /> : <TextInput
                            style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            maxLength={maxLength ? maxLength : null}
                        />
                }
            </View>
        </View>
    );
}

module.exports = {
    ItemAdminInfo,
}