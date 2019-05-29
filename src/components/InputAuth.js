import React from 'react';
import { View, TextInput } from 'react-native';

import { scaleSzie } from '../utils';

export default class InputAuth extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    render() {
        const { placeholder,secureTextEntry } = this.props;
        return (
            <View style={{
                width: scaleSzie(400), height: scaleSzie(45),
                backgroundColor: '#fff', paddingHorizontal: scaleSzie(15)
            }} >
                <TextInput
                    style={{
                        flex: 1,
                        fontSize: scaleSzie(20)
                    }}
                    placeholder={placeholder}
                    value={this.state.value}
                    onChangeText={value => this.setState({ value })}
                    secureTextEntry={secureTextEntry}
                />
            </View>
        );
    }


}