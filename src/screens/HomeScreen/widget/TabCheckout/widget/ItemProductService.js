import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSzie, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemProductService = ({ item, showColAmount, itemSelected, categoryTypeSelected, groupAppointment, appointmentDetail }) => {

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

    let isSelectOnServer = false;
    const appointments = groupAppointment?.appointments || [];

    if (categoryTypeSelected === "Service") {
        for (let i = 0; i < appointments.length; i++) {
            const services = appointments[i]?.services || [];
            for (let j = 0; j < services.length; j++) {
                if (services[j]?.serviceId === item[temptKeyId]) {
                    isSelectOnServer = true;
                    break;
                }
            }
            if (isSelectOnServer) {
                break;
            }
        }
    } else {
        for (let i = 0; i < appointments.length; i++) {
            const products = appointments[i]?.products || [];
            for (let j = 0; j < products.length; j++) {
                if (products[j]?.productId === item[temptKeyId]) {
                    isSelectOnServer = true;
                    break;
                }
            }
            if (isSelectOnServer) {
                break;
            }
        }
    }

    if (!isSelectOnServer && !_.isEmpty(appointmentDetail)) {
        if (categoryTypeSelected === "Service") {
            const services = appointmentDetail?.services || [];
            for (let j = 0; j < services.length; j++) {
                if (services[j]?.serviceId === item[temptKeyId]) {
                    isSelectOnServer = true;
                    break;
                }
            }
        } else {
            const products = appointmentDetail?.products || [];
            for (let j = 0; j < products.length; j++) {
                if (products[j]?.productId === item[temptKeyId]) {
                    isSelectOnServer = true;
                    break;
                }
            }
        }
    }


    const temtemptBackgrounColorSelectOnServer = isSelectOnServer ? { backgroundColor: "#DCF7FF" } : {};
    const temptBackgrounColor = item[temptKeyId] === itemSelected[temptKeyId] ? { backgroundColor: '#0764B0' } : {};
    const temptTextColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};
    const temptTextPriceColor = item[temptKeyId] === itemSelected[temptKeyId] ? { color: '#fff' } : {};

    return (
        <Button onPress={() => showColAmount(item)} style={[{
            height: scaleSzie(68), borderBottomWidth: 2, borderBottomColor: '#DDDDDD', backgroundColor: '#FAFAFA'
        }, temtemptBackgrounColorSelectOnServer, temptBackgrounColor]} >
            <View style={{ flex: 1, flexDirection: "row", padding: scaleSzie(4) }} >
                <View style={{ width: scaleSzie(50), justifyContent: "center", alignItems: "center" }} >
                    <View style={{ width: scaleSzie(50), height: scaleSzie(60) }} >
                        {
                            item.imageUrl ? <FastImage
                                style={{ width: scaleSzie(50), height: scaleSzie(60) }}
                                source={source}
                                onError={() => setSource(categoryTypeSelected === 'Service' ? ICON.service_holder : ICON.product_holder)}
                            /> : <FastImage
                                    style={{ width: scaleSzie(50), height: scaleSzie(60) }}
                                    source={placeHolder}
                                />
                        }
                    </View>
                </View>
                <View style={{ flex: 1, paddingLeft: scaleSzie(8) }} >
                    <View style={{ height: scaleSzie(40), }} >
                        <Text numberOflines={2} style={[{
                            fontSize: scaleSzie(12), color: '#0764B0', fontWeight: "500",
                        },
                            temptTextColor
                        ]} >
                            {item?.name || ""}
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }} >
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(10), color: '#6A6A6A', fontWeight: "700", }, temptTextPriceColor]} >
                            {`$ ${item?.price || ""}`}
                        </Text>
                        <View style={{ width: scaleSzie(50), backgroundColor: "red" }} />
                        <Text numberOflines={2} style={[{ fontSize: scaleSzie(10), color: '#6A6A6A', fontWeight: "300" },
                        ]} >
                            {`${msToTime(item?.duration || 0)}`}
                        </Text>
                    </View>
                </View>
            </View>

        </Button>
    );
}

export default ItemProductService;