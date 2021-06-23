import React from 'react';

import { ScaleSzie } from '@utils';
import { Text, Button } from '@components';

const ItemCategory = ({ category, onPressSelectCategory, colorText, categorySelected }) => {
    const temptBackgrounColor = category.categoryId === categorySelected.categoryId ? '#0764B0' : (
        category?.isSelect ? "#dcf7ff" : '#fff'
    );
    const temptTextColor = category.categoryId === categorySelected.categoryId ? { color: '#fff' } : {};


    return (
        <Button onPress={() => onPressSelectCategory(category)} style={{
            minHeight: ScaleSzie(70), justifyContent: 'center',
            borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor,paddingLeft:ScaleSzie(8)
        }} >
            <Text numberOfLines={2} style={[{ fontSize: ScaleSzie(12), color: '#6A6A6A',fontWeight:"500" }, colorText, temptTextColor]} >
                {category.name}
            </Text>
        </Button>
    );
}

export default ItemCategory;