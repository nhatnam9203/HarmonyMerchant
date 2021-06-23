import React from 'react';
import { View, TextInput, Image } from 'react-native';

import { ScaleSzie } from '../utils';
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
                width: ScaleSzie(400), height: ScaleSzie(45),
                backgroundColor: '#fff', paddingHorizontal: ScaleSzie(15)
            }} >
                <TextInput
                    ref={this.textinputRef}
                    style={[{
                        flex: 1,
                        fontSize: ScaleSzie(20)
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
                        position: 'absolute', right: 0, width: ScaleSzie(30), height: ScaleSzie(45),
                     justifyContent: 'center'
                    }} >
                        <Image
                            source={iconShowPass}
                            style={{ width: ScaleSzie(25), height: ScaleSzie(18) }}
                        />
                    </Button> : <View />
                }

            </View>
        );
    }


}