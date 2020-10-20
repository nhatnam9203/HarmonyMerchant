import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie } from '@utils';

const ColPlaceHolder = () => {
    return (
        <View style={{ flex:1 }} >
            <View style={{
                height: scaleSzie(46),
                borderWidth: 1,
                borderColor: 'rgb(197,197,197)',
                borderRightColor: 'rgb(223,223,223)',
                borderRightWidth:3,
                borderLeftWidth: 0,
                borderTopWidth: 0
            }} >
            </View>

            <View style={{
                flex:1, backgroundColor: '#F1F1F1',
                borderRightWidth: 3, borderRightColor: 'rgb(223,223,223)',
            }} >
                {
                    [0,1,2,3,4,5].map(value => <View key={value} style={{ height: scaleSzie(85), borderBottomWidth: 3, borderBottomColor: '#fff' }} />)
                }
               
            </View>
        </View>
    );
}

export default ColPlaceHolder;