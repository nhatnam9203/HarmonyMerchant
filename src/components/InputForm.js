import React from 'react';
import {
    View,
    TextInput,
    Platform
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import Text from './Text';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';

export default class InputForm extends React.PureComponent {
    render() {
        const { title, subTitle, placeholder, style, value,
            onChangeText, secureTextEntry, keyboardType
        } = this.props;
        const temptHeight = Platform.OS === 'ios' ? 30 : 40
        return (
            <View style={[{ marginBottom: scaleSzie(24) }, style]} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                    {title}
                    <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >
                        {subTitle}
                    </Text>
                </Text>
                <View style={{
                    height: scaleSzie(temptHeight), borderWidth: 1, borderColor: '#6A6A6A',
                    marginTop: scaleSzie(5), paddingLeft: scaleSzie(8)
                }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value => onChangeText(value))}
                        secureTextEntry={secureTextEntry}
                        keyboardType={keyboardType ? keyboardType : "default"}
                        placeholderTextColor="#A9A9A9"
                    />

                </View>
            </View>
        );
    }


}