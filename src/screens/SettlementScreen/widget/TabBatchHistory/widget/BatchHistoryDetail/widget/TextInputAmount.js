import React from 'react';
import {
    View
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { scaleSize } from '@utils';
import { Text } from '@components';

export default class TextInputAmount extends React.Component {

    render() {
        const { value, onFocus, onChangeText, editable } = this.props;
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ justifyContent: 'center', width: scaleSize(13) }} >
                    <Text style={{ fontSize: scaleSize(20), color: '#404040', }} >
                        {'$ '}
                    </Text>
                </View>
                <View style={{ flex: 1 }} >
                    <TextInputMask
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: '',
                            suffixUnit: ''
                        }}
                        style={{
                            fontSize: scaleSize(20), color: '#404040',
                            flex: 1,
                        }}
                        value={`${value}`}
                        onChangeText={(value) => onChangeText(value)}
                        onFocus={() => onFocus && onFocus()}
                        editable={editable}
                    />
                </View>
            </View>

        );
    }

}
