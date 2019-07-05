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
            flexDirection: 'row',alignItems:'center'
        }} >
            {/* -------- Avatar ------- */}
            <View style={{width:scaleSzie(45),height:scaleSzie(35),backgroundColor:'red'}} >

            </View>
             {/* -------- Avatar ------- */}
        </View>
    );
}

export default ItemBasket;