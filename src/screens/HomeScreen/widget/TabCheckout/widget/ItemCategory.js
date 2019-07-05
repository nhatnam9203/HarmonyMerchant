import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text } from '@components';

const ItemCategory = ({ }) => {
    return (
        <View style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff'
        }} >
            <Text style={{ fontSize: scaleSzie(20), color: '#404040' }} >
                S_Categories
            </Text>
        </View>
    );
}

export default ItemCategory;