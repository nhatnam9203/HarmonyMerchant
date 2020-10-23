import React from 'react';

import { scaleSzie } from '@utils';
import { Text, Button } from '@components';

const ItemCategory = ({ category, onPressSelectCategory, colorText, categorySelected }) => {
    const temptBackgrounColor = category.categoryId === categorySelected.categoryId ? '#0764B0' : '#FAFAFA';
    const temptTextColor = category.categoryId === categorySelected.categoryId ?{color:'#fff'}  :{};
    return (
        <Button onPress={() => onPressSelectCategory(category)} style={{
            height: scaleSzie(75), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor
        }} >
            <Text  numberOfLines={1} style={[{ fontSize: scaleSzie(20), color: '#6A6A6A' }, colorText,temptTextColor]} >
                {category.name}
            </Text>
        </Button>
    );
}

export default ItemCategory;