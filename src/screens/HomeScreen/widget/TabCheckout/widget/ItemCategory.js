import React from 'react';
import {
    View,
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text ,Button} from '@components';

const ItemCategory = ({category, onPressSelectCategory,colorText}) => {
    console.log('category : ',category);
    return (
        <Button onPress={() => onPressSelectCategory()} style={{
            height: scaleSzie(85), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor :'#F1F1F1'
        }} >
            <Text style={[{ fontSize: scaleSzie(20), color: '#404040' },colorText]} >
               {category.name}
            </Text>
        </Button>
    );
}

export default ItemCategory;