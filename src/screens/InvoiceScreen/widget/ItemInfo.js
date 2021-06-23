import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { ScaleSzie } from '@utils';
import IMAGE from '@resources';

class ItemInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {title,value} = this.props;
        return (
            <View style={{ flexDirection: 'row' ,marginBottom:ScaleSzie(4)}} >
                <View style={{ flex: 1 }} >
                    <Text style={{ fontSize: ScaleSzie(12), color: '#404040', }} >
                       {`${title}:`}
                </Text>
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ fontSize: ScaleSzie(12), color: '#404040', }} >
                       {value}
                </Text>
                </View>
            </View>

        );
    }
}


export default ItemInfo;

