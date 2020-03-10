import React from 'react';
import {
    View,
    Image,
    TextInput,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native';
import _ from 'ramda';

import { scaleSzie, localize, formatNumberFromCurrency, formatMoney, roundFloatNumber } from '@utils';
import {
    Text, Button, ButtonCustom,
} from '@components';
import IMAGE from '@resources';

export default class TotalCustom extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0.00,
            initState: true
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.total != "0.00" && props.total
        //  && state.initState
         ) {
            console.log("props.total : ",props.total);
            return { total: props.total, initState: false };
        }
        return null
    }

    setStateFromParent = async (total) => {
        await this.setState({
            total: total
        })
    }

    resetStateFromParent = async () => {
        await this.setState({
            initState: true
        })
    }

    render() {
        const { total } = this.state;
        return (
            <View style={{
                height: scaleSzie(45), marginTop: scaleSzie(10),
                flexDirection: 'row', paddingHorizontal: scaleSzie(10), alignItems: 'center',
                justifyContent: 'space-between'
            }} >
                <Text style={{ fontSize: scaleSzie(20), color: '#0764B0' }} >
                    Total:
                    </Text>
                <Text style={{ fontSize: scaleSzie(20), color: '#4CD964', fontWeight: 'bold' }} >
                    {`$ ${total}`}
                </Text>
            </View>
        );
    }

}