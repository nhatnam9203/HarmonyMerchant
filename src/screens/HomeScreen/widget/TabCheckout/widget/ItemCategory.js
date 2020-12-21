import React from 'react';

import { scaleSzie } from '@utils';
import { Text, Button } from '@components';

const ItemCategory = ({ category, onPressSelectCategory, colorText, categorySelected }) => {
    const temptBackgrounColor = category.categoryId === categorySelected.categoryId ? '#0764B0' : (
        category?.isSelect ? "#dcf7ff" : '#FAFAFA'
    );
    const temptTextColor = category.categoryId === categorySelected.categoryId ? { color: '#fff' } : {};


    return (
        <Button onPress={() => onPressSelectCategory(category)} style={{
            minHeight: scaleSzie(65), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor
        }} >
            <Text numberOfLines={2} style={[{ fontSize: scaleSzie(15), color: '#6A6A6A' }, colorText, temptTextColor]} >
                {category.name}
            </Text>
        </Button>
    );
}

export default ItemCategory;