import React from 'react';
import {
    View,
    TextInput,
} from 'react-native';

import ButtonCustom from './ButtonCustom';
import Text from './Text';
import { scaleSzie } from '../utils';
import IMAGE from '../resources';

export default class InputForm extends React.PureComponent {
    render() {
        const { title, subTitle, placeholder ,style} = this.props;
        return (
            <View style={[{ marginBottom: scaleSzie(24) },style]} >
                <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                    {title}
                    <Text style={{ color: '#404040', fontSize: scaleSzie(12) }} >

                        {subTitle}
                    </Text>
                </Text>
                <View style={{
                    height: scaleSzie(30), borderWidth: 1, borderColor: '#6A6A6A',
                    marginTop: scaleSzie(5), paddingLeft: scaleSzie(8)
                }} >
                    <TextInput
                        style={{ flex: 1, fontSize: scaleSzie(16) }}
                        placeholder={placeholder}
                    />

                </View>
            </View>
        );
    }


}