import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSize, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemExtra = ({ extra, onPressSelectExtra, arrSelectedExtra, groupAppointment, appointmentDetail }) => {
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
    const temptTextColor = isSelect ? { color: '#fff', fontWeight: "bold" } : {};

    return (
        <Button
            onPress={() => onPressSelectExtra(extra)} style={[{
                height: scaleSize(70), justifyContent: 'center',
                alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDDDDD',
                backgroundColor: "#fff", flexDirection: "row", padding: scaleSize(8)
            }, temtemptBackgrounColorSelectOnServer, temptBackgrounColor]} >

            <View style={{height: scaleSize(60), width: scaleSize(60), justifyContent: "center", alignItems: "center" ,backgroundColor:"rgba(0,0,0,0.05)"}} >
                <View style={{ width: scaleSize(50), height: scaleSize(50), overflow: "hidden" }} >
                    {
                        extra?.imageUrl ? <FastImage
                            style={{ width: scaleSize(50), height: scaleSize(50) }}
                            source={{
                                uri: extra.imageUrl,
                                // uri: `https://cdn.shopify.com/s/files/1/0210/9734/products/nayked-apparel-men-men-s-ridiculously-soft-long-sleeve-100-cotton-t-shirt-small-heather-grey-na0136-30589738375_1178x1390_crop_center.jpg?v=1607373961`,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        /> : <FastImage
                            style={{ width: scaleSize(50), height: scaleSize(50) }}
                            // source={ICON.extra_holder}
                            source={{
                                // uri: extra.imageUrl,
                                uri: `https://cdn.shopify.com/s/files/1/0210/9734/products/nayked-apparel-men-men-s-ridiculously-soft-long-sleeve-100-cotton-t-shirt-small-heather-grey-na0136-30589738375_1178x1390_crop_center.jpg?v=1607373961`,
                                priority: FastImage.priority.low,
                                cache: FastImage.cacheControl.immutable
                            }}
                        />
                    }
                </View>
            </View>

            <View style={{ flex: 1, paddingLeft: scaleSize(8) }} >
                <View style={{ height: scaleSize(40), }} >
                    <Text numberOflines={2} style={[{ fontSize: scaleSize(13), color: '#0764B0', fontWeight: "600", },
                        temptTextColor
                    ]} >
                        {extra?.name || ""}
                    </Text>
                </View>
                <View style={{ flex: 1, }} >
                    <Text numberOflines={2} style={[{ color: '#404040', fontSize: scaleSize(10), fontWeight: "600" },
                    ], { ...temptTextColor, fontSize: scaleSize(12) }} >
                        {`$ ${extra?.price || ""}`}
                    </Text>
                </View>
            </View>
        </Button>
    );
}

export default ItemExtra;