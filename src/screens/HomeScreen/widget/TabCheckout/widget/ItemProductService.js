import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemProductService = ({ item, }) => {
    return (
        <Button onPress={() => { }} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: '#F1F1F1'
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' },
                // colorText,
                // temptTextColor
            ]} >
                {item.name}
            </Text>
        </Button>
    );
}

export default ItemProductService;