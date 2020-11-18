import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSzie } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemProductService = ({ item, showColAmount, colorText, itemSelected, categoryTypeSelected }) => {

    const [source, setSource] = useState({
        uri: item.imageUrl,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable
    });

    useEffect(() => {
        if (source?.uri && source?.uri !== item.imageUrl) {
            setSource({
                uri: item.imageUrl,
                priority: FastImage.priority.low,
                cache: FastImage.cacheControl.immutable
            });
        }

    }, [item?.imageUrl])


    const temptKeyId = categoryTypeSelected === 'Service' ? 'serviceId' : 'productId';
    const placeHolder = categoryTypeSelected === 'Service' ? ICON.service_holder : ICON.product_holder;
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
                        {
                            item.imageUrl ? <FastImage
                                style={{ width: scaleSzie(60), height: scaleSzie(60) }}
                                source={source}
                                onError={() => setSource(categoryTypeSelected === 'Service' ? ICON.service_holder : ICON.product_holder)}
                            /> : <FastImage
                                    style={{ width: scaleSzie(60), height: scaleSzie(60) }}
                                    source={placeHolder}
                                />
                        }
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
                        <Text style={[{ fontSize: scaleSzie(11), color: '#6A6A6A' }, temptTextPriceColor]} >
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