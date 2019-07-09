import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemExtra = ({ extra,onPressSelectExtra,extraSelected}) => {
    const temptBackgrounColor = extra.extraId === extraSelected.extraId ? '#0764B0' : '#F1F1F1';
    const temptTextColor =extra.extraId === extraSelected.extraId ? { color: '#fff' } : {};
    return (
        <Button onPress={() => onPressSelectExtra(extra)} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: temptBackgrounColor
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' }, 
            temptTextColor
            ]} >
                {extra.name}
            </Text>
        </Button>
    );
}

export default ItemExtra;