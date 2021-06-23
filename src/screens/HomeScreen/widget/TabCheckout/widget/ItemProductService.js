import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { ScaleSzie, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemProductService = ({ item, showColAmount, itemSelected, categoryTypeSelected, groupAppointment, appointmentDetail, isShowColAmount }) => {

    // const [source, setSource] = useState({
    //     uri: item.imageUrl,
    //     priority: FastImage.priority.low,
    //     cache: FastImage.cacheControl.immutable
    // });

    // useEffect(() => {
    //     if (source?.uri && source?.uri !== item.imageUrl) {
    //         setSource({
    //             uri: item.imageUrl,
    //             priority: FastImage.priority.low,
    //             cache: FastImage.cacheControl.immutable
    //         });
    //     }

    // }, [item?.imageUrl])


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
            height: ScaleSzie(70), borderBottomWidth: 1, borderBottomColor: '#DDDDDD', backgroundColor: '#fff',
            padding: ScaleSzie(8), flexDirection: "row"
        }, temtemptBackgrounColorSelectOnServer, temptBackgrounColor]} >

            <View style={{ width: ScaleSzie(50), justifyContent: "center", alignItems: "center" }} >
                <View style={{ width: ScaleSzie(50), height: ScaleSzie(50), borderRadius: ScaleSzie(3), overflow: "hidden" }} >
                    {
                        item?.imageUrl ? <FastImage
                            style={{ width: ScaleSzie(50), height: ScaleSzie(50) }}
                            source={{
                                    uri: item?.imageUrl,
                                    priority: FastImage.priority.low,
                                    cache: FastImage.cacheControl.immutable
                            }}
                            // onError={() => setSource(categoryTypeSelected === 'Service' ? ICON.service_holder : ICON.product_holder)}
                        /> : <FastImage
                                style={{ width: ScaleSzie(50), height: ScaleSzie(50) }}
                                source={placeHolder}
                            />
                    }
                </View>
            </View>

            <View style={{ flex: 1, paddingLeft: ScaleSzie(8) }} >
                <View style={{ height: ScaleSzie(40) }} >
                    <Text numberOflines={2} style={[{
                        fontSize: ScaleSzie(12), color: '#0764B0', fontWeight: "600",
                    },
                        temptTextColor
                    ]} >
                        {item?.name || ""}
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }} >
                    {
                        categoryTypeSelected === 'Service' ? <Text numberOflines={2} style={[{ fontSize: ScaleSzie(10), color: '#6A6A6A', fontWeight: "300" }, temptTextPriceColor]} >
                            {`${msToTime(item?.duration || 0)}`}
                        </Text> : <Text numberOflines={2} style={[{ fontSize: ScaleSzie(10), color: '#6A6A6A', fontWeight: "700", }, temptTextPriceColor]} >
                                {`$ ${item?.price || ""}`}
                            </Text>
                    }
                    {
                        !isShowColAmount && categoryTypeSelected === 'Service' && <Text numberOflines={2} style={[{ fontSize: ScaleSzie(10), color: '#6A6A6A', fontWeight: "700", }, temptTextPriceColor]} >
                            {`$ ${item?.price || ""}`}
                        </Text>
                    }
                </View>
            </View>

        </Button>
    );
}

export default ItemProductService;