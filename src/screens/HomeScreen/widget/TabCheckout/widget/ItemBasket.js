import React from 'react';
import {
    View,
    Image
} from 'react-native';

import { scaleSzie, localize } from '@utils';
import { Text } from '@components';
import IMAGE from '@resources';

const ItemBasket = ({ item }) => {
    const { data } = item;
    return (
        <View style={{
            height: scaleSzie(40), backgroundColor: '#0764B0', borderBottomColor: '#fff', borderBottomWidth: 2,
            flexDirection: 'row'
        }} >
            {/* -------- Avatar ------- */}
            <View style={{ width: scaleSzie(45), justifyContent: 'center', alignItems: 'center' }} >
                {
                    item.type === 'Service' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), backgroundColor: 'red', borderRadius: scaleSzie(20) }} ></View> :
                        item.type === 'Extra' ? <View style={{ width: scaleSzie(30), height: scaleSzie(30), backgroundColor: 'green', borderRadius: scaleSzie(20) }} ></View> :
                            <Image source={IMAGE.productBasket} style={{ width: scaleSzie(22), height: scaleSzie(20) }} />
                }
            </View>
            {/* -------- Avatar ------- */}
            <View style={{ flex: 1, flexDirection: 'row' }} >
                {/* ------------ */}
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(13), }} >
                        {data.name}
                    </Text>
                </View>

                {/* ------------ */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                   
                    <Text style={{ color: '#fff', fontSize: scaleSzie(13), }} >
                        { item.type === 'Product' ?  item.quanlitySet : item.serviceName}
                    </Text>
                </View>
                {/* ------------ */}
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: scaleSzie(10),
                }} >
                    <Text style={{ color: '#fff', fontSize: scaleSzie(14), }} >
                        {`$ ${data.price}`}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default ItemBasket;