import React from 'react';
import { View, TextInput, Image } from 'react-native';

import { scaleSize } from '../utils';
import IMAGE from '@resources';
import Button from './Button';

export default class InputAuth extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value ? this.props.value : ""
        }
        this.textinputRef = React.createRef();
    }

    onFocusTexInput() {
        this.textinputRef.current.focus();
    }

    render() {
        const { placeholder, secureTextEntry, onSubmitEditing, style, keyboardType, maxLength,
            isShowPass,changeShowPass,iconShowPass
        } = this.props;
        return (
            <View style={{
                width: scaleSize(400), height: scaleSize(45),
                backgroundColor: '#fff', paddingHorizontal: scaleSize(15)
            }} >
                <TextInput
                    ref={this.textinputRef}
                    style={[{
                        flex: 1,
                        fontSize: scaleSize(20)
                    }, style]}
                    placeholder={placeholder}
                    value={this.state.value}
                    onChangeText={value => this.setState({ value })}
                    secureTextEntry={secureTextEntry}
                    onSubmitEditing={() => onSubmitEditing()}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    maxLength={maxLength ? maxLength : null}
                />
                {
                    isShowPass ? <Button 
                    onPress={() =>changeShowPass()}
                    style={{
                        position: 'absolute', right: 0, width: scaleSize(30), height: scaleSize(45),
                     justifyContent: 'center'
                    }} >
                        <Image
                            source={iconShowPass}
                            style={{ width: scaleSize(25), height: scaleSize(18) }}
                        />
                    </Button> : <View />
                }

            </View>
        );
    }


}