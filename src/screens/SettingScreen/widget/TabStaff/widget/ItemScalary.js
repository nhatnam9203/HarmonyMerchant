import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import IMAGE from '@resources';
import { Button } from '@components';
import { ScaleSzie } from '@utils';

export default class ItemScalary extends React.Component {

    render() {
        const { title, placeholder, onFocus, maxLength, data, onPressCheckBox, onChangeValue } = this.props;
        const isCheck = data?.isCheck;
        const value = data?.value;
        const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

        return (
            <View style={{
                flexDirection: 'row',
                height: ScaleSzie(36),
                paddingHorizontal: ScaleSzie(25),
                marginTop: ScaleSzie(14)
            }} >
                <Button onPress={onPressCheckBox} style={{ width: ScaleSzie(30), justifyContent: 'center' }} >
                    <Image source={temptIconCheck} style={{ width: ScaleSzie(15), height: ScaleSzie(15) }} />
                </Button>

                <View style={{ width: ScaleSzie(120), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: ScaleSzie(14),
                        fontWeight: '600',
                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={[{ width: ScaleSzie(150), paddingLeft: ScaleSzie(5) }, styles.borderTextInput]} >
                    <TextInputMask
                        type={'money'}
                        options={{
                            precision: 2,
                            separator: '.',
                            delimiter: ',',
                            unit: '',
                            suffixUnit: ''
                        }}
                        // placeholder="$ 0.00"
                        style={{ flex: 1, fontSize: ScaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeValue}
                        onFocus={() => onFocus()}
                        editable={isCheck}
                        maxLength={maxLength}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    borderTextInput: {
        borderWidth: 1,
        borderColor: '#C5C5C5'
    }

})
