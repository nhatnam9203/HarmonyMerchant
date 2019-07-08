import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text ,Button} from '@components';

const ItemCategory = ({ onPressSelectCategory}) => {
    return (
        <Button onPress={() => onPressSelectCategory()} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff'
        }} >
            <Text style={{ fontSize: scaleSzie(20), color: '#404040' }} >
                S_Categories
            </Text>
        </Button>
    );
}

export default ItemCategory;