import React from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSzie } from '@utils';
import { Text, Button } from '@components';

const ItemProductService = ({ item, showColAmount, colorText, itemSelected, categoryTypeSelected }) => {

    const temptKeyId = categoryTypeSelected === 'Service' ? 'serviceId' : 'productId';
    const temptBackgrounColor = item[temptKeyId] === itemSelected[temptKeyId] ? '#0764B0' : '#FAFAFA';
    const temptTextColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};
    const temptTextPriceColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};

    return (
        <Button onPress={() => showColAmount(item)} style={{
            height: scaleSzie(68), borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor,
        }} >
            <View style={{ flex: 1, flexDirection: "row", padding: scaleSzie(4) }} >
                <View style={{ width: scaleSzie(60), justifyContent: "center", alignItems: "center" }} >
                    <View style={{ width: scaleSzie(60), height: scaleSzie(60) }} >
                        <FastImage
                            style={{ width: scaleSzie(60), height: scaleSzie(60) }}
                            source={{
                                uri: item.imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                    <View style={{ height: scaleSzie(40), }} >
                        <Text numberOflines={2} style={[{
                            fontSize: scaleSzie(13), color: '#0764B0', fontWeight: "500",
                        },
                            colorText,
                            temptTextColor
                        ]} >
                            {item.name}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end" }} >
                        <Text style={[{ fontSize: scaleSzie(11), color: '#6A6A6A' },temptTextPriceColor]} >
                            {`Price : $ `}
                            <Text style={[{ fontWeight: "bold" },]} >
                                {`${item.price ? item.price : ""}`}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>

        </Button>
    );
}

export default ItemProductService;