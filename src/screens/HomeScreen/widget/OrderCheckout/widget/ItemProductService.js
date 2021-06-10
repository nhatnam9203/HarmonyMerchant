import React, { useState, useEffect } from 'react';
import {
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import _ from "ramda";

import { scaleSize, msToTime } from '@utils';
import { Text, Button } from '@components';
import ICON from "@resources";

const ItemProductService = ({ item, showColAmount, selectedItem, categoryTypeSelected, isShowColAmount }) => {

    const temptBackgrounColor = item?.categoryId === selectedItem?.categoryId ? { backgroundColor: '#0764B0' } : {};
    const temptTextColor =  item?.categoryId === selectedItem?.categoryId  ? { color: '#fff', fontWeight: "bold" } : {};

    return (
        <Button onPress={() => showColAmount(item)} style={[{
            height: scaleSize(70), borderBottomWidth: 1, borderBottomColor: '#DDDDDD', backgroundColor: '#fff',
            padding: scaleSize(8), flexDirection: "row", alignItems: "center"
        }, temptBackgrounColor]} >

            <Text numberOfLines={2} style={[{ fontSize: scaleSize(12), color: '#6A6A6A', fontWeight: "500" }, temptTextColor]} >
                {item?.name || ""}
            </Text>

        </Button>
    );
}

export default ItemProductService;