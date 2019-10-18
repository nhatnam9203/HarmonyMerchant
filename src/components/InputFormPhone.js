import React from 'react';
import {
    View,
    TextInput,
    Platform
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import Text from './Text';
import { scaleSzie, ListCodeAreaPhone } from '../utils';
import { Dropdown } from './react-native-material-dropdown';

export default class InputFormPhone extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            codeAreaPhone: '+1'
        }
    }

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
                    height: scaleSzie(temptHeight),
                    marginTop: scaleSzie(5),
                    flexDirection: 'row'
                }} >
                    <View style={{ width: scaleSzie(60), }} >
                        <Dropdown
                            label={'+1'}
                            data={ListCodeAreaPhone}
                            value={this.state.codeAreaPhone}
                            onChangeText={(codeAreaPhone) => this.setState({ codeAreaPhone })}
                            containerStyle={{
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#C5C5C5',
                                flex: 1
                            }}
                        />
                    </View>
                    <View style={{ width: scaleSzie(8) }} />
                    <View style={{ flex: 1, borderWidth: 1, borderColor: '#C5C5C5', paddingHorizontal: (8) }} >
                        <TextInputMask
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
                        />
                    </View>

                </View>
            </View>
        );
    }


}