import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text, Button } from '@components';

const ItemCategory = ({ category, onPressSelectCategory, colorText, categorySelected }) => {
    const temptBackgrounColor = category.categoryId === categorySelected.categoryId ? '#0764B0' : '#F1F1F1';
    const temptTextColor = category.categoryId === categorySelected.categoryId ?{color:'#fff'}  :{};
    return (
        <Button onPress={() => onPressSelectCategory(category)} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: temptBackgrounColor
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' }, colorText,temptTextColor]} >
                {category.name}
            </Text>
        </Button>
    );
}

export default ItemCategory;