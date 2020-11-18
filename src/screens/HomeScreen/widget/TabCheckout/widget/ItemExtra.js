import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSzie } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemExtra = ({ extra, onPressSelectExtra, extraSelected }) => {

    const [source, setSource] = useState({
        uri: extra.imageUrl,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable
    });

    useEffect(() => {
        setSource({
            uri: extra.imageUrl,
            priority: FastImage.priority.low,
            cache: FastImage.cacheControl.immutable
        })
    }, [extra.imageUrl])

    const temptBackgrounColor = extra.extraId === extraSelected.extraId ? '#0764B0' : '#FAFAFA';
    const temptTextColor = extra.extraId === extraSelected.extraId ? { color: '#fff' } : {};

    return (
        <Button onPress={() => onPressSelectExtra(extra)} style={{
            height: scaleSzie(75), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor
        }} >

            <View style={{ flex: 1, flexDirection: "row", padding: scaleSzie(4) }} >
                <View style={{ width: scaleSzie(60), justifyContent: "center", alignItems: "center" }} >
                    <View style={{ width: scaleSzie(60), height: scaleSzie(60) }} >
                        <FastImage
                            style={{ width: scaleSzie(60), height: scaleSzie(60) }}
                            source={source}
                            onError={() => setSource(ICON.extra_holder)}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                    <View style={{ height: scaleSzie(40), }} >
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(13), color: '#0764B0', fontWeight: "500", }, temptTextColor]} >
                            {extra.name}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end" }} >
                        <Text style={[{ fontSize: scaleSzie(11), color: '#6A6A6A' }, temptTextColor]} >
                            {`Price : $ `}
                            <Text style={[{ fontWeight: "bold" },]} >
                                {`${extra.price ? extra.price : ""}`}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </Button>
    );
}

export default ItemExtra;