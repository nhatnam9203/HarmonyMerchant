import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

import { Button } from '@components';
import { ScaleSzie, formatWithMoment } from '@utils';
import IMAGE from '@resources';

class ItemHistory extends React.Component {


    render() {
        const { data } = this.props;
        return (
            <View style={{ minHeight: ScaleSzie(70), borderBottomColor: '#C5C5C5', borderBottomWidth: 1 }} >
                <View style={{ flex: 1.4, flexDirection: 'row' }} >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14) }} >
                            {formatWithMoment(data?.createdAt, 'MM/DD/YYYY')}
                        </Text>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14), marginLeft: ScaleSzie(16) }} >
                            {formatWithMoment(data?.createdAt, 'hh:mm A')}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ color: '#404040', fontSize: ScaleSzie(14) }} >
                            {data?.status}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1 }} >
                    <Text style={{ color: '#404040', fontSize: ScaleSzie(14) }} >
                        {data?.message || ''}
                    </Text>
                    {
                        data?.reason && <Text style={{ color: '#404040', fontSize: ScaleSzie(14) }} >
                            {`Reason: ${data?.reason}`}
                        </Text>
                    }

                </View>
            </View>

        );
    }
}


export default ItemHistory;

