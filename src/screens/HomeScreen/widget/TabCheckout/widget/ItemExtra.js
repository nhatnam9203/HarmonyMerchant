import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSzie, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemExtra = ({ extra, onPressSelectExtra, arrSelectedExtra, groupAppointment, appointmentDetail }) => {

    // const [source, setSource] = useState({
    //     uri: extra.imageUrl,
    //     priority: FastImage.priority.low,
    //     cache: FastImage.cacheControl.immutable
    // });

    // useEffect(() => {
    //     if (source?.uri && source?.uri !== extra.imageUrl) {
    //         setSource({
    //             uri: extra.imageUrl,
    //             priority: FastImage.priority.low,
    //             cache: FastImage.cacheControl.immutable
    //         })
    //     }
    // }, [extra?.imageUrl])

    let isSelect = false;
    if (arrSelectedExtra && arrSelectedExtra.length > 0) {
        for (let i = 0; i < arrSelectedExtra.length; i++) {
            if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
                isSelect = true;
                break;
            }
        }
    }

    let isSelectOnServer = false;
    const appointments = groupAppointment?.appointments || [];
    for (let i = 0; i < appointments.length; i++) {
        const extras = appointments[i]?.extras || [];
        for (let j = 0; j < extras.length; j++) {
            if (extras[j]?.extraId === extra?.extraId) {
                isSelectOnServer = true;
                break;
            }
        }
        if (isSelectOnServer) {
            break;
        }
    }

    if (!isSelectOnServer && !_.isEmpty(appointmentDetail)) {
        const extras = appointmentDetail?.extras || [];
        for (let j = 0; j < extras.length; j++) {
            if (extras[j]?.extraId === extra?.extraId) {
                isSelectOnServer = true;
                break;
            }
        }
    }

    const temtemptBackgrounColorSelectOnServer = isSelectOnServer ? { backgroundColor: "#DCF7FF" } : {};
    const temptBackgrounColor = isSelect ? { backgroundColor: '#0764B0' } : {};
    const temptTextColor = isSelect ? { color: '#fff' } : {};

    return (
        <Button
            onPress={() => onPressSelectExtra(extra)} style={[{
                height: scaleSzie(70), justifyContent: 'center',
                alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDDDDD',
                backgroundColor: "#fff", flexDirection: "row", padding: scaleSzie(8)
            }, temtemptBackgrounColorSelectOnServer, temptBackgrounColor]} >

            <View style={{ width: scaleSzie(50), justifyContent: "center", alignItems: "center" }} >
                <View style={{ width: scaleSzie(50), height: scaleSzie(50), borderRadius: scaleSzie(3), overflow: "hidden" }} >
                    {
                        extra?.imageUrl ? <FastImage
                            style={{ width: scaleSzie(50), height: scaleSzie(50) }}
                            source={{
                                uri: extra.imageUrl,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                            // onError={() => setSource(ICON.extra_holder)}
                        /> : <FastImage
                                style={{ width: scaleSzie(50), height: scaleSzie(50) }}
                                source={ICON.extra_holder}
                            />
                    }
                </View>
            </View>

            <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                <View style={{ height: scaleSzie(40), }} >
                    <Text numberOflines={2} style={[{ fontSize: scaleSzie(12), color: '#0764B0', fontWeight: "600", },
                        temptTextColor
                    ]} >
                        {extra?.name || ""}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" }} >
                    <Text numberOflines={2} style={[{ fontSize: scaleSzie(10), color: '#6A6A6A', fontWeight: "300" },
                    ], temptTextColor} >
                        {`${msToTime(extra?.duration || 0)}`}
                    </Text>

                    <Text numberOflines={2} style={[{ color: '#6A6A6A', fontSize: scaleSzie(10), fontWeight: "600" },
                    ], {...temptTextColor, fontSize: scaleSzie(10), fontWeight: "600" }} >
                        {`$ ${extra?.price || ""}`}
                    </Text>
                </View>
            </View>
        </Button>
    );
}

export default ItemExtra;