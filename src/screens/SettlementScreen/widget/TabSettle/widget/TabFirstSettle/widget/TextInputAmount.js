import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

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

    static getDerivedStateFromProps(props, state){
        if(props.value && state.initState ){
            return { value : props.value , initState: false};
        }
        return null
    }

    render() {
        return (
            <TextInput
                style={{
                    fontSize: scaleSzie(20), color: '#404040',
                    flex: 1,
                }}
                value={`${this.state.value}`}
                onChangeText={(value) => this.setState({ value })}
            />
        );
    }

}