import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import Text from './Text';
import { scaleSzie } from '../utils';

export default class InputForm extends React.PureComponent {
    render() {
        const { title, subTitle, placeholder, style, value,
            onChangeText, secureTextEntry, keyboardType,
            isOnlyNumber, maxLength, editable, onFocus, typeInputMask, optionsInputMask,
            styleTitle, styleBoxInput
        } = this.props;

        return (
            <View style={[{ marginBottom: scaleSzie(24) }, style]} >
                {
                    title ? <Text style={[{ color: '#404040', fontSize: scaleSzie(14), fontWeight: "600" }, styleTitle]} >
                        {title}
                        <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >
                            {subTitle}
                        </Text>
                    </Text> : null
                }

                <View style={[{
                    height: scaleSzie(30), borderWidth: 1, borderColor: '#C5C5C5',
                    marginTop: scaleSzie(5),
                    paddingLeft: scaleSzie(8)
                }, styleBoxInput]} >
                    {
                        isOnlyNumber ? <TextInputMask
                            type={typeInputMask ? typeInputMask : 'only-numbers'}
                            options={optionsInputMask}
                            style={{ flex: 1, fontSize: scaleSzie(16), color: "#000", padding: 0 }}
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
                                style={{ flex: 1, fontSize: scaleSzie(16), color: "#000", padding: 0 }}
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