import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text } from '@components';

const ItemBasket = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(40), backgroundColor: '#0764B0', borderBottomColor: '#fff', borderBottomWidth: 2,
            flexDirection: 'row'
        }} >
            {/* -------- Avatar ------- */}
            <View style={{ width: scaleSzie(45),justifyContent:'center',alignItems:'center'}} >
                <View style={{width:scaleSzie(35),height:scaleSzie(35),backgroundColor:'red',borderRadius:scaleSzie(20)}} >

                </View>
            </View>
            {/* -------- Avatar ------- */}
            <View style={{ flex: 1, flexDirection: 'row' ,justifyContent:'space-between',
        alignItems:'center',paddingHorizontal:scaleSzie(12)
        }} >
                <Text style={{ color: '#fff', fontSize: scaleSzie(13) }} >
                    Meredith
                </Text>
                <Text style={{ color: '#fff', fontSize: scaleSzie(13) }} >
                    Service 1
                </Text>
                <Text style={{ color: '#fff', fontSize: scaleSzie(14) }} >
                $ 100
                </Text>
            </View>
        </View>
    );
}

export default ItemBasket;