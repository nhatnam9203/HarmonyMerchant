import React from 'react';
import {
    View,
    TextInput,
    Platform
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import ButtonCustom from './ButtonCustom';
import Text from './Text';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';

export default class InputForm extends React.PureComponent {
    render() {
        const { title, subTitle, placeholder, style, value,
            onChangeText, secureTextEntry, keyboardType,
            isOnlyNumber, maxLength, editable,onFocus
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
                    height: scaleSzie(temptHeight), borderWidth: 1, borderColor: '#C5C5C5',
                    marginTop: scaleSzie(5), paddingLeft: scaleSzie(8)
                }} >
                    {
                        isOnlyNumber ? <TextInputMask
                            type="only-numbers"
                            style={{ flex: 1, fontSize: scaleSzie(16) }}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={(value => onChangeText(value))}
                            secureTextEntry={secureTextEntry}
                            keyboardType={keyboardType ? keyboardType : "default"}
                            placeholderTextColor="#A9A9A9"
                            maxLength={maxLength ? maxLength : null}
                            editable={editable}
                            onFocus={() => onFocus && onFocus()}
                        /> : <TextInput
                                style={{ flex: 1, fontSize: scaleSzie(16) }}
                                placeholder={placeholder}
                                value={value}
                                onChangeText={(value => onChangeText(value))}
                                secureTextEntry={secureTextEntry}
                                keyboardType={keyboardType ? keyboardType : "default"}
                                placeholderTextColor="#A9A9A9"
                                maxLength={maxLength ? maxLength : null}
                                editable={editable}
                                onFocus={() => onFocus && onFocus()}
                            />
                    }

                </View>
            </View>
        );
    }


}