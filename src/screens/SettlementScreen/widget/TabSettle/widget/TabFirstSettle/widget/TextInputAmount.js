import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { scaleSzie, localize } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import IMAGE from '@resources';

export default class TextInputAmount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            initState: true
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value && state.initState) {
            return { value: props.value, initState: false };
        }
        return null
    }

    resetStateFromParent = async () =>{
     await  this.setState({
            initState: true
        })
    }

    onChangeText = async (value) => {
        await this.setState({ value });
        this.props.onChangeText();
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{justifyContent:'center',width:scaleSzie(13)}} >
                    <Text style={{ fontSize: scaleSzie(20), color: '#404040', }} >
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
                            fontSize: scaleSzie(20), color: '#404040',
                            flex: 1,
                        }}
                        value={`${this.state.value}`}
                        onChangeText={this.onChangeText}
                    />
                </View>
            </View>

        );
    }

}