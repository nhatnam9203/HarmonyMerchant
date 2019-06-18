import React from 'react';
import { View, TextInput } from 'react-native';

import { scaleSzie } from '../utils';

export default class InputAuth extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.textinputRef = React.createRef();
    }

    onFocusTexInput() {
        this.textinputRef.current.focus();
    }

    render() {
        const { placeholder, secureTextEntry, onSubmitEditing, style, keyboardType, maxLength } = this.props;
        return (
            <View style={{
                width: scaleSzie(400), height: scaleSzie(45),
                backgroundColor: '#fff', paddingHorizontal: scaleSzie(15)
            }} >
                <TextInput
                    ref={this.textinputRef}
                    style={[{
                        flex: 1,
                        fontSize: scaleSzie(20)
                    }, style]}
                    placeholder={placeholder}
                    value={this.state.value}
                    onChangeText={value => this.setState({ value })}
                    secureTextEntry={secureTextEntry}
                    onSubmitEditing={() => onSubmitEditing()}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    maxLength={maxLength ? maxLength : null}
                />
            </View>
        );
    }


}