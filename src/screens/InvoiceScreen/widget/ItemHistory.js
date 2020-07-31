import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { scaleSzie, formatWithMoment } from '@utils';
import IMAGE from '@resources';

class ItemHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { data } = this.props;
        return (
            <View style={{ height: scaleSzie(70), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }} >
                <View style={{ flex: 1.4, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                            {formatWithMoment(data.createdAt, 'MM/DD/YYYY')}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14), marginLeft: scaleSzie(16) }} >
                            {formatWithMoment(data.createdAt, 'hh:mm A')}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                            {data.status}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ color: '#404040', fontSize: scaleSzie(14) }} >
                        {data.message}
                    </Text>
                </View>
            </View>

        );
    }
}


export default ItemHistory;

