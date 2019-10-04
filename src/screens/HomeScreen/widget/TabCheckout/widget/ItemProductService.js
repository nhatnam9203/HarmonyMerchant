import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemProductService = ({ item, showColAmount, colorText, itemSelected, categoryTypeSelected }) => {
    let temptBackgrounColor;
    let temptTextColor;
    if (categoryTypeSelected === 'Extra') {
        temptBackgrounColor = '#F1F1F1';
        temptTextColor = { color: '#0764B0' };
    } else {
        temptKeyId = categoryTypeSelected === 'Service' ? 'serviceId' : 'productId';
        temptBackgrounColor = item[temptKeyId] === itemSelected[temptKeyId] ? '#0764B0' : '#F1F1F1';
        temptTextColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};
    }

    return (
        <Button onPress={() => showColAmount(item)} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: temptBackgrounColor
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' },
                colorText,
                temptTextColor
            ]} >
                {item.name}
            </Text>
        </Button>
    );
}

export default ItemProductService;