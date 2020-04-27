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
            height: scaleSzie(85), borderBottomWidth: 3, borderBottomColor: '#fff',
            backgroundColor: temptBackgrounColor,
        }} >
            <View style={{ flex: 1, flexDirection: "row", padding: scaleSzie(8) }} >
                <View style={{ width: scaleSzie(60), justifyContent: "center", alignItems: "center" }} >
                    <View style={{ width: scaleSzie(60), height: scaleSzie(60), backgroundColor: "red" }} >

                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                    <View style={{ height: scaleSzie(40),}} >
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(16), color: '#0764B0', fontWeight: "500" },
                            colorText,
                            temptTextColor
                        ]} >
                            {item.name}
                        </Text>
                    </View>
                    <View style={{ flex: 1 ,justifyContent:"flex-end"}} >
                        <Text  style={[{ fontSize: scaleSzie(12), color: '#6A6A6A' },]} >
                           {`Price : $`}
                           <Text  style={[{ fontWeight:"bold" },]} >
                           {`20.00`}
                        </Text>
                        </Text>
                    </View>

                </View>
            </View>

        </Button>
    );
}

export default ItemProductService;