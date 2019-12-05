import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemProductService = ({ item, showColAmount, colorText, itemSelected, categoryTypeSelected }) => {
    const temptKeyId = categoryTypeSelected === 'Service' ? 'serviceId' : 'productId';
    const temptBackgrounColor = item[temptKeyId] === itemSelected[temptKeyId] ? '#0764B0' : '#F1F1F1';
    const temptTextColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};

    return (
        <Button onPress={() => showColAmount(item)} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: temptBackgrounColor,
            // paddingHorizontal:scaleSzie(4)
        }} >
            <Text  style={[{ fontSize: scaleSzie(20), color: '#404040' },
                colorText,
                temptTextColor
            ]} numberOflines={1} >
                {item.name}
            </Text>
        </Button>
    );
}

export default ItemProductService;