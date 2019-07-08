import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemExtra = ({ extra}) => {
    // const temptBackgrounColor = category.categoryId === categorySelected.categoryId ? '#0764B0' : '#F1F1F1';
    // const temptTextColor = category.categoryId === categorySelected.categoryId ? { color: '#fff' } : {};
    return (
        <Button onPress={() => onPressSelectCategory(category)} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: 'red'
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' }, 
            // colorText, 
            // temptTextColor
            ]} >
                {extra.name}
            </Text>
        </Button>
    );
}

export default ItemExtra;