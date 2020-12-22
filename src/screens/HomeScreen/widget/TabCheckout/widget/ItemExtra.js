import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { scaleSzie, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemExtra = ({ extra, onPressSelectExtra, arrSelectedExtra }) => {

    const [source, setSource] = useState({
        uri: extra.imageUrl,
        priority: FastImage.priority.low,
        cache: FastImage.cacheControl.immutable
    });

    useEffect(() => {
        if (source?.uri && source?.uri !== extra.imageUrl) {
            setSource({
                uri: extra.imageUrl,
                priority: FastImage.priority.low,
                cache: FastImage.cacheControl.immutable
            })
        }
    }, [extra?.imageUrl])

    let isSelect = false;

    if (arrSelectedExtra && arrSelectedExtra.length > 0) {
        for (let i = 0; i < arrSelectedExtra.length; i++) {
            if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
                isSelect = true;
                break;
            }
        }
    }

    const temptBackgrounColor = isSelect ? '#DCF7FF' : '#FAFAFA';
    // const temptTextColor = extra.extraId === extraSelected.extraId ? { color: '#fff' } : {};

    return (
        <Button onPress={() => onPressSelectExtra(extra)} style={{
            height: scaleSzie(68), justifyContent: 'center',
            alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#DDDDDD',
            backgroundColor: temptBackgrounColor
        }} >

            <View style={{ flex: 1, flexDirection: "row", padding: scaleSzie(4) }} >
                <View style={{ width: scaleSzie(50), justifyContent: "center", alignItems: "center" }} >
                    <View style={{ width: scaleSzie(50), height: scaleSzie(60) }} >
                        {
                            extra.imageUrl ? <FastImage
                                style={{ width: scaleSzie(50), height: scaleSzie(60) }}
                                source={source}
                                onError={() => setSource(ICON.extra_holder)}
                            /> : <FastImage
                                    style={{ width: scaleSzie(50), height: scaleSzie(60) }}
                                    source={ICON.extra_holder}
                                />
                        }
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                    <View style={{ height: scaleSzie(40), }} >
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(12), color: '#0764B0', fontWeight: "500", },
                            //  temptTextColor
                        ]} >
                            {extra?.name || ""}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" }} >

                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(10), color: '#6A6A6A', fontWeight: "300" },
                        ]} >
                            {`${msToTime(extra?.duration || 0)}`}
                        </Text>
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(10), color: '#6A6A6A', fontWeight: "700" },
                        ]} >
                            {`$ ${extra?.price || ""}`}
                        </Text>
                    </View>
                </View>
            </View>
        </Button>
    );
}

export default ItemExtra;