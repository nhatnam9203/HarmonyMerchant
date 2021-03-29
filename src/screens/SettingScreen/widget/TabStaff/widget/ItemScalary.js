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
import { scaleSzie } from '@utils';

export default class ItemScalary extends React.Component {

    // onPress = () => {
    //     if (!this.props.isNotToggleCheck) {
    //         this.setState((prevState, props) => ({
    //             isCheck: !prevState.isCheck
    //         }), () => {
    //             if (!this.state.isCheck) {
    //                 this.setState({
    //                     value: "0"
    //                 })
    //             } else {
    //                 this.props.toogleCheck && this.props.toogleCheck();
    //             }
    //         });
    //     }

    // }

    render() {
        const { title, placeholder, onFocus, maxLength, data, onPressCheckBox, onChangeValue } = this.props;
        const isCheck = data?.isCheck;
        const value = data?.value;
        const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;

        return (
            <View style={{
                flexDirection: 'row',
                height: scaleSzie(36),
                paddingHorizontal: scaleSzie(25),
                marginTop: scaleSzie(14)
            }} >
                <Button onPress={onPressCheckBox} style={{ width: scaleSzie(30), justifyContent: 'center' }} >
                    <Image source={temptIconCheck} style={{ width: scaleSzie(15), height: scaleSzie(15) }} />
                </Button>

                <View style={{ width: scaleSzie(120), justifyContent: 'center' }} >
                    <Text style={{
                        color: '#404040',
                        fontSize: scaleSzie(14),
                        fontWeight: '600',
                    }}  >
                        {`${title}`}
                    </Text>
                </View>

                <View style={[{ width: scaleSzie(150), paddingLeft: scaleSzie(5) }, styles.borderTextInput]} >
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
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
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
