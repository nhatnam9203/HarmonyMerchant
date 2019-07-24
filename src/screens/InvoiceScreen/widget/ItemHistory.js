import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie } from '@utils';
import IMAGE from '@resources';

class ItemHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { title, value } = this.props;
        return (
            <View style={{ height: scaleSzie(70), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }} >
                <View style={{ flex: 1.4, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                            11-Jan-2019
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginLeft: scaleSzie(16) }} >
                            4:27 pm
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                            Pending
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                        Invoice created by Khanh
                        </Text>
                </View>
            </View>

        );
    }
}


export default ItemHistory;

