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

    constructor(props) {
        super(props);
        const {dataInit} = this.props;
        this.state = {
            isCheck:dataInit.isCheck,
            value: dataInit.value
        }
    }

    setStateFromParent = async () =>{
        await this.setState({
            value: '',
            isCheck: false
        })
    }

    onPress = () => {
        this.setState((prevState, props) => ({
            isCheck: !prevState.isCheck
        }));
    }

    render() {
        const { title, placeholder,onFocus } = this.props;
        const { isCheck, value } = this.state;
        const temptIconCheck = isCheck ? IMAGE.checkBox : IMAGE.checkBoxEmpty;
        return (
            <View style={{
                flexDirection: 'row',
                height: scaleSzie(36),
                paddingLeft: scaleSzie(90),
                paddingRight: scaleSzie(90),
                marginTop: scaleSzie(14)
            }} >
                <Button onPress={this.onPress} style={{ width: scaleSzie(30), justifyContent: 'center' }} >
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
                        type="only-numbers"
                        style={{ flex: 1, fontSize: scaleSzie(14), color: '#404040', }}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={(value) => this.setState({ value })}
                        onFocus={() => onFocus()}
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
